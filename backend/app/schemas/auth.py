from pydantic import BaseModel, EmailStr, Field

#file to define what data authentication api's accept and return

class UserCreateRequest(BaseModel):
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    email: EmailStr
    username: str = Field(max_length=50)
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
