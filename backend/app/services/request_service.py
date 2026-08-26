from sqlalchemy.orm import Session
from app.models.user import User, Role
from app.models.request import Request, RequestStatus
from app.services.shipment_service import create_shipment
from app.models.shipment import Shipment, Status
from fastapi import HTTPException, status

def create_request(db: Session, user_id: int, data):
    request = Request(
        user_id=user_id,
        pickup_date=data.pickup_date,
        pickup_time_slot=data.pickup_time_slot,

        pickup_address=data.pickup_address,
        pickup_postcode=data.pickup_postcode,

        dropoff_address=data.dropoff_address,
        dropoff_postcode=data.dropoff_postcode,

        helpers_needed=data.helpers_needed,
        pickup_floor=data.pickup_floor,
        pickup_has_lift=data.pickup_has_lift,
        dropoff_floor=data.dropoff_floor,
        dropoff_has_lift=data.dropoff_has_lift,

        pickup_loading_minutes=data.pickup_loading_minutes,
        dropoff_loading_minutes=data.dropoff_loading_minutes,
        request_status=RequestStatus.PENDING,
    )

    try:
        db.add(request)
        db.commit()
        db.refresh(request)
    except Exception:
        db.rollback()
        raise

    return request

def user_view_requests(db: Session, user_id: int):
    return db.query(Request).filter(Request.user_id == user_id).order_by(Request.created_at.desc()).all()

#if request pending, user can delete request
#def user_manage_request

def view_all_requests(db: Session):
    return db.query(Request).order_by(Request.created_at.desc()).all()

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
    shipment = Shipment(
        request_id=request.id,
        user_id=request.user_id,

        pickup_address=request.pickup_address,
        pickup_postcode=request.pickup_postcode,

        dropoff_address=request.dropoff_address,
        dropoff_postcode=request.dropoff_postcode,

        scheduled_date=request.pickup_date,

        pickup_loading_minutes=request.pickup_loading_minutes,
        dropoff_loading_minutes=request.dropoff_loading_minutes,

        status=Status.PENDING,
    )

    request.request_status = RequestStatus.ACCEPTED

    try:
        db.add(shipment)
        #Both operations succeed or neither does.
        db.commit()
        db.refresh(shipment)
    except Exception:
        db.rollback()
        raise
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
    try:
        db.commit()
        db.refresh(request)
    except Exception:
        db.rollback()
        raise
    return request