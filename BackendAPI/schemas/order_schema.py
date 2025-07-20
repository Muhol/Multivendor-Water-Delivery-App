from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from schemas.product_schemas import ProductFull
from typing import List, Optional
from datetime import datetime


class OrderItemBase(BaseModel):
  id: UUID
  order_id: UUID
  product_id: UUID
  quantity: int
  price: float
  Subtotal: float
  product: Optional[ProductFull]
  
  class Config:
    from_attribute = True

class BaseOrder(BaseModel):
  id: UUID
  customer_id: UUID
  vendor_id: UUID
  deliverer_id: UUID
  delivery_address: str | None
  checkout_request_ID: str | None
  phone: str | None
  lat_from: float | None
  lng_from: float | None
  lat: float | None
  lng: float | None
  total_amount: float | None
  order_status: str | None
  payment_status: str | None
  payment_method: str | None
  delivery_fee: float | None
  delivery_time: int | None
  order_item: List[OrderItemBase]
  created_at: datetime
  class Config:
    from_attribute = True

