from sqlalchemy.orm import Session
from app.models.user import User, Role
from app.models.request import Request, RequestStatus
from app.services.shipment_service import create_shipment
from app.schemas.shipment import ShipmentCreate
from fastapi import HTTPException, status

def create_request(db: Session, user_id: int, data):
    request = Request(
        user_id = user_id,
        pickup_location = data.pickup_location,
        dropoff_location = data.dropoff_location,
        request_status = RequestStatus.PENDING
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request

def user_view_requests(db: Session, user_id: int):
    return db.query(Request).filter(Request.user_id == user_id).all()

#if request pending, user can delete request
#def user_manage_request

def view_all_requests(db: Session):
    return db.query(Request).all()

def approve_request(db: Session, request_id: int):
    request = db.query(Request).filter(Request.id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    if request.request_status != RequestStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only pending requests can be approved"
        )
    shipment_data = ShipmentCreate(
        pickup_location = request.pickup_location,
        dropoff_location = request.dropoff_location
    )
    shipment = create_shipment(db, request.user_id, shipment_data)
    request.request_status = RequestStatus.ACCEPTED
    db.commit()
    return shipment

def deny_request(db: Session, request_id: int):
    request = db.query(Request).filter(Request.id == request_id).first()
    if not request:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Request not found"
        )
    if request.request_status != RequestStatus.PENDING:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Only pending requests can be denied"
        )

    request.request_status = RequestStatus.DENIED
    db.commit()
    db.refresh(request)
    return request