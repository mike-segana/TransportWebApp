from pydantic import BaseModel
from typing import Optional

class ShipmentCreate(BaseModel):
    pickup_location: str
    dropoff_location: str
    description: Optional[str] = None

class ShipmentResponse(BaseModel):
    id: int
    pickup_location: str
    dropoff_location: str
    status: str
    
    #the following allows values to come from object attributes(e.g. shipment.id) instead of only dictionaries
    class Config:
        from_attributes = True