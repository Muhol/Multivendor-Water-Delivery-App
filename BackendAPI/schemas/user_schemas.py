from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import time
from typing import List

class BaseUser(BaseModel):
    clerk_id: str
    full_name : str | None
    email : str 
    phone_number : str | None 
    profile_pic : str | None  
    
    class Config:
        from_attributes = True  # ✅ required in Pydantic v2

class BasicUser(BaseUser):
    lat: float
    lng: float
    id: UUID
    
    class Config:
        from_attributes = True  # ✅ also required here

class CreateUserResponse(BaseModel):
    message: str
    data: BaseUser
    
    class Config:
        from_attributes = True

