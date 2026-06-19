from fastapi import APIRouter
from app.dependencies.db import db_dependency, user_dependency
from app.schemas.shipment import ShipmentCreate
from app.services.shipment_service import create_shipment, get_user_shipments, get_all_shipments

router = APIRouter(prefix="/shipments", tags=["shipments"])

@router.post("/")
def create(db: db_dependency, user: user_dependency, data: ShipmentCreate):
    return create_shipment(db, user["id"], data)

@router.get("/my")
def my_shipments(db: db_dependency, user:user_dependency):
    return get_user_shipments(db, user["id"])

@router.get("/all")
def all_shipments(db: db_dependency):
    return get_all_shipments(db)