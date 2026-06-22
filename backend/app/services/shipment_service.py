from sqlalchemy.orm import Session
from app.models.shipment import Shipment, Status

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
    return db.query(Shipment).filter(Shipment.user_id == user_id).all()

def get_all_shipments(db: Session):
    return db.query(Shipment).all()