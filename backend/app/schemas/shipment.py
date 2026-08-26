from datetime import date, datetime
from pydantic import BaseModel, ConfigDict
from app.models.shipment import Status

class ShipmentResponse(BaseModel):
    id: int
    request_id: int
    user_id: int
    driver_id: int | None = None

    pickup_address: str
    pickup_postcode: str

    dropoff_address: str
    dropoff_postcode: str

    scheduled_date: date

    pickup_loading_minutes: int
    dropoff_loading_minutes: int

    status: Status
    created_at: datetime
    
    #the following allows values to come from object attributes(e.g. shipment.id) instead of only dictionaries
    #deprecated
    #class Config:
    #   from_attributes = True
    model_config = ConfigDict(from_attributes=True)