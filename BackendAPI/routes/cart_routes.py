from dotenv import load_dotenv

load_dotenv()

from fastapi import APIRouter, Depends, Request, HTTPException
from dependencies.dependencies import get_db
from utils.verify_user_token import get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from services.user_service import get_user
from services.cart_services import add_to_cart_service, fetch_cart, fetch_detailed_cart, change_cart_item_quantity_service, delete_cart_item_service, delete_cart_service
from schemas.common_schemas import RequestBodyIdAndQuantity, RequestBodyIdAndType, RequestBodyId, RequestBodyIdUserIdAndQuantity
from models.cart_model import Cart
from schemas.cart_schemas import CartDetailed
from services.payment_service import initiate_stk_push, check_payment
from services.order_service import create_order,fetch_orders_by_id
from uuid import UUID

# payment imports
from fastapi.responses import JSONResponse
import logging
from pydantic import BaseModel

# order imports
from schemas.order_schema import BaseOrder


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
async def add_to_cart(request_body: RequestBodyIdUserIdAndQuantity, db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
  clerkId = user["sub"]
  user_id = request_body.user_id
  if request_body.user_id == "":
    user = await get_user(session=db, clerk_id=clerkId)
    user_id = user.id
  await add_to_cart_service(user_id=user_id, session=db, product_id=request_body.id, quantity=request_body.quantity)
  return {
    "message": "Item added to cart"
  }

class Id(BaseModel):
  id: str | UUID
@router.get("/get_cart")
# async def get_cart( request: Id, db: AsyncSession = Depends(get_db)):
async def get_cart( db: AsyncSession = Depends(get_db), user = Depends(get_current_user)):
  clerkId = user["sub"]
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
class OrderRequest(BaseModel):
    phone: str  # Format: 2547XXXXXXXX
    amount: float
    # type: str
    id: UUID
    user_id: UUID
    lat: float
    lng: float

@router.post("/mpesa_payment")
async def payment_request(request: OrderRequest,  db: AsyncSession = Depends(get_db)): #add the authentication dependency
    response = await initiate_stk_push(phone=request.phone, amount=request.amount)
    CheckoutRequestID = response.get("CheckoutRequestID")
    print(CheckoutRequestID)
    orders = await create_order(session=db, id=request.id, type="cart", CheckoutRequestID=CheckoutRequestID, user_id=request.user_id, phone=request.phone, lat=request.lat, lng=request.lng ) 
    if not orders:
      raise HTTPException(status_code=400 , detail={"Orders Not created. Something went wrong!!!"})
    await delete_cart_service(cart_id=request.id, db=db)
    return {
      "message" : "order created ",
      "CheckoutRequestID": CheckoutRequestID
    }

class RequestCheckoutRequestID(BaseModel):
  CheckoutRequestID: str  
@router.post("/confirm_payment")
async def payment_confirmation(request: RequestCheckoutRequestID, db: AsyncSession = Depends(get_db)): #add the authentication dependency
  CheckoutRequestID = request.CheckoutRequestID
  response = await check_payment(checkout_request_id=CheckoutRequestID, session=db)
  return response

@router.get("/get_orders",response_model=list[BaseOrder])
async def get_orders_by_id(db: AsyncSession= Depends(get_db), user = Depends(get_current_user) ):
  clerkId = user["sub"]
  user = await get_user(session=db, clerk_id=clerkId)
  orders = await fetch_orders_by_id(session=db, user_id=user.id)
  return orders

@router.post("/mpesa/callback")
async def mpesa_callback(request: Request):
    stk_callback_response = request.json()
    print(stk_callback_response)
    # log_file = "Mpesastkresponse.json"
    # with open(log_file, "a") as log:
    #     json.dump(stk_callback_response, log)
    
    # print(stk_callback_response)
    
    # merchant_request_id = stk_callback_response['Body']['stkCallback']['MerchantRequestID']
    # checkout_request_id = stk_callback_response['Body']['stkCallback']['CheckoutRequestID']
    # result_code = stk_callback_response['stkCallback']['ResultCode']
    # result_desc = stk_callback_response['Body']['stkCallback']['ResultDesc']
    # amount = stk_callback_response['Body']['stkCallback']['CallbackMetadata']['Item'][0]['Value']
    # transaction_id = stk_callback_response['Body']['stkCallback']['CallbackMetadata']['Item'][1]['Value']
    # user_phone_number = stk_callback_response['Body']['stkCallback']['CallbackMetadata']['Item'][4]['Value']
    
    # if result_code == 0:
    #   print(stk_callback_response)
    # data = await request.json()
    # # print(data)
    # try:
    #     callback = data["Body"]["stkCallback"]
    #     result_code = callback["ResultCode"]
    #     result_desc = callback["ResultDesc"]
    #     checkout_request_id = callback["CheckoutRequestID"]

    #     if result_code == 0:
    #         metadata = callback["CallbackMetadata"]["Item"]
    #         transaction = {
    #             "amount": next(item["Value"] for item in metadata if item["Name"] == "Amount"),
    #             "receipt": next(item["Value"] for item in metadata if item["Name"] == "MpesaReceiptNumber"),
    #             "phone": next(item["Value"] for item in metadata if item["Name"] == "PhoneNumber"),
    #             "timestamp": next(item["Value"] for item in metadata if item["Name"] == "TransactionDate"),
    #         }

    #         # 🧠 Save to DB or update order status
    #         print("✅ M-PESA Payment Successful:", transaction)
    #     else:
    #         print(f"❌ M-PESA Payment Failed: {result_desc} (Code: {result_code})")

    # except Exception as e:
    #     logging.error(f"Error processing M-PESA callback: {e}")
    #     return JSONResponse(status_code=400, content={"message" : "Invalid payload"})

    return {"message": "Callback received"}
