from flask import Blueprint, request
from app import db
from app.models.models import SensorEntry

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
    entry = SensorEntry(
        # not sure if this should be request.json or form
        # TODO: check client side code
        device_id=request.form['device_id'], 
        sensor_id=request.form['sensor_id'],
        value=request.form['value'],
        timestamp=request.form['timestamp']
    )
    
    try:
        db.session.add(entry)
        db.session.commit()

        return {'success': True}
    except:
        db.session.rollback()

        return {'success': False}