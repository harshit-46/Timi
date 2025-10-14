from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from typing import Dict
import jwt
from datetime import datetime, timedelta

# FastAPI setup
app = FastAPI(title="Timi API", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

# Simple in-memory "database"
users_db: Dict[str, str] = {}  # email -> hashed_password

# JWT settings
SECRET_KEY = "supersecretkey"  # replace with env var in prod
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60

# Pydantic models
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# Create a demo user at startup
@app.on_event("startup")
def create_demo_user():
    demo_email = "demo@example.com"
    demo_password = "password123"
    if demo_email not in users_db:
        users_db[demo_email] = pwd_context.hash(demo_password)
        print("Demo user created!")

# Register endpoint
@app.post("/register", response_model=TokenResponse)
def register(req: RegisterRequest):
    if req.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed = pwd_context.hash(req.password)
    users_db[req.email] = hashed
    token = jwt.encode(
        {"sub": req.email, "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"access_token": token}

# Login endpoint
@app.post("/login", response_model=TokenResponse)
def login(req: LoginRequest):
    hashed = users_db.get(req.email)
    if not hashed or not pwd_context.verify(req.password, hashed):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = jwt.encode(
        {"sub": req.email, "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)},
        SECRET_KEY,
        algorithm=ALGORITHM
    )
    return {"access_token": token}

# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
