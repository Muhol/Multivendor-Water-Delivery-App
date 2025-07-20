from db.session import Base
from datetime import datetime, timezone
import uuid
from sqlalchemy import Column, String, Text, Boolean,Enum, TIMESTAMP, Float, Double, DateTime,Integer, ARRAY , ForeignKey, Numeric
from sqlalchemy.dialects.postgresql import UUID
from enum import Enum as PyEnum
from sqlalchemy.orm import relationship



class Order(Base):
  __tablename__ = "Orders"
  id = Column(UUID(as_uuid=True), unique=True, primary_key=True, default=uuid.uuid4, index=True)
  customer_id = Column(UUID(as_uuid=True),ForeignKey("Users.id"), index=True)
  vendor_id = Column(UUID(as_uuid=True), ForeignKey("Vendors.id"), index=True) 
  deliverer_id = Column(UUID(as_uuid=True), ForeignKey("Deliverers.id"), index=True) 
  delivery_address= Column(Text, nullable=True)
  checkout_request_ID= Column(String, nullable=True, index=True)
  phone= Column(String, nullable=True, index=True)
  lat_from= Column(Float, nullable=True)
  lng_from= Column(Float, nullable=True)
  lat= Column(Float, nullable=True)
  lng= Column(Float, nullable=True)
  total_amount = Column(Numeric(10, 2), nullable=False, default=0)
  order_status = Column(String, nullable=False, default="pending")
  payment_status = Column(String, nullable=False, default="pending")
  payment_method = Column(String, nullable=True)
  delivery_fee = Column(Double, nullable=True, index=True)
  delivery_time = Column(Integer, nullable=True)
  customer_note = Column(Text, nullable=True)
  created_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))
  updated_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))
  
  # relationships
  order_item = relationship("OrderItem", back_populates="order")
  user = relationship("User", back_populates="order")
  vendor = relationship("Vendor", back_populates="order")
  deliverer = relationship("Deliverer", back_populates="order")

class OrderItem(Base):
  __tablename__ = "Order_Items"
  id = Column(UUID(as_uuid=True), unique=True, primary_key=True, default=uuid.uuid4, index=True)
  order_id = Column(UUID(as_uuid=True),ForeignKey("Orders.id"), index=True)
  # vendor_id = Column(UUID(as_uuid=True), ForeignKey("Vendors.id"), index=True)
  product_id = Column(UUID(as_uuid=True), ForeignKey("Products.id"), index=True)
  quantity = Column(Integer, nullable=False, default=1)
  price = Column(Double, nullable=False)
  Subtotal = Column(Double, nullable=False)
  
  # relationships
  order = relationship("Order", back_populates="order_item")
  product = relationship("Product", back_populates="order_item")