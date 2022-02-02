from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config

db = SQLAlchemy()
login = LoginManager()
login.login_view = 'index'

def create_app(config = Config):
    app = Flask(__name__)
    app.config.from_object(config)
    #app.static_folder = 'static'
    #app.template_folder = 'templates'

    db.init_app(app)
    login.init_app(app)

    from app.controller.routes import routes
    app.register_blueprint(routes)

    return app