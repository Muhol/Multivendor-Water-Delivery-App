from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import func, desc
from sqlalchemy.future import select
from models.product_model import Product
from schemas.product_schemas import BaseProduct

async def search_service(session: AsyncSession, query: str) -> list[BaseProduct]:
  ts_query = func.plainto_tsquery("english", query)
  
  search_products_query = select(Product).where(Product.search_vector.op('@@')(ts_query)).order_by(desc(func.ts_rank(Product.search_vector, ts_query)))
  result = await session.execute(search_products_query)
  products = result.scalars().all()
  return products
