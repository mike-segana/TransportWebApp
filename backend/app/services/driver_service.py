from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.driver import Driver, Availability
from app.schemas.driver import DriverCreate, DriverUpdate

def add_driver(db: Session, data: DriverCreate):
    existing_mail = db.query(Driver).filter(Driver.email == data.email).first()
    if existing_mail:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Driver email already in use")
    existing_username = db.query(Driver).filter(Driver.username == data.username).first()
    if existing_username:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Driver username already in use")
    driver = Driver(
        first_name=data.first_name,
        last_name=data.last_name,
        email=data.email,
        username=data.username,
        availability=Availability.AVAILABLE
    )
    try:
        db.add(driver)
        db.commit()
        db.refresh(driver)
    except Exception:
        db.rollback()
        raise
    return driver

def get_drivers(db: Session):
    return db.query(Driver).all()
    
def update_availability(db: Session, driver_id: int, new_status: Availability):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()

    if not driver:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Driver not found"
        )
    if driver.availability not in [Availability.AVAILABLE, Availability.OFFLINE]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Driver status cannot be updated while on a job"
        )
    if new_status not in [Availability.AVAILABLE, Availability.OFFLINE]:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Invalid driver status transition"
        )
    driver.availability = new_status
    db.commit()
    db.refresh(driver)

    return driver