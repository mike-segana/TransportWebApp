from fastapi import APIRouter
from pydantic import BaseModel
from app.dependencies.db import db_dependency, user_dependency, admin_dependency
from app.schemas.shipment import ShipmentCreate
from app.services.shipment_service import create_shipment, get_user_shipments, get_all_shipments, start_transit, end_transit

router = APIRouter(prefix="/shipments", tags=["shipments"])

@router.post("/")
def create(db: db_dependency, admin: admin_dependency, data: ShipmentCreate):
    return create_shipment(db, admin["id"], data)

@router.get("/my")
def my_shipments(db: db_dependency, user: user_dependency):
    return get_user_shipments(db, user["id"])

@router.get("/")
def all_shipments(db: db_dependency, admin: admin_dependency):
    return get_all_shipments(db)

@router.patch("/{shipment_id}/start-trip")
def start_trip(db: db_dependency, admin: admin_dependency, shipment_id: int):
    return start_transit(db, shipment_id)

@router.patch("/{shipment_id}/end-trip")
def end_trip(db: db_dependency, admin: admin_dependency, shipment_id: int):
    return end_transit(db, shipment_id)