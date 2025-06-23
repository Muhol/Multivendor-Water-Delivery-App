from typing import Union
from fastapi import FastAPI
from pydantic import BaseModel
from routes import vendor_routes, auth_routes, product_routes, cart_routes
import models
from db.session import  create_table
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# origins = [
#     "http://localhost.tiangolo.com",
#     "https://localhost.tiangolo.com",
#     "http://localhost",
#     "http://localhost:8080",
# ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# create_table()

app.include_router(vendor_routes.router, prefix="/api")
app.include_router(auth_routes.router, prefix="/api")
app.include_router(product_routes.router, prefix="/api")
app.include_router(cart_routes.router, prefix="/api")

