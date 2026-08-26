from sqlalchemy.orm import Session
from app.models.user import User, Role
from app.models.shipment import Shipment, Status
from app.models.driver import Driver, Availability
from fastapi import HTTPException, status

def create_shipment(db: Session, user_id: int, data):
    shipment = Shipment(
        user_id = user_id,
        pickup_location = data.pickup_location,
        dropoff_location = data.dropoff_location,
        status = Status.PENDING
    )

    db.add(shipment)
    db.commit()
    db.refresh(shipment)
    return shipment

def get_user_shipments(db: Session, user_id: int):
    return db.query(Shipment).filter(Shipment.user_id == user_id).order_by(Shipment.created_at.desc()).all()

def get_all_shipments(db: Session):
    return db.query(Shipment).order_by(Shipment.created_at.desc()).all()

def start_transit(db: Session, shipment_id: int):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found"
        )
    if shipment.status != Status.ASSIGNED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Shipment must be assigned a driver to start trip"
        )
    if shipment.driver_id is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Driver not assigned to shipment"
        )
    driver = db.query(Driver).filter(Driver.id == shipment.driver_id).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found"
        )
    shipment.status = Status.IN_TRANSIT
    driver.availability = Availability.ON_TRIP
    try:
        db.commit()
        db.refresh(shipment)
        db.refresh(driver)
    except Exception:
        db.rollback()
        raise
    return shipment


def end_transit(db: Session, shipment_id: int):
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found"
        )
    if shipment.status == Status.PENDING or shipment.driver_id is None:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Shipment has not beeen assigned a driver"
        )
    if shipment.status == Status.ASSIGNED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Shipment yet to begin transit"
        )
    if shipment.status == Status.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Shipment transport is already completed"
        )
    driver = db.query(Driver).filter(Driver.id == shipment.driver_id).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found"
        )
    if shipment.status == Status.IN_TRANSIT:
        shipment.status = Status.COMPLETED
        driver.availability = Availability.AVAILABLE
        db.commit()
        db.refresh(shipment)
        db.refresh(driver)

        return shipment