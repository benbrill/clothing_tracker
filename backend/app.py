import logging
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
import os
import boto3
from config import Config
from models import db, Clothing, Wear, WearsTracker
from sqlalchemy import text, func

app = Flask(__name__)
app.config.from_object(Config)
CORS(app, origins=['http://localhost:3000', 'https://fit-check-nine.vercel.app'])
db.init_app(app)
migrate = Migrate(app, db)

S3_BUCKET = os.getenv('S3_BUCKET_NAME')
AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

# Set up logging
logging.basicConfig(level=logging.INFO)

with app.app_context():
    db.create_all()

@app.route('/test-db-connection', methods=['GET'])
def test_db_connection():
    try:
        result = db.session.execute(text('SELECT * FROM clothing'))
        logging.info(f"Database connection successful, current time: {result[0]}")
        return jsonify({'status': 'success', 'current_time': result[0]})
    except Exception as e:
        logging.error(f"Database connection error: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/add-clothing', methods=['POST'])
def add_clothing():
    file = request.files.get('file')
    image_url = None
    if file and allowed_file(file.filename):
        # Generate a unique identifier for the filename
        filename = secure_filename(file.filename)
        logging.info(f"Uploading file to S3: {file.filename}")
        logging.info(f"S3_BUCKET: {S3_BUCKET}")

        try:
            s3_client.upload_fileobj(
                file,
                S3_BUCKET,
                filename
            )
            # Construct the S3 URL
            image_url = f"https://{S3_BUCKET}.s3.amazonaws.com/{filename}"
        except Exception as e:
            logging.info("Exception: ", e)
            return jsonify({'status': 'error', 'message': f"Failed to upload to S3: {str(e)}"}), 500
    new_item = Clothing(
        category=request.form.get('category'),
        brand=request.form.get('brand'),
        color=request.form.get('color'),
        size=request.form.get('size'),
        price=float(request.form.get('price')),
        description=request.form.get('description'),
        quantity=int(request.form.get('quantity')),
        purchase=datetime.datetime.strptime(request.form.get('purchase'),"%Y-%m-%d").date(),
        image_path=image_url
    )

    db.session.add(new_item)
    db.session.commit()

    return jsonify({'status': 'success', 'image_url': image_url})

@app.route('/clothing', methods=['GET'])
def get_clothing():
    try:
        # logging.info("Fetching all clothing items")
        # items = Clothing.query.all()
        wear_count_subquery = (
            db.session.query(
                Wear.clothing_id,
                func.count(Wear.clothing_id).label('wear_count'),
                func.max(WearsTracker.date_time).label('last_wear_date')
            )
            .join(WearsTracker, Wear.wear_id == WearsTracker.wear_id)
            .group_by(Wear.clothing_id)
            .subquery()
        )
        # Main query using Wear.query and joining with Clothing
        items = (
            Clothing.query
            .outerjoin(wear_count_subquery, Clothing.id == wear_count_subquery.c.clothing_id)
            .add_columns(wear_count_subquery.c.wear_count, wear_count_subquery.c.last_wear_date)
            .all()
        )
        # logging.info(f"Items fetched: {items}")
        items_list = [{**item.as_dict(), **{"wear_count": wear, "last_wear_date": last_wear_date}} for (item, wear, last_wear_date) in items]
        # logging.info(f"Items list to return: {items_list}")
        # logging.info(f"Items fetched: {items_list}")
        return jsonify(items_list)
    except Exception as e:
        logging.error(f"Error fetching clothing items: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/add-wear', methods=['POST'])
def add_wear():
    try:
        data = request.json
        selected_items = data['items']
        wear_id = generate_new_wear_id()
        

        insert_data = [Wear(wear_id=wear_id, clothing_id=clothing_id) for clothing_id in selected_items]
        db.session.bulk_save_objects(insert_data)
        db.session.commit()

        change_count = WearsTracker.query.filter(db.func.date(WearsTracker.date_time) == datetime.datetime.now(tz=datetime.timezone.utc).date()).count()
        
        new_wears_tracker = WearsTracker(
            wear_id=wear_id,
            date_time=datetime.datetime.now(tz=datetime.timezone.utc),
            change_count=change_count
        )
        
        db.session.add(new_wears_tracker)
        db.session.commit()

        return {'status': 'success', 'wear_id': wear_id}
    except Exception as e:
        logging.error(f"Error adding wear: {e}")
        logging.info(f"Adding wear with id: {wear_id} and items: {selected_items}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

def generate_new_wear_id():
    last_wear = Wear.query.order_by(Wear.wear_id.desc()).first()
    return (last_wear.wear_id + 1) if last_wear else 1

@app.route('/wears', methods=['GET'])
def get_wears_by_date():
    date = request.args.get('date')
    logging.info(f"Fetching wears for date: {date}")
    # wears = WearsTracker.query.filter(db.func.date(WearsTracker.date_time) == date).all()
    result = (
    db.session.query(WearsTracker, Clothing)
    .outerjoin(Wear, WearsTracker.wear_id == Wear.wear_id)
    .outerjoin(Clothing, Wear.clothing_id == Clothing.id)
    .filter(func.date(WearsTracker.date_time) == date)
    .all()
    )
    json_result = []

    for wears_tracker, clothing in result:
        # Create a dictionary for each row combining attributes from both tables
        row_dict = {
            **{column.name: getattr(wears_tracker, column.name) for column in WearsTracker.__table__.columns},
            **{column.name: getattr(clothing, column.name) for column in Clothing.__table__.columns},
        }
        # Convert datetime fields to strings if needed
        if 'date_time' in row_dict and row_dict['date_time']:
            row_dict['date_time'] = row_dict['date_time']
        if 'purchase' in row_dict and row_dict['purchase']:
            row_dict['purchase'] = row_dict['purchase']

        json_result.append(row_dict)

    
    logging.info(f"Result: {result}")
    return jsonify(json_result)

@app.route('/delete-wear', methods=['POST']) 
def delete_wear():
    data = request.json
    wear_id = data['wear_id']
    logging.info(f"Deleting wear with id: {wear_id}")
    try:
        Wear.query.filter_by(wear_id=wear_id).delete()
        WearsTracker.query.filter_by(wear_id=wear_id).delete()
        db.session.commit()
        return {'status': 'success'}
    except Exception as e:
        logging.error(f"Error deleting wear: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@app.route('/update-wear', methods=['POST'])
def update_wear():
    data = request.json
    wear_id = data['wear_id']
    selected_items = data['items']
    logging.info(f"Updating wear with id: {wear_id}")
    try:
        Wear.query.filter_by(wear_id=wear_id).delete()
        insert_data = [Wear(wear_id=wear_id, clothing_id=clothing_id) for clothing_id in selected_items]
        db.session.bulk_save_objects(insert_data)
        db.session.commit()
        return {'status': 'success'}
    except Exception as e:
        logging.error(f"Error updating wear: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@app.route('/update-clothing', methods=['POST'])
def update_clothing():
    data = request.json
    clothing_id = data['id']
    logging.info(f"Updating clothing with id: {clothing_id}")
    try:
        Clothing.query.filter_by(id=clothing_id).update(data)
        db.session.commit()
        return {'status': 'success'}
    except Exception as e:
        logging.error(f"Error updating clothing: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/delete-clothing', methods=['POST'])
def delete_clothing():
    data = request.json
    clothing_id = data['id']
    logging.info(f"Deleting clothing with id: {clothing_id}")
    try:
        Clothing.query.filter_by(id=clothing_id).delete()
        db.session.commit()
        return {'status': 'success'}
    except Exception as e:
        logging.error(f"Error deleting clothing: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500
    
@app.route('/wears/by-week', methods=['GET'])
def get_wears_by_week():
    date = request.args.get('date')
    logging.info(f"Fetching wears for week starting from date: {date}")
    # wears = WearsTracker.query.filter(db.func.date(WearsTracker.date_time) == date).all()
    result = (
    db.session.query(WearsTracker, Clothing)
    .outerjoin(Wear, WearsTracker.wear_id == Wear.wear_id)
    .outerjoin(Clothing, Wear.clothing_id == Clothing.id)
    .filter(func.date(WearsTracker.date_time) >= date)
    .filter(func.date(WearsTracker.date_time) <= (datetime.datetime.strptime(date, "%Y-%m-%d") + datetime.timedelta(days=6)).date())
    .all()
    )
    json_result = []

    for wears_tracker, clothing in result:
        # Create a dictionary for each row combining attributes from both tables
        row_dict = {
            **{column.name: getattr(wears_tracker, column.name) for column in WearsTracker.__table__.columns},
            **{column.name: getattr(clothing, column.name) for column in Clothing.__table__.columns},
        }
        # Convert datetime fields to strings if needed
        if 'date_time' in row_dict and row_dict['date_time']:
            row_dict['date_time'] = row_dict['date_time']
        if 'purchase' in row_dict and row_dict['purchase']:
            row_dict['purchase'] = row_dict['purchase']

        json_result.append(row_dict)

    
    logging.info(f"Result: {result}")
    return jsonify(json_result)

@app.route('/wears/by-week-grouped', methods=['GET'])
def get_wears_by_week_grouped():
    date = request.args.get('date')
    logging.info(f"Fetching wears for week starting from date: {date}")
    
    # Query the database to get wears and clothing joined by wear_id
    result = (
        db.session.query(WearsTracker, Clothing)
        .outerjoin(Wear, WearsTracker.wear_id == Wear.wear_id)
        .outerjoin(Clothing, Wear.clothing_id == Clothing.id)
        .filter(func.date(WearsTracker.date_time) >= date)
        .filter(func.date(WearsTracker.date_time) <= (datetime.datetime.strptime(date, "%Y-%m-%d") + datetime.timedelta(days=6)).date())
        .all()
    )

    # Initialize a dictionary to group results
    grouped_result = {}

    for wears_tracker, clothing in result:
        # Create a dictionary for each row combining attributes from both tables
        row_dict = {
            **{column.name: getattr(wears_tracker, column.name) for column in WearsTracker.__table__.columns},
            **{column.name: getattr(clothing, column.name) for column in Clothing.__table__.columns},
        }
        
        # Convert datetime fields to strings if needed
        if 'date_time' in row_dict and row_dict['date_time']:
            row_dict['date_time'] = row_dict['date_time'].strftime("%Y-%m-%d") # Convert to ISO format string
        if 'purchase' in row_dict and row_dict['purchase']:
            row_dict['purchase'] = row_dict['purchase'] # Convert to ISO format string
        
        # Group by date_time
        date_time_str = row_dict['date_time']
        if date_time_str not in grouped_result:
            grouped_result[date_time_str] = {}

        # Group by wear_id within the date_time group
        wear_id = row_dict['wear_id']
        if wear_id not in grouped_result[date_time_str]:
            grouped_result[date_time_str][wear_id] = []

        # Append the row to the appropriate group
        grouped_result[date_time_str][wear_id].append(row_dict)

    # logging.info(f"Grouped Result: {grouped_result}")
    return jsonify(grouped_result)


@app.route('/get_today_wears', methods=['GET'])
def get_today_wears():
    date = datetime.datetime.now(tz=datetime.timezone.utc).date()
    logging.info(f"Fetching wears for date: {date}")
    # wears = WearsTracker.query.filter(db.func.date(WearsTracker.date_time) == date).all()
    result = (
    db.session.query(WearsTracker, Clothing)
    .outerjoin(Wear, WearsTracker.wear_id == Wear.wear_id)
    .outerjoin(Clothing, Wear.clothing_id == Clothing.id)
    .filter(func.date(WearsTracker.date_time) == date)
    .all()
    )
    json_result = []

    for wears_tracker, clothing in result:
        # Create a dictionary for each row combining attributes from both tables
        row_dict = {
            **{column.name: getattr(wears_tracker, column.name) for column in WearsTracker.__table__.columns},
            **{column.name: getattr(clothing, column.name) for column in Clothing.__table__.columns},
        }
        # Convert datetime fields to strings if needed
        if 'date_time' in row_dict and row_dict['date_time']:
            row_dict['date_time'] = row_dict['date_time']
        if 'purchase' in row_dict and row_dict['purchase']:
            row_dict['purchase'] = row_dict['purchase']

        json_result.append(row_dict)

    # result = []
    # for wear_tracker in wears:
    #     wear_items= Wear.query.filter_by(wear_id=wear_tracker.wear_id).all()
    #     items = [Clothing.query.get(wear_item.clothing_id) for wear_item in wear_items]
    #     wear_result = {
    #         'wear_id': wear_tracker.wear_id,
    #         'date_time': wear_tracker.date_time,
    #         'change_count': wear_tracker.change_count,
    #         'items': [{
    #             'id': item.id,
    #             'category': item.category,
    #             'brand': item.brand,
    #             'color': item.color,
    #             'size': item.size,
    #             'price': item.price,
    #             'quantity': item.quantity,
    #             'purchase': item.purchase,
    #             'image_path': item.image_path
    #         } for item in items]
    #     }
    #     result.append(wear_result)
    logging.info(f"Result: {json_result}")
    return jsonify(json_result)




if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(debug=os.environ.get('DEBUG'), host='0.0.0.0', port=port)
