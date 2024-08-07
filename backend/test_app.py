from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from werkzeug.utils import secure_filename
import pandas as pd
import os
from config import Config
from models import db, Item, Wear, WearsTracker
import logging

logging.basicConfig(level=logging.INFO)

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
db.init_app(app)

with app.app_context():
    db.create_all()

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
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
    
    new_item = Item(
        category=request.form.get('category'),
        brand=request.form.get('brand'),
        color=request.form.get('color'),
        size=request.form.get('size'),
        price=float(request.form.get('price')),
        quantity=int(request.form.get('quantity')),
        purchase=pd.to_datetime(request.form.get('purchase')).date(),
        image=filename
    )
    
    db.session.add(new_item)
    db.session.commit()
    
    return jsonify({'status': 'success', 'file_path': file_path})

@app.route('/clothing', methods=['GET'])
def get_clothing():
    try:
        logging.info("Fetching all clothing items")
        items = Item.query.all()
        logging.info(f"Items fetched: {items}")
        items_list = [item.as_dict() for item in items]
        logging.info(f"Items list to return: {items_list}")
        return jsonify(items_list)
    except Exception as e:
        logging.error(f"Error fetching clothing items: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/add-wear', methods=['POST'])
def add_wear():
    data = request.json
    selected_items = data['items']
    wear_id = generate_new_wear_id()

    insert_data = [Wear(wear_id=wear_id, clothing_id=item_id) for item_id in selected_items]
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

def generate_new_wear_id():
    last_wear = Wear.query.order_by(Wear.wear_id.desc()).first()
    return (last_wear.wear_id + 1) if last_wear else 1

if __name__ == '__main__':
    app.run(debug=True)
