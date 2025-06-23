from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select 
from models.user_model import User


async def get_existing_user(clerk_id: str, db: AsyncSession) -> bool:
  result = await db.execute(select(User).where(User.clerk_id == clerk_id))
  user = result.scalar_one_or_none()
  if user:
    return True
  return False 


async def get_existing_user_by_email(email: str, db: AsyncSession) -> bool:
  result = await db.execute(select(User).where(User.email == email))
  user = result.scalar_one_or_none()
  if user:
    return True
  return False 
  