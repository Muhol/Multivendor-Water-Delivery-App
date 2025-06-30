from pydantic import BaseModel
from uuid import UUID


class BaseProduct(BaseModel):
  id: UUID
  vendor_id: UUID
  name: str
  image_url: str
  capacity: float
  price: float 
  discount: float 
  stock: int
  
  class Config:
      from_attribute = True

class ProductThin(BaseModel):
  id: UUID
  vendor_id: UUID
  image_url: str
  
  class Config:
      from_attribute = True

class ProductFull(BaseProduct):
  description: str | None
  unit: str | None 
  is_available: bool
  
  class Config:
      from_attribute = True

class RequestBodyProductId(BaseModel):
  id: UUID
  
  class Config:
    
      from_attribute = True