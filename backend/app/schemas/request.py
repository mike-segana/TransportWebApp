from pydantic import BaseModel
from typing import Optional
from app.models.request import RequestStatus

class RequestCreate(BaseModel):
    pickup_location: str
    dropoff_location: str
    description: Optional[str] = None

class RequestResponse(BaseModel):
    id: int
    pickup_location: str
    dropoff_location: str
    request_status: RequestStatus

    class config:
        from_attribute = True