from datetime import date
from pydantic import BaseModel, Field, ConfigDict
from app.models.request import PickupTimeSlot, RequestStatus


class RequestCreate(BaseModel):
    pickup_address: str = Field(max_length=255)
    pickup_postcode: str = Field(max_length=12)

    dropoff_address: str = Field(max_length=255)
    dropoff_postcode: str = Field(max_length=12)

    pickup_date: date
    pickup_time_slot: PickupTimeSlot

    helpers_needed: int = Field(ge=0)

    pickup_floor: int = Field(ge=0)
    pickup_has_lift: bool = False

    dropoff_floor: int = Field(ge=0)
    dropoff_has_lift: bool = False

    pickup_loading_minutes: int = Field(ge=0)
    dropoff_loading_minutes: int = Field(ge=0)


class RequestResponse(BaseModel):
    id: int
    user_id: int

    pickup_address: str
    pickup_postcode: str

    dropoff_address: str
    dropoff_postcode: str

    pickup_date: date
    pickup_time_slot: PickupTimeSlot

    helpers_needed: int

    pickup_floor: int
    pickup_has_lift: bool

    dropoff_floor: int
    dropoff_has_lift: bool

    pickup_loading_minutes: int
    dropoff_loading_minutes: int

    request_status: RequestStatus

    #deprecated
    #class Config:
    #    from_attributes = True
    model_config = ConfigDict(from_attributes=True)