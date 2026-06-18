from pydantic import BaseModel

#file to define what data authentication api's accept and return

class UserCreateRequest(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
