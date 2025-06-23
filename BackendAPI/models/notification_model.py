from db.session import Base
from datetime import datetime,timezone
import uuid
from sqlalchemy import Column, String, Text, Boolean,Enum, TIMESTAMP, Float, Double, DateTime,Integer, ARRAY , ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from enum import Enum as PyEnum
from sqlalchemy.orm import relationship


class Notification(Base):
  __tablename__ = "Notifications"
  id = Column(UUID(as_uuid=True), unique=True, primary_key=True, default=uuid.uuid4, index=True)
  user_id = Column(UUID(as_uuid=True), index=True)
  user_type = Column(String, nullable=False, index=True)
  title = Column(String, nullable=False, index=True)
  message = Column(Text, nullable=False)
  message_type = Column(String, nullable=False, index=True)
  related_order_id = Column(UUID(as_uuid=True), nullable=True, index=True)
  is_read = Column(Boolean, default=False, index=True)
  delivered_via = Column(String, default="app", index=True)
  created_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc))
  updated_at= Column(TIMESTAMP(timezone=True), default=datetime.now(timezone.utc), onupdate=datetime.now(timezone.utc))