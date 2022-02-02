from flask import Blueprint
from app import db

routes = Blueprint('api_routes', __name__, url_prefix='/api')

@routes.route('/')
def index():
    return 'test'