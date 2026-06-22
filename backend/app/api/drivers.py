from fastapi import APIRouter
from pydantic import BaseModel
from app.dependencies.db import db_dependency, user_dependency
from app.schemas.driver import DriverCreate, DriverUpdate
from app.services.driver_service import add_driver, get_drivers, update_status
from app.models.driver import Availability

router = APIRouter(prefix="/drivers", tags=["drivers"])

class StatusUpdate(BaseModel):
    new_status: Availability

@router.post("/")
def create_driver(db: db_dependency, user: user_dependency, data: DriverCreate):
    return add_driver(db, data)

@router.get("/")
def get_all_drivers(db: db_dependency, user: user_dependency):
    return get_drivers(db)

#@router.post("/update")
@router.patch("/{driver_id}")
def update_driver_status(
    db: db_dependency,
    driver_id: int,
    #new_status: Availability,
    data: StatusUpdate,
    user: user_dependency
):
    return update_status(db, driver_id, data.new_status)