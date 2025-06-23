from fastapi import APIRouter, Depends ,HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from services.auth_service import  createUser
from services.user_service import  update_user_location
from models.user_model import User
from schemas.user_schemas import BaseUser, CreateUserResponse
from schemas.vendor_schemas import RequestBodyCoordinates
from dependencies.dependencies import get_db
from utils.verify_user_token import get_current_user
from utils.find_user import get_existing_user, get_existing_user_by_email

router = APIRouter()
# CREATE USER 
@router.post("/create_user", response_model = CreateUserResponse)
async def create_user(user_data : BaseUser, session: AsyncSession = Depends(get_db)):

  # check if user exists in the database 
  existing_user = await get_existing_user(clerk_id=user_data.clerk_id, db=session)
  if existing_user: 
    raise HTTPException(status_code=400, detail="User already exists")

  existing_user_by_email = await get_existing_user_by_email(email=user_data.email, db=session)
  if existing_user_by_email: 
    raise HTTPException(status_code=400, detail="User by this email already exists")

  # if not create new user 
  user = await createUser(db=session, data= user_data)
  return{
    "message" : "user created successfully",
    "data" : user 
  }


@router.post("/update_user_location")
async def update_location(coordinates : RequestBodyCoordinates , db : AsyncSession = Depends(get_db), user = Depends(get_current_user)):
  clerk_id = user["sub"]
  await update_user_location(session=db, data=coordinates, clerk_id=clerk_id)
  return {
    "message": "location updated successfully"
  }