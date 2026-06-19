from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from datetime import datetime, timezone
from app.core.database import Base

class Shipment(Base):
    __tablename__ = "Shipments"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    pickup_location = Column(String, nullable=False)
    dropoff_location = Column(String, nullable=False)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))