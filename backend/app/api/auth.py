from datetime import timedelta, datetime, timezone
from typing import Annotated
from fastapi import APIRouter, Depends, HTTPException, status, Response
from fastapi.security import OAuth2PasswordRequestForm
from jose import jwt
from dotenv import load_dotenv
import os
from app.models.user import User, Role
from app.dependencies.db import db_dependency, bcrypt_context, user_dependency
from app.schemas.auth import UserCreateRequest, Token
from sqlalchemy.exc import IntegrityError

#file for authentication related endpoints
#file to hande authentication for the app: creating users, logging in existing user and generating JWT access tokens

load_dotenv()

router = APIRouter(
    prefix='/auth',
    tags=['auth']
)

SECRET_KEY = os.getenv("AUTH_SECRET_KEY")
ALGORITHM = os.getenv("AUTH_ALGORITHM")

if not SECRET_KEY or not ALGORITHM:
    raise ValueError("Missing JWT config (env variables)")

#functionality for authentication
#looks up user in db, verifies password etc
def authenticate_user(username: str, password: str, db):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        return None
    if not bcrypt_context.verify(password, user.hashed_password):
        return None
    return user
#creates a JWT payload containing sub: username, id: user id and exp: expiration timestamp
#it then encodes the JWT payload with secret key and algorithm env variables
#def create_access_token(username: str, user_id: int, expires_delta: timedelta):
def create_access_token(user_id: int, expires_delta: timedelta):
    #encode: data stored inside JWT, sub: main user identifier (standard field), id: extra custom data
    encode = {'sub': str(user_id), 'id': user_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({'exp': expires})
    return jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)

#create endpoint for create user
#receives username and password, hashes password with bcrypt.. and stores new User in db and commits the DB transaction
@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_user(db: db_dependency, create_user_request: UserCreateRequest):
    existing_username = (db.query(User).filter(User.username == create_user_request.username).first())
    if existing_username:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username already exists")
    existing_email = (db.query(User).filter(User.email == create_user_request.email).first())
    if existing_email:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already in use")
    #Every publically registered account is a normal USER
    user = User(
        first_name=create_user_request.first_name,
        last_name=create_user_request.last_name,
        email=create_user_request.email,
        username=create_user_request.username,
        hashed_password=bcrypt_context.hash(create_user_request.password),
        role=Role.USER
    )
    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username or email already in use")

    return {"message": "User created successfully", "user_id": user.id, "username": user.username}

@router.post('/token')
async def login(
    response: Response,
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: db_dependency
):
    user = authenticate_user(form_data.username, form_data.password, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate user",
            headers={"WWW-Authenticate": "Bearer"}
        )
    token = create_access_token(user.id, timedelta(minutes=20))

    return {"access_token": token, "token_type": "bearer"}

@router.get('/me')
async def get_user(user: user_dependency, db: db_dependency):
    user = db.query(User).filter(User.id == user["id"]).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    return {"id": user.id, "first_name": user.first_name, "last_name": user.last_name, "email": user.email, "username": user.username, "role": user.role.value}