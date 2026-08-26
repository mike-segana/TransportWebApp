from pydantic import BaseModel, EmailStr, Field, ConfigDict
from app.models.driver import Availability
#Driver schmas is what is sent and received via APIs

class DriverCreate(BaseModel):
    first_name: str = Field(max_length=100)
    last_name: str = Field(max_length=100)
    email: EmailStr
    username: str = Field(max_length=50)

class DriverUpdate(BaseModel):
    first_name: str | None = Field(default=None, max_length=100)
    last_name: str | None = Field(default=None, max_length=100)
    email: EmailStr | None = None
    availability: Availability | None = None

class DriverResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    email: EmailStr
    username: str
    availability: Availability

    #depracated
    #class Config:
    #    from_attributes = True
    model_config = ConfigDict(from_attributes=True)