from datetime import datetime
from flask import Blueprint, request
from sqlalchemy import func
from sqlalchemy.orm import joinedload
from app import db
from app.models.models import Devices, SensorEntry, SensorType

api = Blueprint('api_routes', __name__, url_prefix='/api')

@api.route('/')
def index():
    return 'test'

@api.route('/devices')
def get_devices():
    # nightmares
    # probably should've just used raw sql for this one...
    subquery = SensorEntry.query.with_entities(func.max(SensorEntry.id).label('max_id'), SensorEntry.sensor_id, SensorEntry.device_id) \
        .group_by(SensorEntry.sensor_id, SensorEntry.device_id).subquery()
    entries = SensorEntry.query.with_entities(SensorEntry.device_id, SensorEntry.value, SensorType.name.label("sensor_name")).join(subquery, SensorEntry.id == subquery.c.max_id).join(SensorType, SensorType.id == SensorEntry.sensor_id).subquery()
    
    devices = Devices.query.with_entities(Devices.id, Devices.last_online, Devices.name, entries.c.value, entries.c.sensor_name) \
        .join(entries, Devices.id == entries.c.device_id).all()

    device_list = {}
    for device in devices:
        if device.id not in device_list:
            device_list[device.id] = {
                'id': device.id,
                'name': device.name,
                'last_online': device.last_online,
                'sensors': [{'sensor_name': device.sensor_name, 'value': device.value}]
            }
        else:
            device_list[device.id]['sensors'].append({'sensor_name': device.sensor_name, 'value': device.value})
    return {'devices': list(device_list.values())}

@api.route('/devices/<int:device_id>')
def get_device(device_id):
    device = Devices.query.get(device_id)
    return device

@api.route('/devices/<int:device_id>/sensors/latest')
def get_latest(device_id):
    subquery = SensorEntry.query.with_entities(func.max(SensorEntry.id)).filter_by(device_id=device_id).group_by(SensorEntry.sensor_id)
    latest = SensorEntry.query.filter(SensorEntry.id.in_(subquery)).all()
    return {'latest': list(latest)}

@api.route('/entries/<int:device_id>/<int:start_time>', defaults={'end_time': None})
@api.route('/entries/<int:device_id>/<int:start_time>/<int:end_time>')
def get_entries(device_id, start_time, end_time):
    # todo: auth checks
    if end_time is None:
        end_time = datetime.utcnow()
    
    entries = SensorEntry.query \
        .filter_by(device_id=device_id) \
        .filter(SensorEntry.timestamp.between(start_time, end_time)) \
        .limit(1000) \
        .all()
    
    return {'entries': list(entries)}

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
        timestamp=request.json['timestamp'] if 'timestamp' in request.json else None
    )

    device.last_online = datetime.utcnow()
    
    try:
        db.session.add(entry)
        db.session.commit()

        return {'success': True}
    except Exception as e:
        print(e)
        db.session.rollback()

        return {'success': False}, 400