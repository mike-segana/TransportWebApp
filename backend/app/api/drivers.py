from fastapi import APIRouter
from pydantic import BaseModel
from app.dependencies.db import db_dependency, admin_dependency
from app.schemas.driver import DriverCreate, DriverUpdate, DriverResponse
from app.services.driver_service import add_driver, get_drivers, update_availability
from app.models.driver import Availability

router = APIRouter(prefix="/drivers", tags=["drivers"])

#packaging action specific inputs into a separate dedicated request class 
#to define a clear contract for the endpoint and make future extension easier
class StatusUpdate(BaseModel):
    new_status: Availability

@router.post("/", response_model=DriverResponse, status_code=201)
def create_driver(db: db_dependency, admin: admin_dependency, data: DriverCreate):
    return add_driver(db, data)

@router.get("/", response_model=list[DriverResponse])
def get_all_drivers(db: db_dependency, admin: admin_dependency):
    return get_drivers(db)

@router.patch("/{driver_id}", response_model=DriverResponse)
def update_driver_status(
    db: db_dependency,
    driver_id: int,
    data: StatusUpdate,
    admin: admin_dependency
):
    return update_availability(db, driver_id, data.new_status)