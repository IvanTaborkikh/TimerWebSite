from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
import os
from flask_login import LoginManager
from datetime import datetime, timedelta


db = SQLAlchemy()
DB_NAME = "database.db"
def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'SPERMBEER'

    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, DB_NAME)
    db.init_app(app)

    from .views import views
    from .auth import auth

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import User, Note

    create_databse(app)

    login_manager = LoginManager()
    login_manager.login_view = 'auth.login'
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))

    return app

def create_databse(app):
    db_path = os.path.join(os.path.abspath(os.path.dirname(__file__)), DB_NAME)

    if not os.path.exists(db_path):
        with app.app_context():
            db.create_all()
        print('Created Databse!')