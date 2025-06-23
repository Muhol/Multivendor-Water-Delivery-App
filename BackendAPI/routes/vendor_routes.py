from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from db.session import AsyncSessionLocal
from services.vendor_service import get_all_vendors, get_nearby_vendors, get_top_rated_vendors, get_vendor_by_id_service, get_vendors_by_type_service, get_top_brands_service
from services.user_service import get_user_coordinates
from models.vendor_model import Vendor
from schemas.vendor_schemas import VendorOut, VendorWithProductsThin, RequestBodyCoordinates, BaseVendor, VendorWithProductsFull, RequestBodyVendorId, VendorType
from dependencies.dependencies import get_db
from utils.verify_user_token import get_current_user

router = APIRouter()
# GET ALL VENDORS 
@router.get("/vendors", response_model=list[VendorOut])
async def fetch_all_vendors(session: AsyncSession = Depends(get_db)):
  return await get_all_vendors(session)

# GET NEARBY VENDORS FOR QUICK REFILLS
@router.get("/nearby_vendors", response_model=list[VendorWithProductsThin] )
async def fetch_nearby_vendors(db: AsyncSession = Depends(get_db),user = Depends(get_current_user)):
  clerk_id = user["sub"]
  coords = await get_user_coordinates(session=db, clerk_id=clerk_id)
  vendors = await get_nearby_vendors(session=db, lat=coords.lat, lng=coords.lng)
  if not vendors:
    raise HTTPException(status_code=404, detail="An Error Occurred") 
  return vendors

# GET THE TOP RATED VENDOR NEAR YOU
@router.get("/top_rated_vendors", response_model=list[BaseVendor])
async def top_rated_vendors( db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
  clerk_id = user["sub"]
  coords = await get_user_coordinates(session=db, clerk_id=clerk_id)
  vendors = await get_top_rated_vendors(session=db, lat=coords.lat, lng=coords.lng)
  if not vendors:
    raise HTTPException(status_code=404, detail="An Error Occurred") 
  return vendors

# GET VENDOR BY ID FOR THE VENDOR PROFILE 
@router.post("/vendor_details_and_products", response_model= VendorWithProductsFull)
async def get_vendor_by_id(request_body: RequestBodyVendorId, db : AsyncSession = Depends(get_db) ):
  vendor = await get_vendor_by_id_service(session=db, id=request_body.id)
  if not vendor:
    raise HTTPException(status_code=404, detail="Vendor details Do not exist")
  return vendor

# GET VENDOR BY TYPE 
@router.post("/vendor_by_type", response_model=list[BaseVendor])
async def get_vendors_by_type(request_body: VendorType, db : AsyncSession = Depends(get_db), user = Depends(get_current_user) ):
  # get coordinates from the database  
  print(request_body)
  # return
  clerk_id = user["sub"]
  coords = await get_user_coordinates(session=db, clerk_id=clerk_id)
  vendors = await get_vendors_by_type_service(session=db, type=request_body.vendor_type, lng=coords.lng, lat=coords.lat)
  if not vendors:
    raise HTTPException(status_code=404, detail="Vendors of the type you provided do not exist")
  return vendors

#  GET VENDORS OF TOP BRANDS AND THAT ARE NEAR YOUR OF TYPE WHOLE_SELLER 
@router.get("/get_top_brands", response_model=list[BaseVendor])
async def get_top_brands(db : AsyncSession = Depends(get_db), user = Depends(get_current_user)):
  clerk_id = user["sub"]
  coords = await get_user_coordinates(session=db, clerk_id=clerk_id)
  if not coords:
    raise HTTPException(status_code=404, detail="Unable to resolve User coordinates")
  
  vendors = await get_top_brands_service(session=db, lat=coords.lat, lng=coords.lng)
  return vendors