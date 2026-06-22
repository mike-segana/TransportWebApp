import enum
from sqlalchemy import Column, Integer, String, Enum
from app.core.database import Base
#Driver models is what is tored

class Availability(enum.Enum):
    AVAILABLE = "available"
    ASSIGNED = "assigned"
    ON_TRIP = "on_trip"
    OFFLINE = "offline"

class Driver(Base):
    __tablename__ = "drivers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    availability = Column(Enum(Availability, name="availability_enum"), nullable=False, default=Availability.AVAILABLE)
    