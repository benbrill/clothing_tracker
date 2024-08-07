from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Clothing(db.Model):
    __tablename__ = 'clothing'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    category = db.Column(db.String(100))
    brand = db.Column(db.String(100))
    color = db.Column(db.String(100))
    size = db.Column(db.String(100))
    price = db.Column(db.Float)
    quantity = db.Column(db.Integer)
    purchase = db.Column(db.Date)
    description = db.Column(db.String(255))
    add_date = db.Column(db.DateTime, default=datetime.now)
    thrift = db.Column(db.Boolean, default=False)
    image_path = db.Column(db.String(255))

    def as_dict(self):
        return {
            'id': self.id,
            'category': self.category,
            'brand': self.brand,
            'color': self.color,
            'size': self.size,
            'price': self.price,
            'quantity': self.quantity,
            'purchase': self.purchase,
            'description': self.description,
            'add_date': self.add_date,
            'thrift': self.thrift,
            'image_path': self.image_path
        }

class Wear(db.Model):
    __tablename__ = 'wears'
    id = db.Column(db.Integer, primary_key=True)
    wear_id = db.Column(db.Integer)
    clothing_id = db.Column(db.Integer, db.ForeignKey('clothing.id'))
    # item = db.relationship('Item', backref=db.backref('wears', lazy=True))

class WearsTracker(db.Model):
    __tablename__ = 'wears_tracker'
    wear_id = db.Column(db.Integer, db.ForeignKey('wears.wear_id'), primary_key=True)
    date_time = db.Column(db.DateTime, primary_key=True)
    change_count = db.Column(db.Integer)
