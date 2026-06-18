from typing import Annotated
#imports SQLAlchemy database session type
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from app.core.database import SessionLocal

#File defines shared FastAPI dependencies for database access, password security and JWT authentication

#loading values from .env which are used to sign JWT tokens and define the encryption algorithm
load_dotenv()
SECRET_KEY = os.getenv('AUTH_SECRET_KEY')
ALGORITHM = os.getenv('AUTH_ALGORITHM')

#database dependency which creates a db session for each request, gives it to API function (yield db) and closes it automatically after request ends
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

db_dependency = Annotated[Session, Depends(get_db)]
#password hashing securely using bcrypt
bcrypt_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
#gets jwt from authorisation header
oauth2_bearer = OAuth2PasswordBearer(tokenUrl='auth/token')
oauth2_bearer_dependency = Annotated[str, Depends(oauth2_bearer)]

async def get_current_user(token: oauth2_bearer_dependency):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get('sub')
        if not SECRET_KEY or not ALGORITHM:
            raise ValueError("Missing JWT configuration")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
        return {'id': int(user_id)}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Could not validate user')
#when a route users Depends(user_dependency) it calls get_current_user, passes the bearer token, decodes the JWT
#returns a dictionary with username and id and so user_dependency means/ is injecting the authenticated user object into this route
user_dependency = Annotated[dict, Depends(get_current_user)]