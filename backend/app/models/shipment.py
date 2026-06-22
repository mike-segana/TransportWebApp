import enum
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
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
    user_id = Column(Integer, ForeignKey("users.id"))
    driver_id = Column(Integer, ForeignKey("drivers.id"), nullable=True)
    pickup_location = Column(String, nullable=False)
    dropoff_location = Column(String, nullable=False)
    status = Column(Enum(Status, name="status_enum"), nullable=False, default=Status.PENDING)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))