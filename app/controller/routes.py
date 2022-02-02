from flask import Blueprint, request
from app import db
from app.models.models import Devices, SensorEntry, SensorType

api = Blueprint('api_routes', __name__, url_prefix='/api')

@api.route('/')
def index():
    return 'test'


@api.route('/entries/<int:device_id>/<int:start_time>/<int:end_time>')
def get_entries(device_id, start_time, end_time):
    # todo: auth checks
    entries = SensorEntry.query \
        .filter_by(device_id=device_id) \
        .filter(SensorEntry.timestamp.between(start_time, end_time)) \
        .all()
    return entries

@api.route('/entries/push', methods=['POST'])
def push_entry():
    device = Devices.find_by_token(request.json['token'])
    sensor = SensorType.find_by_name(request.json['sensor'])

    if device is None:
        return {'success': False}, 401
    
    if sensor is None:
        return {'success': False}, 400
    
    entry = SensorEntry(
        device_id=device.id, 
        sensor_id=sensor.id,
        value=request.json['value'],
        timestamp=request.json['timestamp']
    )
    
    try:
        db.session.add(entry)
        db.session.commit()

        return {'success': True}
    except:
        db.session.rollback()

        return {'success': False}