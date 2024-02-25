from flask import Flask
from flask import request, jsonify, Response
from flask_cors import CORS
import pandas as pd
import os
import mysql.connector
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

DB_PASSWORD = os.environ.get('DB_PASSWORD')

UPLOAD_FOLDER = 'images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def get_db_connection():
    return mysql.connector.connect(
        host='localhost',
        user='root',
        password="Don'tWasteClothes",
        database='clothing_tracker'
    )


@app.route('/')
def hello_world():
    return 'Hello, World!'

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/add-clothing', methods=['POST'])
def add_clothing():

    file = request.files.get('file')
    file_path = None
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename) #TODO filename seems arbitrary, so can make custom
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

    connection = get_db_connection()
    cursor = connection.cursor()
    query = '''INSERT INTO clothing (category, brand, color, size, price, quantity, purchase, description, thrift, add_date, image_path) 
               VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''
    cursor.execute(query, (request.form.get('category'), request.form.get('brand'), request.form.get('color'), request.form.get('size'), 
                           request.form.get('price'), request.form.get('quantity'), request.form.get('purchase'), request.form.get('description'),
                          0, pd.Timestamp.now(), filename)) # TODO: figure out integer value for Thrift
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({'status': 'success', 'file_path': file_path})

@app.route('/clothing', methods=['GET'])
def get_clothing():
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    cursor.execute('SELECT * FROM clothing')
    rows = cursor.fetchall()
    cursor.close()
    connection.close()
    return jsonify(rows)

@app.route('/add-wear', methods=['POST'])
def add_wear():
    data = request.json
    selected_items = data['items']
    wear_id = generate_new_wear_id()

    # Preparing data for multiple insert
    insert_data = [(wear_id, item_id) for item_id in selected_items]
    query = 'INSERT INTO wears (wear_id, clothing_id) VALUES (%s, %s)'

    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute('SELECT COUNT(wear_id) FROM wears_tracker WHERE DATE(date_time) = DATE(%s)', (pd.Timestamp.now(),))
            change_count = cursor.fetchone()[0]
            cursor.executemany(query, insert_data)
            cursor.execute('INSERT INTO wears_tracker (wear_id, date_time, change_count) VALUES (%s, %s, %s)', 
                           (wear_id, pd.Timestamp.now(), change_count))
            connection.commit()

    return {'status': 'success', 'wear_id': wear_id}


def generate_new_wear_id():
    with get_db_connection() as connection:
        with connection.cursor() as cursor:
            cursor.execute('SELECT MAX(wear_id) FROM wears')
            result = cursor.fetchone()

    # If a maximum wear_id exists, increment it by 1
    # If the table is empty (or if wear_id is not found), start with wear_id 1
    return (result[0] + 1) if result and result[0] else 1




if __name__ == '__main__':
    app.run(debug=True)