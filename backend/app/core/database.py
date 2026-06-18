from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#use SQLite database file and if doesnt exist creates it
SQL_ALCHEMY_DATABASE_URL = 'sqlite:///transport_web-app.db'

#engine is core connection later between python and database
#fastapi uses multiple threads so same thread false disables that as sqlite normally restricts db access to one thread
engine = create_engine(SQL_ALCHEMY_DATABASE_URL, connect_args={'check_same_thread': False})

#sessionlocal is creating a temporary workspace to talk to the database
#bind=engine connects session to db

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#base class for all db models, all db tables will inherit from this
#Base is the parent class that turns Python classes into database tables in SQLAlchemy
#It tracks all models, stores schema in Base.metadata and enables create_all() and migrations
Base = declarative_base()