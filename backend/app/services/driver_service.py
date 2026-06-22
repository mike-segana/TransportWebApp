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
    
def update_status(db: Session, driver_id: int, new_status: Availability):
    driver = db.query(Driver).filter(Driver.id == driver_id).first()

    if not driver:
        return None
    
    driver.availability = new_status
    db.commit()
    db.refresh(driver)

    return driver