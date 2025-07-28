from fastapi import APIRouter, Query, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from dependencies.dependencies import get_db
from services.query_service import search_service

router = APIRouter()

@router.get("/search")
async def search(
  query: str = Query(..., min_length=2),
  db: AsyncSession = Depends(get_db)
):
  products = await search_service(session=db, query=query)
  # return query
  return products 