from fastapi import APIRouter
from pydantic import BaseModel
from app.dependencies.db import db_dependency, user_dependency
from app.services.assignment_service import assign_shipment

router = APIRouter(prefix="/assignment", tags=["assignment"])

#packaging action specific inputs into a separate dedicated request class 
#to define a clear contract for the endpoint and make future extension easier
class AssignmentRequest(BaseModel):
    driver_id: int
    shipment_id: int

@router.post("/")
def assign(
    db: db_dependency,
    user: user_dependency,
    data: AssignmentRequest
):
    return assign_shipment(db, data.driver_id, data.shipment_id)