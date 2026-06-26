from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
#sqlalchemy is a layer between py and the db, turns classes into db tables (orm) allows to write py instead of raw sql
#SQL_ALCHEMY_DATABASE_URL = 'sqlite:///transport_web-app.db'
SQL_ALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

#engine is core connection later between python and database
engine = create_engine(SQL_ALCHEMY_DATABASE_URL)

#sessionlocal is creating a temporary workspace to talk to the database
#bind=engine connects session to db

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

#base class for all db models, all db tables will inherit from this
#Base is the parent class that turns Python classes into database tables in SQLAlchemy
#It tracks all models, stores schema in Base.metadata and enables create_all() and migrations
Base = declarative_base()