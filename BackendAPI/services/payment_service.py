# import requests

# response = requests.request("GET", 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', headers = { 'Authorization': 'Basic ZVFiYVVtR0JHWnA4NUdiRFNQZHJYTzQ5WXlrSVFsRzl4U2NGOWdVelpBNUR1dWd5OlBxYldqZWl1SG1UcDc0d3IzMGYwZWx4d0x3YzVFRU5PN2xJOTZiUEZSblR0QUdSZnI3bFIzQVV1MFFUcGZtYnU=' })
# print(response.text.encode('utf8'))

# mpesa_token.py
import base64, os, datetime
import httpx
from dotenv import load_dotenv
from services.order_service import update_orders_payment_status_by_checkout_id
from sqlalchemy.ext.asyncio import AsyncSession


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
        "Amount": 1,
        # "Amount": amount,
        # "PartyA": "254110861797",
        "PartyA": phone,
        "PartyB": os.getenv("MPESA_SHORTCODE"),
        # "PhoneNumber": "254110861797",
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


async def check_payment(checkout_request_id: str, session : AsyncSession): 
    access_token = await get_access_token()
    password, timestamp = generate_password()
    business_short_code = os.getenv("MPESA_SHORTCODE")
    
    query_headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + access_token
        }

    query_payload = {
        'BusinessShortCode': business_short_code,
        'Password': password,
        'Timestamp': timestamp,
        'CheckoutRequestID': checkout_request_id
    }
    
    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(
                "https://sandbox.safaricom.co.ke/mpesa/stkpushquery/v1/query",
                headers=query_headers,
                json=query_payload
            )
            print("✅ M-PESA QUERY Response:", response.text)
            response_data = response.json()
            
            if 'ResultCode' in response_data:
                result_code = response_data['ResultCode']
                if result_code == '1037':
                    message = {
                        "message":"Timeout in completing transaction",
                        "code": "1032"
                    }

                elif result_code == '1032':
                    message = {
                        "message": "Transaction was canceled by the user",
                        "code": "1032"
                    }

                elif result_code == '1':
                    message = {
                        "message": "The balance is insufficient for the transaction",
                        "code": "1"
                    }

                elif result_code == '0':
                    message = await update_orders_payment_status_by_checkout_id(session=session, checkout_request_id=checkout_request_id, new_status="paid")
                else:
                    message = {
                        "message": "Unknown result code: " + result_code,
                        "code": ""
                    }

            else:
                message = {"message": "Error in response"}


            return message
    except httpx.HTTPError as e:
        print("❌ HTTP Error:", str(e))
        return {"error": str(e)}