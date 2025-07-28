from db.session import Base
from datetime import time, datetime, timezone
import uuid
from geoalchemy2 import Geography
from sqlalchemy import Column, String, Text, Boolean, Numeric, TIMESTAMP, Float, Time,Integer, ARRAY
from sqlalchemy.dialects.postgresql import UUID, TSVECTOR
from enum import Enum as PyEnum
from sqlalchemy.orm import relationship




class Vendor(Base):
  __tablename__ = "Vendors"
  id = Column(UUID(as_uuid=True), unique=True, primary_key=True, default=uuid.uuid4, index=True)
  vendor_type = Column(String, nullable=True, default="", index=True)
  owners_name = Column(String, nullable=False, index=True)
  business_name = Column(String, index=True, nullable=False)
  email = Column(String, unique=True, index=True, nullable=False) 
  phone_number = Column(String, index=True, nullable=True)  #will revisit 
  profile_pic = Column(Text, nullable=True)
  business_license = Column(Text, nullable=True)
  location_address = Column(Text, nullable=True, index=True)
  lat = Column(Float, nullable=True , index=True)
  lng = Column(Float, nullable=True , index=True)
  location = Column(Geography(geometry_type="POINT", srid=4326))
  delivery_radius = Column(Float, nullable=True, index=True)
  shift_start = Column(Time, default=time(7,0), nullable=False, index=True)
  shift_end = Column(Time, default=time(19,0), nullable=False, index=True)
  verification_status = Column(String, default="pending")
  rating = Column(Float, nullable=True, index=True, default=0)
  total_sales = Column(Integer, nullable=True, index=True)
  sales_amount = Column(Numeric(10, 2), nullable=True, index=True)
  search_vector = Column(TSVECTOR)  # Optional if created directly in DB
  preferred_payment_method = Column(ARRAY(String), nullable=True, index=True)
  created_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))
  updated_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
  
  # relationship
  # cart = relationship("Cart", back_populates="vendor")
  cart_item = relationship("CartItem", back_populates="vendor")
  products = relationship("Product", back_populates="vendor")
  order = relationship("Order", back_populates="vendor")