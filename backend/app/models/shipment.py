import enum
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Date
from datetime import datetime, timezone
from app.core.database import Base

class Status(enum.Enum):
    PENDING = "pending"
    ASSIGNED = "assigned"
    IN_TRANSIT = "in_transit"
    COMPLETED = "completed"

class Shipment(Base):
    __tablename__ = "shipments"
    id = Column(Integer, primary_key=True, index=True)
    request_id = Column(Integer, ForeignKey("requests.id"), nullable=False, unique=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)

    pickup_address = Column(String(255), nullable=False)
    pickup_postcode = Column(String(12), nullable=False)


    dropoff_address = Column(String(255), nullable=False)
    dropoff_postcode = Column(String(12), nullable=False)

    scheduled_date = Column(Date, nullable=False)
    pickup_loading_minutes = Column(Integer, nullable=False)
    dropoff_loading_minutes = Column(Integer, nullable=False)

    status = Column(Enum(Status, name="status_enum"), nullable=False, default=Status.PENDING)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)