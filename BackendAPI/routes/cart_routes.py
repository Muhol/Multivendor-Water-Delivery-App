from fastapi import APIRouter, Depends
from dependencies.dependencies import get_db
from utils.verify_user_token import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from services.user_service import get_user
from services.cart_services import add_to_cart_service, fetch_cart, fetch_detailed_cart, change_cart_item_quantity_service, delete_cart_item_service
from schemas.common_schemas import RequestBodyIdAndQuantity, RequestBodyIdAndType, RequestBodyId
from models.cart_model import Cart
from schemas.cart_schemas import CartDetailed


router = APIRouter()

# CART ROUTES[
                  # NB / BEWARE OF THE TOTALS WHENEVER YOU ARE MANIPULATING THE CART 
  # >ADD TO CART 
      # POSSIBILITIES [ CART DOES NOT EXIST, CART EXISTS, ITEM DOES NOT EXIST IN THE CART, ITEM EXISTS IN THE CART]
        # CART DOES NOT EXIST [ >--> CREATE THE CART AND ADD THE ITEM IN THE CART ]
        # CART EXISTS [ >--> CHECK IF ITEM EXISTS IN THE CART OR NOT ]
        # ITEM DOESN'T EXIST IN CART [ >--> ADD THE ITEM TO THE EXISTING CART AND UPDATE THE TOTAL ACCORDINGLY ]
        # ITEM EXISTS [ >--> JUST INCREASE ITS QUANTITY AND UPDATE THE TOTAL ACCORDINGLY ]
        
  # >FETCH CART AND CART ITEMS FO A SPECIFIC USER 
      # POSSIBILITIES [ CART EXISTS , CART DOES NOT EXIST ]
        # CART DOESN'T EXIST [ JUST RETURN NOTHING ]
        # CART EXISTS [ RETURN THE CART  ]
  # >ADD ITEMS TO CART [ NEW ITEM AND INCREASING QUANTITY ]
  # >CHANGE QUANTITY OF ANT ITEM IN THE CART [ INCREASE & DECREASE ]
  # >DELETE CART 
# ]

# ADD TO CART FUNCTIONALITY 
@router.post("/add_to_cart")
async def add_to_cart(request_body: RequestBodyIdAndQuantity, db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
  clerkId = user["sub"]
  user = await get_user(session=db, clerk_id=clerkId)
  await add_to_cart_service(user_id=user.id, session=db, product_id=request_body.id, quantity=request_body.quantity)
  cart = await fetch_cart(user_id=user.id, session=db)
  return cart

@router.get("/get_cart")
async def get_cart(db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
  clerkId = user["sub"]
  # clerkId = request_body.clerk_id
  user = await get_user(session=db, clerk_id=clerkId)
  cart = await fetch_cart(user_id=user.id, session=db)
  return cart

@router.get("/get_detailed_cart", response_model=CartDetailed)
async def get_detailed_cart(db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
  clerkId = user["sub"]
  user = await get_user(session=db, clerk_id=clerkId)
  cart = await fetch_detailed_cart(user_id=user.id, session=db)
  return cart

@router.post("/change_cart_item_quantity")
async def change_cart_item_quantity(request_body: RequestBodyIdAndType, db: AsyncSession= Depends(get_db), user = Depends(get_current_user)):
  clerkId = user["sub"]
  # get user id
  user = await get_user(session=db, clerk_id=clerkId)
  await change_cart_item_quantity_service(user_id=user.id, session=db, type=request_body.type, id=request_body.id)
  return {
    "message": "Cart Quantity Updated"
  }

@router.post("/delete_cart_item")
async def delete_cart_item(request_body: RequestBodyId, db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
  await delete_cart_item_service(cart_item_id=request_body.id, session=db)
  return {
    "message": "item deleted successfully"
  }