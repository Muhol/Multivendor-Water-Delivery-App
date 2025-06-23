from db.session import Base
from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Text, Boolean,Enum, TIMESTAMP, Float
from sqlalchemy.dialects.postgresql import UUID
from enum import Enum as PyEnum
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography


class VerificationStatus(PyEnum):
    PENDING = "pending"
    VERIFIED = "verified"
    REJECTED = "rejected"


class User(Base):
  __tablename__= "Users"
  id = Column(UUID(as_uuid=True), primary_key=True, default= uuid.uuid4, index=True)
  clerk_id = Column(String, nullable=False, index=True)
  full_name = Column(String, nullable=True, index=True)
  email= Column(String, nullable=False, unique=True)
  phone_number= Column(String, nullable=True)
  profile_pic= Column(Text, nullable=True)
  location_address= Column(Text, nullable=True)
  lat= Column(Float, nullable=True)
  lng= Column(Float, nullable=True)
  location = Column(Geography(geometry_type="POINT", srid=4326))
  is_active= Column(Boolean, default=True)
  verification_status= Column(Enum(VerificationStatus), default=VerificationStatus.PENDING)
  created_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))
  updated_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
  
  # relationships
  cart = relationship("Cart", back_populates="user")
  order = relationship("Order", back_populates="user")
  favorite = relationship("Favorite", back_populates="user")