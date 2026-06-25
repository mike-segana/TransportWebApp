import enum
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from datetime import datetime, timezone
from app.core.database import Base

class RequestStatus(enum.Enum):
    PENDING = "pending"
    ACCEPTED = "accepted"
    DENIED = "denied"

class Request(Base):
    __tablename__ = "requests"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    pickup_location = Column(String, nullable=False)
    dropoff_location = Column(String, nullable=False)
    request_status = Column(Enum(RequestStatus, name="request_enum"), nullable=False, default=RequestStatus.PENDING)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
