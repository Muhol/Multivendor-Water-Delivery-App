from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func
from uuid import UUID
from sqlalchemy.future import select
from models.product_model import Product
from schemas.product_schemas import ProductFull,BaseProduct

async def get_product_details(session : AsyncSession, id : UUID) -> ProductFull:
  query = select(Product).where(Product.id == id)
  result = await session.execute(query)
  product = result.unique().scalar_one_or_none()
  if not product:
    raise HTTPException(status_code=404, detail="Product by this id does not exist")
  return product


async def get_product_for_cart(session : AsyncSession, id : UUID) -> BaseProduct:
  query = select(Product).where(Product.id == id)
  result = await session.execute(query)
  product = result.unique().scalar_one_or_none()
  if not product:
    raise HTTPException(status_code=404, detail="Product by this id does not exist")
  return product

async def fetch_products_with_offer(session: AsyncSession) -> list[BaseProduct]:
  query = select(Product).where(Product.discount > 0).order_by(func.random()).limit(4)
  result = await session.execute(query)
  products = result.unique().scalars().all()
  if not products :
    return
  return products 

async def fetch_paginated_products(session: AsyncSession, page: int) ->  list[BaseProduct]:
  offset = (page - 1 ) * 16
  query = select(Product).order_by(func.random()).offset(offset).limit(16)
  result = await session.execute(query)
  products = result.scalars().all()
  return products