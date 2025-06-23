from pydantic  import BaseModel, EmailStr
from uuid import UUID
from datetime import time
from typing import List
from schemas.product_schemas import ProductThin, BaseProduct

class BaseVendor(BaseModel):
  id: UUID
  business_name : str
  profile_pic : str
  vendor_type : str
  lat: float | None
  lng: float | None
  rating : float
  
  class Config:
      from_attribute = True


class VendorOut(BaseModel):
  id : UUID
  owners_name: str
  business_name: str
  email: EmailStr
  phone_number: str | None
  profile_pic: str | None
  location_address: str | None
  lat: float | None
  lng: float | None
  delivery_radius: float | None
  shift_start: time
  shift_end: time
  verification_status: str
  rating: float | None
  preferred_payment_method: List[str]
  
  class Config:
      from_attribute = True

class VendorWithProductsThin(BaseVendor):
  products : List[ProductThin]
  
  class Config:
      from_attribute = True

class VendorWithProductsFull(VendorOut):
  shift_start: time
  shift_end: time
  profile_pic: str | None
  products : List[BaseProduct]
  
  class Config:
      from_attribute = True

class RequestBodyCoordinates(BaseModel):
  lat: float
  lng: float
  
  class Config:
      from_attribute = True


class RequestBodyVendorId(BaseModel):
  id: UUID
  
  class Config:
    
      from_attribute = True


class VendorType(BaseModel):
  vendor_type: str 
  # lat: float | None
  # lng: float | None
  
  class Config:
      from_attribute = True