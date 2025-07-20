from sqlalchemy.ext.asyncio import AsyncSession
from collections import defaultdict
from uuid import UUID
from sqlalchemy import select, and_, func
from sqlalchemy.orm import joinedload
from geoalchemy2.functions import ST_Distance
from models.cart_model import Cart, CartItem
from models.deliverer_model import Deliverer
from models.order_model import Order, OrderItem
from schemas.order_schema import BaseOrder



async def get_closest_deliverer(session: AsyncSession, lat: float, lng: float):
  location_wkt = f"SRID=4326;POINT({lng} {lat})"
  point = func.ST_GeogFromText(location_wkt)
  query = select(Deliverer).where(and_(Deliverer.is_available == True, Deliverer.vehicle_type == "bike")).order_by(ST_Distance(Deliverer.location, point)).limit(1)
  result = await session.execute(query)
  deliverer = result.scalar_one_or_none()
  return deliverer

async def create_order(session: AsyncSession, CheckoutRequestID: str, id: UUID, user_id: UUID, phone: str, type: str, lat: float, lng: float):
  if type == "cart":
    query = select(CartItem).where(CartItem.cart_id == id).options(joinedload(CartItem.vendor))
    result = await session.execute(query)
    items = result.unique().scalars().all()
    grouped_items = defaultdict(list)
    for item in items:
      grouped_items[item.vendor_id].append(item)
    
    for vendor_id, pre_order_items in grouped_items.items():
      first_item = pre_order_items[0]
      lat_from = first_item.vendor.lat
      lng_from = first_item.vendor.lng
      deliverer = await get_closest_deliverer(session=session, lat=lat_from, lng=lng_from)
      deliverer_id = deliverer.id
      amount = sum(item.Subtotal for item in pre_order_items)
      order = Order(
        customer_id = user_id,
        vendor_id = vendor_id,
        checkout_request_ID = CheckoutRequestID,
        deliverer_id = deliverer_id,
        lat_from = lat_from,
        lng_from = lng_from,
        lat = lat,
        lng = lng,
        phone = phone,
        total_amount = amount
      )
      session.add(order)
      await session.flush()
      
      for item in pre_order_items:
        order_item = OrderItem(
          order_id = order.id,
          product_id = item.product_id,
          quantity = item.quantity,
          price = item.price,
          Subtotal = item.Subtotal
        )
        session.add(order_item)
        await session.commit()
    return grouped_items

async def update_orders_payment_status_by_checkout_id(
    session: AsyncSession,
    checkout_request_id: str,
    new_status: str
):
    # Fetch all orders with the matching checkout_request_ID
    stmt = select(Order).where(Order.checkout_request_ID == checkout_request_id)
    result = await session.execute(stmt)
    orders = result.scalars().all()

    if not orders:
        return {"message": "No orders found with that checkout_request_ID"}

    # Update each order's payment_status
    for order in orders:
        order.payment_status = new_status
        # order.updated_at = datetime.now(timezone.utc)  # optional update

    await session.commit()
    return {
        "message": "Transaction was completed successfully.",
        "code": "0"
      }

async def fetch_orders_by_id(session: AsyncSession, user_id: UUID) -> list[BaseOrder]:
  query = select(Order).where(Order.customer_id == user_id).options(joinedload(Order.order_item).joinedload(OrderItem.product)).order_by(Order.created_at.desc())
  result = await session.execute(query)
  orders = result.unique().scalars().all()
  return orders