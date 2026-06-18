import enum
from sqlalchemy import Column, Integer, String, ForeignKey, Table, Enum
from sqlalchemy.orm import relationship, declarative_base
from app.core.database import Base

class Role(enum.Enum):
    USER = "user"
    ADMIN = "admin"

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(Role, name="role_enum"), nullable=False, default=Role.USER)
    