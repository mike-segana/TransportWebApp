from pydantic import BaseModel
from typing import Optional
from app.models.driver import Availability
#Driver schmas is what is sent and received via APIs

class DriverCreate(BaseModel):
    name: str

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    availability: Optional[Availability] = None

class DriverResponse(BaseModel):
    id: int
    name: str
    availability: Availability

    class Config:
        from_attributes = True