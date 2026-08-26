from fastapi import APIRouter
from pydantic import BaseModel
from app.dependencies.db import db_dependency, user_dependency, admin_dependency
from app.schemas.request import RequestCreate, PickupTimeSlot, RequestResponse
from app.schemas.shipment import ShipmentResponse
from app.services.request_service import create_request, user_view_requests, view_all_requests, approve_request, deny_request

router = APIRouter(prefix="/requests", tags=["requests"])

@router.post("/", response_model=RequestResponse, status_code=201)
def create(db: db_dependency, user: user_dependency, data: RequestCreate):
    return create_request(db, user["id"], data)

@router.get("/my", response_model=list[RequestResponse])
def my_requests(db: db_dependency, user: user_dependency):
    return user_view_requests(db, user["id"])

@router.get("/", response_model=list[RequestResponse])
def all_requests(db: db_dependency, admin: admin_dependency):
    return view_all_requests(db)

@router.patch("/{request_id}/approve", response_model=ShipmentResponse)
def approve(db: db_dependency, admin: admin_dependency, request_id: int):
    return approve_request(db, request_id)

@router.patch("/{request_id}/deny", response_model=RequestResponse)
def deny(db: db_dependency, admin: admin_dependency, request_id: int):
    return deny_request(db, request_id)

@router.get("/time-slots")
def get_pickup_time_slots():
    return [slot.value for slot in PickupTimeSlot]