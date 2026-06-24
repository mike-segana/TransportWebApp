from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.models.driver import Driver, Availability

def add_driver(db: Session, data):
    driver = Driver(
        name = data.name,
        availability = Availability.AVAILABLE
    )
    db.add(driver)
    db.commit()
    db.refresh(driver)
    #return sends created driver back to API as response
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