from typing import Annotated
from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError
from dotenv import load_dotenv
import os
from app.core.database import SessionLocal
from app.models.user import User, Role

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

async def get_current_user(request: Request):
    token = request.cookies.get("access_token") #gets token from HttpOnly cookie
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) #verify and extract signature
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
        return {"id": int(user_id)}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Could not validate user")

#when a route users Depends(user_dependency) it calls get_current_user, passes the bearer token, decodes the JWT
#returns a dictionary with username and id and so user_dependency means/ is injecting the authenticated user object into this route
user_dependency = Annotated[dict, Depends(get_current_user)]

def check_admin(user: user_dependency, db: db_dependency):
    db_user = db.query(User).filter(User.id == user["id"]).first()
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    if db_user.role != Role.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access only"
        )
    return user

admin_dependency = Annotated[dict, Depends(check_admin)]