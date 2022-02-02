from flask import Blueprint
from app import db

routes = Blueprint('routes', __name__)

@routes.route('/')
def index():
    return 'Hello World!'