import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'mysql+mysqlconnector://root:Don\'tWasteClothes@localhost/clothing_tracker'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'clothing_tracker', 'public', 'images')
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}
