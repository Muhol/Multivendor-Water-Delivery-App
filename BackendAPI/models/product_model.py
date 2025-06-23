from db.session import Base
from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Text, Boolean,Enum, TIMESTAMP, Float, Double, DateTime,Integer, ARRAY , ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from enum import Enum as PyEnum
from sqlalchemy.orm import relationship


class Product(Base):
  __tablename__ = "Products"
  id = Column(UUID(as_uuid=True), unique=True, primary_key=True, default=uuid.uuid4, index=True)
  vendor_id = Column(UUID(as_uuid=True), ForeignKey("Vendors.id"), index=True)
  name = Column(String, nullable=False, index=True)
  description = Column(Text, nullable=True)  #OPTIONAL
  image_url= Column(Text, nullable=False)
  price = Column(Double, nullable=False, index=True)
  discount = Column(Double, nullable=False, index=True , default=0)
  capacity = Column(Double, nullable=False, index=True)
  unit = Column(String, nullable=False, index=True)
  stock = Column(Integer, nullable=False, index=True)
  is_available = Column(Boolean, default=True, index=True)
  created_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))
  updated_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
  
  # relationships
  vendor = relationship("Vendor", back_populates="products")
  cart_item = relationship("CartItem", back_populates="product")
  order_item = relationship("OrderItem", back_populates="product")
  favorite = relationship("Favorite", back_populates="product")
  