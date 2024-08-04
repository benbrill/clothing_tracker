import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://admin:D0ntWasteClothes@fit-check-1.cha4ewuauoz3.us-east-1.rds.amazonaws.com/fitcheck'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'fit-check', 'public', 'images')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}
