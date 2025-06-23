from sqlalchemy.orm import sessionmaker, declarative_base
import os
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.pool import NullPool


from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

DATABASE_URL = os.getenv("NEONDB_URL")

engine = create_async_engine(DATABASE_URL, echo=True,pool_pre_ping=True,pool_recycle=1800, poolclass=NullPool)
AsyncSessionLocal = sessionmaker (bind=engine, class_=AsyncSession, autoflush=False, expire_on_commit=False)

Base = declarative_base()

def create_table():
  Base.metadata.create_all(bind=engine)