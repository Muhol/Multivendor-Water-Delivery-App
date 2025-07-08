from pydantic import BaseModel
from uuid import UUID

class RequestBodyIdAndQuantity(BaseModel): 
  id : UUID
  quantity : int
  # clerk_id : str

class RequestBodyIdAndType(BaseModel): 
  id : UUID
  type : str
  # clerk_id : str

class RequestBodyId(BaseModel): 
  id : UUID
  # clerk_id : str

class RequestBodyProfilePic(BaseModel): 
  profile_pic : str
  # clerk_id : str