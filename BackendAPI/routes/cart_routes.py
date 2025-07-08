from dotenv import load_dotenv

load_dotenv()

from fastapi import APIRouter, Depends, Request
from dependencies.dependencies import get_db
from utils.verify_user_token import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from services.user_service import get_user
from services.cart_services import add_to_cart_service, fetch_cart, fetch_detailed_cart, change_cart_item_quantity_service, delete_cart_item_service
from schemas.common_schemas import RequestBodyIdAndQuantity, RequestBodyIdAndType, RequestBodyId
from models.cart_model import Cart
from schemas.cart_schemas import CartDetailed
from services.payment_service import initiate_stk_push

# payment imports
from fastapi.responses import JSONResponse
import logging
from pydantic import BaseModel


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
async def change_cart_item_quantity(request_body: RequestBodyIdAndQuantity, db: AsyncSession= Depends(get_db), user = Depends(get_current_user)):
  clerkId = user["sub"]
  # get user id
  user = await get_user(session=db, clerk_id=clerkId)
  await change_cart_item_quantity_service(user_id=user.id, session=db, quantity=request_body.quantity, id=request_body.id)
  return {
    "message": "Cart Quantity Updated"
  }

@router.post("/delete_cart_item")
async def delete_cart_item(request_body: RequestBodyId, db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
  await delete_cart_item_service(cart_item_id=request_body.id, session=db)
  return {
    "message": "item deleted successfully"
  }

# payment test
class STKRequest(BaseModel):
    phone: str  # Format: 2547XXXXXXXX
    amount: int
    
@router.post("/mpesa_payment")
async def payment_request(request: STKRequest):
    # response = await initiate_stk_push(request.phone, request.amount)
    response = await initiate_stk_push()
    return response

@router.post("/mpesa/callback")
async def mpesa_callback(request: Request):
    data = await request.json()
    try:
        callback = data["Body"]["stkCallback"]
        result_code = callback["ResultCode"]
        result_desc = callback["ResultDesc"]
        checkout_request_id = callback["CheckoutRequestID"]

        if result_code == 0:
            metadata = callback["CallbackMetadata"]["Item"]
            transaction = {
                "amount": next(item["Value"] for item in metadata if item["Name"] == "Amount"),
                "receipt": next(item["Value"] for item in metadata if item["Name"] == "MpesaReceiptNumber"),
                "phone": next(item["Value"] for item in metadata if item["Name"] == "PhoneNumber"),
                "timestamp": next(item["Value"] for item in metadata if item["Name"] == "TransactionDate"),
            }

            # 🧠 Save to DB or update order status
            print("✅ M-PESA Payment Successful:", transaction)
        else:
            print(f"❌ M-PESA Payment Failed: {result_desc} (Code: {result_code})")

    except Exception as e:
        logging.error(f"Error processing M-PESA callback: {e}")
        return JSONResponse(status_code=400, content={"message" : "Invalid payload"})

    return {"message": "Callback received"}
