from fastapi import HTTPException
from uuid import UUID
from sqlalchemy import select, and_
from sqlalchemy.orm import joinedload, selectinload, with_loader_criteria
from models.cart_model import Cart, CartItem
from schemas.cart_schemas import CartDetailed
from sqlalchemy.ext.asyncio import AsyncSession
from services.product_service import get_product_for_cart
from decimal import Decimal
# >ADD TO CART 
      # POSSIBILITIES [ CART DOES NOT EXIST, CART EXISTS, ITEM DOES NOT EXIST IN THE CART, ITEM EXISTS IN THE CART]
        # CART DOES NOT EXIST [ >--> CREATE THE CART AND ADD THE ITEM IN THE CART ]
        # CART EXISTS [ >--> CHECK IF ITEM EXISTS IN THE CART OR NOT ]
        # ITEM DOESN'T EXIST IN CART [ >--> ADD THE ITEM TO THE EXISTING CART AND UPDATE THE TOTAL ACCORDINGLY ]
        # ITEM EXISTS [ >--> JUST INCREASE ITS QUANTITY AND UPDATE THE TOTAL ACCORDINGLY ]

async def fetch_cart(user_id: UUID, session: AsyncSession) -> Cart:
  query = select(Cart).where(Cart.customer_id == user_id)
  result = await session.execute(query)
  cart =  result.unique().scalar_one_or_none()
  return cart

async def fetch_detailed_cart(user_id: UUID, session: AsyncSession) -> CartDetailed:
  query = select(Cart).where(Cart.customer_id == user_id).options(joinedload(Cart.cart_item).joinedload(CartItem.product),  with_loader_criteria( CartItem, lambda cls: True, include_aliases=True, ))
  result = await session.execute(query)
  cart =  result.unique().scalar_one_or_none()
  if not cart:
    raise HTTPException(status_code=200, detail="There are no items in the cart yet")
  cart.cart_item.sort(key=lambda item: item.id)  # or item.product.name.lower()
  return cart

async def add_to_cart_service( user_id: UUID, session: AsyncSession, product_id : UUID, quantity : int):
  # prepare details for the cart item [customer id, vendor id, product id, quantity, product Price, subtotal]
  product = await get_product_for_cart(session=session,id=product_id)
  # check if the cart exists 
  query = select(Cart).where(Cart.customer_id == user_id).options(selectinload(Cart.cart_item))
  result = await session.execute(query)
  existing_cart =  result.unique().scalar_one_or_none()
  if not existing_cart:
    # create new cart 
    new_cart = Cart(
      customer_id = user_id
    )
    session.add(new_cart)
    await session.flush()
    # await session.commit()
    # add the cart item 
    cart_item = CartItem(
      cart_id = new_cart.id,
      vendor_id = product.vendor_id,
      product_id = product.id,
      quantity = quantity,
      price = Decimal(product.price),
      Subtotal = Decimal(product.price) * quantity
    )
    session.add(cart_item)
    new_cart.items_count = 1
    new_cart.total_amount = Decimal(product.price) * quantity
    await session.commit()
  else: 
    # check if item already exists in the cart 
    # existing_item_query = select(CartItem).where(and_(CartItem.cart_id == existing_cart.id, CartItem.product_id == product_id))
    # result = await session.execute(existing_item_query)
    # existing_item = result.unique().scalar_one_or_none()
    existing_item = next((item for item in existing_cart.cart_item if item.product_id == product_id), None)
    if existing_item:
    # if it exists update the [quantity of the item , the subtotal , and the total for the cart  ]
      existing_item.quantity += quantity
      existing_item.Subtotal += Decimal(existing_item.price) * quantity
      existing_cart.total_amount += (Decimal(existing_item.price) * quantity)
      await session.commit()
    else:
    # if not add the cart item then update the [total of the cart, and the items count ]
      new_cart_item = CartItem(
        cart_id = existing_cart.id,
        vendor_id = product.vendor_id,
        product_id = product.id,
        quantity = quantity,
        price = Decimal(product.price),
        Subtotal = Decimal(product.price) * quantity
      )
      session.add(new_cart_item)
      existing_cart.total_amount += (Decimal(product.price) * quantity)
      existing_cart.items_count += 1
      await session.commit()

async def change_cart_item_quantity_service(user_id: UUID, session: AsyncSession, quantity: int, id: UUID):
  query = select(Cart).where(Cart.customer_id == user_id).options(selectinload(Cart.cart_item))
  result = await session.execute(query)
  cart =  result.unique().scalar_one_or_none()
  if not cart: 
    raise HTTPException(status_code=404, detail="Cart Not Found")
  cart_item = next((item for item in cart.cart_item if item.id == id), None)
  if not cart_item:
    raise HTTPException(status_code=404, detail="Cart item not found")
  cart.total_amount -= cart_item.Subtotal
  cart_item.quantity = quantity
  cart_item.Subtotal = quantity * cart_item.price
  cart.total_amount += quantity * cart_item.price
  await session.commit()
  return

async def delete_cart_item_service(cart_item_id: UUID, session: AsyncSession):
    result = await session.execute(
        select(CartItem)
        .where(CartItem.id == cart_item_id)
        .options(selectinload(CartItem.cart))  # 👈 Load cart eagerly
    )
    cart_item = result.scalar_one_or_none()

    if not cart_item:
        raise HTTPException(status_code=404, detail="Cart item not found")

    # Update cart totals
    if cart_item.cart:
        cart_item.cart.items_count -= 1
        cart_item.cart.total_amount -= cart_item.Subtotal

    await session.delete(cart_item)
    await session.commit()