from datetime import date

from pydantic import BaseModel, Field

from app.models.request import PickupTimeSlot, RequestStatus


class RequestCreate(BaseModel):
    pickup_location: str
    dropoff_location: str

    pickup_date: date | None = None
    pickup_time_slot: PickupTimeSlot | None = None

    pickup_address: str | None = None
    pickup_postcode: str | None = None

    dropoff_address: str | None = None
    dropoff_postcode: str | None = None

    helpers_needed: int | None = Field(default=None, ge=0)

    pickup_floor: int | None = Field(default=None, ge=0)
    pickup_has_lift: bool | None = None

    dropoff_floor: int | None = Field(default=None, ge=0)
    dropoff_has_lift: bool | None = None

    pickup_loading_minutes: int | None = Field(
        default=None,
        ge=0,
    )

    dropoff_loading_minutes: int | None = Field(
        default=None,
        ge=0,
    )


class RequestResponse(BaseModel):
    id: int
    pickup_location: str
    dropoff_location: str

    pickup_date: date | None = None
    pickup_time_slot: PickupTimeSlot | None = None

    pickup_address: str | None = None
    pickup_postcode: str | None = None

    dropoff_address: str | None = None
    dropoff_postcode: str | None = None

    helpers_needed: int | None = None

    pickup_floor: int | None = None
    pickup_has_lift: bool | None = None

    dropoff_floor: int | None = None
    dropoff_has_lift: bool | None = None

    pickup_loading_minutes: int | None = None
    dropoff_loading_minutes: int | None = None

    request_status: RequestStatus

    class Config:
        from_attributes = True