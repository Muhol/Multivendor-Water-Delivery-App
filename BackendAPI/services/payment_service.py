# import requests

# response = requests.request("GET", 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', headers = { 'Authorization': 'Basic ZVFiYVVtR0JHWnA4NUdiRFNQZHJYTzQ5WXlrSVFsRzl4U2NGOWdVelpBNUR1dWd5OlBxYldqZWl1SG1UcDc0d3IzMGYwZWx4d0x3YzVFRU5PN2xJOTZiUEZSblR0QUdSZnI3bFIzQVV1MFFUcGZtYnU=' })
# print(response.text.encode('utf8'))

# mpesa_token.py
import base64, os, datetime
import httpx
from dotenv import load_dotenv


load_dotenv()

async def get_access_token():
    consumer_key = os.getenv("MPESA_CONSUMER_KEY")
    consumer_secret = os.getenv("MPESA_CONSUMER_SECRET")
    credentials = f"{consumer_key}:{consumer_secret}"
    encoded = base64.b64encode(credentials.encode()).decode()

    headers = {
        "Authorization": f"Basic {encoded}"
    }

    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"

    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=headers)
        data = response.json()
        return data.get("access_token")

def generate_password():
    shortcode = os.getenv("MPESA_SHORTCODE")
    passkey = os.getenv("MPESA_PASSKEY")
    timestamp = datetime.datetime.now().strftime('%Y%m%d%H%M%S')
    raw_password = shortcode + passkey + timestamp
    password = base64.b64encode(raw_password.encode()).decode()
    return password, timestamp

async def initiate_stk_push(phone: str, amount: int):
    token = await get_access_token()
    password, timestamp = generate_password()

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    payload = {
        "BusinessShortCode": os.getenv("MPESA_SHORTCODE"),
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": amount,
        "PartyA": phone,
        "PartyB": os.getenv("MPESA_SHORTCODE"),
        "PhoneNumber": phone,
        "CallBackURL": os.getenv("MPESA_CALLBACK_URL"),
        "AccountReference": "Vepo",
        "TransactionDesc": "Payment"
    }

    # print("🔐 Payload Sent to M-PESA:")
    # print(payload)

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
                headers=headers,
                json=payload
            )
            print("✅ M-PESA STK Response:", response.text)
            return response.json()
    except httpx.HTTPError as e:
        print("❌ HTTP Error:", str(e))
        return {"error": str(e)}




# import os
# import base64
# from datetime import datetime
# from fastapi import FastAPI
# import httpx
# from dotenv import load_dotenv

# load_dotenv()

# app = FastAPI()

# # Environment variables (set these in your .env)
# MPESA_CONSUMER_KEY = os.getenv("MPESA_CONSUMER_KEY")
# MPESA_CONSUMER_SECRET = os.getenv("MPESA_CONSUMER_SECRET")
# MPESA_SHORTCODE = "174379"
# MPESA_PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c91"
# CALLBACK_URL = "https://your-ngrok-url.ngrok-free.app/api/mpesa/callback"  # Replace with your actual ngrok URL

# # ✅ Step 1: Get Access Token
# async def get_access_token():
#     credentials = f"{MPESA_CONSUMER_KEY}:{MPESA_CONSUMER_SECRET}"
#     encoded_credentials = base64.b64encode(credentials.encode()).decode()
#     headers = {"Authorization": f"Basic {encoded_credentials}"}

#     async with httpx.AsyncClient() as client:
#         response = await client.get(
#             "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
#             headers=headers
#         )
#         data = response.json()
#         print("🔑 Access Token:", data.get("access_token"))
#         return data.get("access_token")


# # ✅ Step 2: Initiate STK Push
# @app.post("/api/mpesa_payment")
# async def initiate_stk_push():
#     timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
#     password_str = MPESA_SHORTCODE + MPESA_PASSKEY + timestamp
#     password = base64.b64encode(password_str.encode()).decode()

#     access_token = await get_access_token()
#     headers = {
#         "Authorization": f"Bearer {access_token}",
#         "Content-Type": "application/json"
#     }

#     payload = {
#         "BusinessShortCode": MPESA_SHORTCODE,
#         "Password": password,
#         "Timestamp": timestamp,
#         "TransactionType": "CustomerPayBillOnline",
#         "Amount": 1,
#         "PartyA": "254708374149",  # Use test phone number only
#         "PartyB": MPESA_SHORTCODE,
#         "PhoneNumber": "254708374149",  # Use test phone number only
#         "CallBackURL": CALLBACK_URL,
#         "AccountReference": "VEPO",
#         "TransactionDesc": "Test Payment"
#     }

#     print("📦 Sending Payload:", payload)

#     async with httpx.AsyncClient() as client:
#         response = await client.post(
#             "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
#             headers=headers,
#             json=payload
#         )
#         print("✅ STK Push Response:", response.text)
#         return response.json()