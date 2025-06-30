from fastapi import HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.vendor_model import Vendor
from schemas.vendor_schemas import BaseVendor, VendorWithProductsThin, VendorWithProductsFull
from geoalchemy2.functions import ST_Distance
from sqlalchemy import func , and_, or_
from sqlalchemy.orm import Session, joinedload
from uuid import UUID


async def get_all_vendors(session: AsyncSession):
  result = await session.execute(select(Vendor))
  vendors = result.scalars().all()
  return vendors

async def get_nearby_vendors(session : AsyncSession, lat : float, lng : float ) -> list[VendorWithProductsThin]:
  user_location_wkt = f"SRID=4326;POINT({lng} {lat})"
  user_point = func.ST_GeogFromText(user_location_wkt)
  query = select(Vendor).where(or_(Vendor.vendor_type == "refill", Vendor.vendor_type == "general")).options(joinedload(Vendor.products)).order_by(ST_Distance(Vendor.location, user_point)).limit(3)
  result = await session.execute(query)
  vendors = result.unique().scalars().all()
  return vendors

async def get_top_rated_vendors(session: AsyncSession, lat : float, lng: float) -> list[BaseVendor]:
  user_location_wkt = f"SRID=4326;POINT({lng} {lat})"
  user_point = func.ST_GeogFromText(user_location_wkt)
  query = select(Vendor).where(and_(or_(Vendor.vendor_type == "refill", Vendor.vendor_type == "general"), Vendor.rating >= 4)).order_by(ST_Distance(Vendor.location, user_point)).limit(10)
  result = await session.execute(query)
  vendors = result.unique().scalars().all()
  return vendors

async def get_vendors_by_type_service(session : AsyncSession, type: str, lng: float, lat: float) -> list[BaseVendor]:
  # check if type is provided [IF NOT PROVIDED RAISE AN ERROR]
  # check if coords are provided [IF NOT PROVIDED FETCH ANYWAY USING A DIFFERENT QUERY]
  if not type:
    raise HTTPException(status_code=400, detail="\'vendor_type\' parameter is required")
  if type != "refill":
    query_without_location=select(Vendor).where(Vendor.vendor_type == type).order_by(func.random()).limit(10)
    result = await session.execute(query_without_location)
    vendors = result.unique().scalars().all()
    return vendors
  user_location_wkt = f"SRID=4326;POINT({lng} {lat})"
  user_point = func.ST_GeogFromText(user_location_wkt)
  query_with_location = select(Vendor).where(Vendor.vendor_type == type).order_by(ST_Distance(Vendor.location ,user_point)).limit(10)
  result = await session.execute(query_with_location)
  vendors = result.unique().scalars().all()
  return vendors

async def get_vendor_by_id_service(session: AsyncSession, id: UUID) -> VendorWithProductsFull:
  query = select(Vendor).where(Vendor.id == id).options(joinedload(Vendor.products))
  result = await session.execute(query)
  vendor = result.unique().scalar_one_or_none()
  return vendor

async def get_top_brands_service(session : AsyncSession, lat : float, lng : float) -> list[BaseVendor]:
  if not lat and not lng:
    raise HTTPException(status_code=400 , detail="Coordinates are required for this service")
  
  user_location_wkt = f"SRID=4326;POINT({lng} {lat})"
  user_point = func.ST_GeogFromText(user_location_wkt)
  # query = select(Vendor).where(and_(Vendor.vendor_type == "whole_seller", Vendor.rating >= 4)).order_by(ST_Distance(Vendor.location, user_point)).limit(10)
  query = select(Vendor).where(and_(Vendor.vendor_type == "whole_seller", Vendor.rating >= 4)).order_by(func.random()).limit(10)
  result = await session.execute(query)
  vendors = result.unique().scalars().all()
  return vendors