from fastapi import APIRouter
from pydantic import BaseModel
from app.dependencies.db import db_dependency, user_dependency, admin_dependency
from app.schemas.shipment import ShipmentResponse
from app.services.shipment_service import create_shipment, get_user_shipments, get_all_shipments, start_transit, end_transit

router = APIRouter(prefix="/shipments", tags=["shipments"])

@router.get("/my", response_model=list[ShipmentResponse])
def my_shipments(db: db_dependency, user: user_dependency):
    return get_user_shipments(db, user["id"])

@router.get("/", response_model=list[ShipmentResponse])
def all_shipments(db: db_dependency, admin: admin_dependency):
    return get_all_shipments(db)

@router.patch("/{shipment_id}/start-trip", response_model=ShipmentResponse)
def start_trip(db: db_dependency, admin: admin_dependency, shipment_id: int):
    return start_transit(db, shipment_id)

@router.patch("/{shipment_id}/end-trip", response_model=ShipmentResponse)
def end_trip(db: db_dependency, admin: admin_dependency, shipment_id: int):
    return end_transit(db, shipment_id)