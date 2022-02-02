from datetime import datetime

from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from app import db

from flask_login import UserMixin
from app import login


class User(UserMixin, db.Model):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String(64), unique=True, index=True)
    password_hash = Column(String(128))

    def __repr__(self):
        return '<User {}>'.format(self.username)

# @login.user_loader
# def user_loader(id):
#     return User.query.get(int(id))

class Devices(db.Model):
    __tablename__ = 'devices'
    id = Column(Integer, primary_key=True)
    owner_id = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<Devices %r>' % self.name

class SensorType(db.Model):
    __tablename__ = 'sensor_types'
    id = Column(Integer, primary_key=True)
    name = Column(String(30), unique=True)
    description = Column(String(200))

    def __repr__(self):
        return '<SensorType %r>' % self.name
    
class SensorEntry(db.Model):
    __tablename__ = 'sensor_entries'
    id = Column(Integer, primary_key=True)
    device_id = Column(Integer, ForeignKey('devices.id'))
    sensor_id = Column(Integer, ForeignKey('sensor_types.id'))
    value = Column(Integer)
    timestamp = Column(DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<SensorEntry %r>' % self.id


