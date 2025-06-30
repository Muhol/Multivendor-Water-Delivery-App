from fastapi import APIRouter, Depends
from schemas.product_schemas import ProductFull, RequestBodyProductId, BaseProduct
from sqlalchemy.ext.asyncio import AsyncSession
from dependencies.dependencies import get_db
from services.product_service import get_product_details, fetch_products_with_offer
from utils.verify_user_token import get_current_user


router = APIRouter()

@router.post("/get_product", response_model=ProductFull)
async def get_product(request_body: RequestBodyProductId, db : AsyncSession =  Depends(get_db)):
  product = await get_product_details(session=db, id=request_body.id)
  return product

@router.get("/products_with_discount", response_model=list[BaseProduct])
async def get_products_with_offer(db: AsyncSession = Depends(get_db)):
  products = await fetch_products_with_offer(session=db)
  return products