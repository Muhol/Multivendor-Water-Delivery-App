from db.session import Base
from datetime import datetime, time, timezone
import uuid
from sqlalchemy import Column, String, Text, Boolean,TIMESTAMP, Float, Time
from sqlalchemy.dialects.postgresql import UUID
from enum import Enum as PyEnum
from sqlalchemy.orm import relationship
from geoalchemy2 import Geography


class Deliverer(Base):
  __tablename__ = "Deliverers"
  id = Column(UUID(as_uuid=True), unique=True, primary_key=True, default=uuid.uuid4, index=True)
  name = Column(String, index=True, nullable=False)
  email = Column(String, unique=True, index=True, nullable=False) 
  phone_number = Column(String, index=True, nullable=True)  #will revisit 
  profile_pic = Column(Text, nullable=True)
  driver_license = Column(Text, nullable=True)
  ID_number = Column(String, nullable=False, index=True)
  vehicle_type = Column(String, nullable=False, default="bike", index=True)
  plate_number = Column(String, nullable=True, index=True)
  current_lat = Column(Float, nullable=True , index=True)
  current_lng = Column(Float, nullable=True , index=True)
  location = Column(Geography(geometry_type="POINT", srid=4326))
  is_available = Column(Boolean, default=True, index=True)
  is_active = Column(Boolean, default=False, index=True)
  is_verified = Column(Boolean, default=False, index=True)
  shift_start = Column(Time, default=time(7,0), nullable=False, index=True)
  shift_end = Column(Time, default=time(19,0), nullable=False, index=True)
  created_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))
  updated_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
  
  # relationships
  order = relationship("Order", back_populates="deliverer")