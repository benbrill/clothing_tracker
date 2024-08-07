import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SQLALCHEMY_DATABASE_URI = f'mysql+pymysql://admin:{os.environ.get("AMAZON_RDS_PW")}@{os.environ.get("AMAZON_ENDPOINT")}/fitcheck'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'fit-check', 'public', 'images')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
    
