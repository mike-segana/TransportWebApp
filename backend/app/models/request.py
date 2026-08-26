import enum
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum, Boolean, Date
from datetime import datetime, timezone
from app.core.database import Base

class RequestStatus(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DENIED = "denied"

class PickupTimeSlot(enum.Enum):
    SLOT_07_08 = "07:00-08:00"
    SLOT_08_09 = "08:00-09:00"
    SLOT_09_10 = "09:00-10:00"
    SLOT_10_11 = "10:00-11:00"
    SLOT_11_12 = "11:00-12:00"
    SLOT_12_13 = "12:00-13:00"
    SLOT_13_14 = "13:00-14:00"
    SLOT_14_15 = "14:00-15:00"
    SLOT_15_16 = "15:00-16:00"
    SLOT_16_17 = "16:00-17:00"
    SLOT_17_18 = "17:00-18:00"
    SLOT_18_19 = "18:00-19:00"
    SLOT_19_20 = "19:00-20:00"
    SLOT_20_21 = "20:00-21:00"

class Request(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    #pickup_location = Column(String, nullable=False)
    #dropoff_location = Column(String, nullable=False)
    pickup_address = Column(String(255), nullable=False)
    pickup_postcode = Column(String(12), nullable=False)
    dropoff_address = Column(String(255), nullable=False)
    dropoff_postcode = Column(String(12), nullable=False)

    pickup_date = Column(Date, nullable=False)
    pickup_time_slot = Column(Enum(PickupTimeSlot, name="pickup_time_slot_enum"),nullable=False)
    
    helpers_needed = Column(Integer,nullable=False)
    pickup_floor = Column(Integer, nullable=False)
    pickup_has_lift = Column(Boolean, nullable=False, server_default="false")
    dropoff_floor = Column(Integer, nullable=False)
    dropoff_has_lift = Column(Boolean, nullable=False, server_default="false")

    pickup_loading_minutes = Column(Integer, nullable=False)
    dropoff_loading_minutes = Column(Integer, nullable=False)

    request_status = Column(Enum(RequestStatus, name="request_enum"), nullable=False, default=RequestStatus.PENDING)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)