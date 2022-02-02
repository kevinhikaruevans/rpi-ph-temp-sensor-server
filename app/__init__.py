from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from config import Config

db = SQLAlchemy()
login = LoginManager()
login.login_view = 'index'

def create_app(config = Config):
    app = Flask(__name__, static_url_path='', static_folder=config.STATIC_FOLDER)
    app.config.from_object(config)
    
    db.init_app(app)
    login.init_app(app)

    from app.controller.routes import routes
    app.register_blueprint(routes, url_prefix='/api')

    @app.route('/')
    def index():
        return send_from_directory(config.STATIC_FOLDER, 'index.html')
            
    return app