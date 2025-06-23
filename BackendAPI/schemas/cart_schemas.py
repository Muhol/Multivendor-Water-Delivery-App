from pydantic import BaseModel
from uuid import UUID
from decimal import Decimal
from schemas.product_schemas import ProductFull
from typing import List, Optional


class CartBase(BaseModel):
  id : UUID
  customer_id: UUID
  items_count: int
  total_amount: float 
  
  class Config:
    from_attribute = True

class CartItemBase(BaseModel):
  id: UUID 
  cart_id: UUID 
  vendor_id: UUID 
  product_id: UUID 
  quantity: int 
  price: float 
  product: Optional[ProductFull] 
  
  class Config:
    from_attribute = True

class CartDetailed(CartBase):
  cart_item: List[CartItemBase]
  
  class Config:
    from_attribute = True