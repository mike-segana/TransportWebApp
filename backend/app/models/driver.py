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
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    email = Column(String(254), nullable=False, unique=True)
    username = Column(String(50), nullable=False, unique=True, index=True)
    availability = Column(Enum(Availability, name="availability_enum"), nullable=False, default=Availability.AVAILABLE)
    