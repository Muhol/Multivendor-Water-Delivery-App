from jose import jwt 
import httpx
import os 

CLERK_ISSUER = os.getenv("CLERK_ISSUER")
CLERK_JWKS_URL  = os.getenv("CLERK_JWKS_URL")
FRONTEND_CLERK_API_KEY = os.getenv("FRONTEND_CLERK_API_KEY")

async def verify_clerk_token(token: str):
  async with httpx.AsyncClient() as client:
    jwks = (await client.get(CLERK_JWKS_URL)).json()
    
  unverified_header = jwt.get_unverified_header(token)
  key = next((k for k in jwks["keys"] if k["kid"] == unverified_header["kid"] ), None)
  
  if key is None :
    return None 
  
  try:
    payload = jwt.decode(
      token,
      key,
      algorithms=["RS256"],
      audience=FRONTEND_CLERK_API_KEY,
      issuer=CLERK_ISSUER,
    )
    return payload
  except Exception as e:
    return {"Token verification failed : " + e}
