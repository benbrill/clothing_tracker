import logging
import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from werkzeug.utils import secure_filename
import pandas as pd
import os
from config import Config
from models import db, Clothing, Wear, WearsTracker
from sqlalchemy import text

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)
migrate = Migrate(app, db)

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
    file_path = None
    if file and allowed_file(file.filename): # TODO - change name of file to unique identifier
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
    
    new_item = Clothing(
        category=request.form.get('category'),
        brand=request.form.get('brand'),
        color=request.form.get('color'),
        size=request.form.get('size'),
        price=float(request.form.get('price')),
        description=request.form.get('description'),
        quantity=int(request.form.get('quantity')),
        purchase=pd.to_datetime(request.form.get('purchase')).date(),
        image_path=filename
    )
    
    db.session.add(new_item)
    db.session.commit()
    
    return jsonify({'status': 'success', 'file_path': file_path})

@app.route('/clothing', methods=['GET'])
def get_clothing():
    try:
        # logging.info("Fetching all clothing items")
        items = Clothing.query.all()
        # logging.info(f"Items fetched: {items}")
        items_list = [item.as_dict() for item in items]
        # logging.info(f"Items list to return: {items_list}")
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

        change_count = WearsTracker.query.filter(db.func.date(WearsTracker.date_time) == pd.Timestamp.now().date()).count()
        
        new_wears_tracker = WearsTracker(
            wear_id=wear_id,
            date_time=pd.Timestamp.now(),
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
    date_str = request.args.get('date')
    if not date_str:
        date = datetime.datetime.now().date()
    else:
        date = datetime.datetime.strptime(date_str, '%Y-%m-%d').date()
    logging.info(f"Fetching wears for date: {date}")
    wears = WearsTracker.query.filter(db.func.date(WearsTracker.date_time) == date).all()
    logging.info(f"Wears fetched: {wears}")
    
    result = []
    for wear_tracker in wears:
        wear_items= Wear.query.filter_by(wear_id=wear_tracker.wear_id).all()
        items = [Clothing.query.get(wear_item.clothing_id) for wear_item in wear_items]
        wear_result = {
            'wear_id': wear_tracker.wear_id,
            'date_time': wear_tracker.date_time,
            'change_count': wear_tracker.change_count,
            'items': [{
                'id': item.id,
                'category': item.category,
                'brand': item.brand,
                'color': item.color,
                'size': item.size,
                'price': item.price,
                'quantity': item.quantity,
                'purchase': item.purchase,
                'image_path': item.image_path
            } for item in items]
        }
        result.append(wear_result)

    
    logging.info(f"Result: {result}")
    return jsonify(result)

@app.route('/get_today_wears', methods=['GET'])
def get_today_wears():
    date = datetime.datetime.now().date()
    logging.info(f"Fetching wears for date: {date}")
    wears = WearsTracker.query.filter(db.func.date(WearsTracker.date_time) == date).all()
    logging.info(f"Wears fetched: {wears}")


    result = []
    for wear_tracker in wears:
        wear_items= Wear.query.filter_by(wear_id=wear_tracker.wear_id).all()
        items = [Clothing.query.get(wear_item.clothing_id) for wear_item in wear_items]
        wear_result = {
            'wear_id': wear_tracker.wear_id,
            'date_time': wear_tracker.date_time,
            'change_count': wear_tracker.change_count,
            'items': [{
                'id': item.id,
                'category': item.category,
                'brand': item.brand,
                'color': item.color,
                'size': item.size,
                'price': item.price,
                'quantity': item.quantity,
                'purchase': item.purchase,
                'image_path': item.image_path
            } for item in items]
        }
        result.append(wear_result)
    logging.info(f"Result: {result}")
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)
