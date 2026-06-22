from sqlalchemy.orm import Session
from app.models.driver import Driver, Availability
from app.models.shipment import Shipment, Status
from fastapi import HTTPException, status

def assign_shipment(db: Session, driver_id: int, shipment_id: int):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()
    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Driver not found"
        )
    if driver.availability != Availability.AVAILABLE:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Driver not available"
        )
    shipment = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not shipment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found"
        )
    if shipment.status != Status.PENDING:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Shipment not pending"
        )
    driver.availability = Availability.ASSIGNED
    shipment.driver_id = driver.id
    shipment.status = Status.ASSIGNED

    db.commit()
    db.refresh(driver)
    db.refresh(shipment)

    return shipment