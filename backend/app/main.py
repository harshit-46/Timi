from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import Optional, Dict
import jwt
import os
import logging

# Local imports
from core.database import get_db
from core.models import User

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI setup
app = FastAPI(title="Timi API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
]

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# Security
security = HTTPBearer()

# ----------------------- Pydantic Models -----------------------
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    email: str
    created_at: Optional[str] = None

class ErrorResponse(BaseModel):
    detail: str
    status_code: int

# ----------------------- Helper Functions -----------------------
def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')[:72]
    return pwd_context.hash(password_bytes)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    plain_bytes = plain_password.encode('utf-8')[:72]
    return pwd_context.verify(plain_bytes, hashed_password)

def create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verify_token(credentials=Depends(security)) -> str:
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ----------------------- API Endpoints -----------------------
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/register", response_model=TokenResponse, status_code=201, tags=["Auth"])
def register(req: RegisterRequest, db: Session = Depends(get_db)):
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == req.email).first()
    if existing_user:
        logger.warning(f"Registration attempt with existing email: {req.email}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Password validation
    if not any(c.isupper() for c in req.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must contain at least one uppercase letter")
    if not any(c.islower() for c in req.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must contain at least one lowercase letter")
    if not any(c.isdigit() for c in req.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must contain at least one number")

    # Hash password and create new user
    hashed_password = hash_password(req.password)
    new_user = User(email=req.email, password_hash=hashed_password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(req.email)
    logger.info(f"New user registered: {req.email}")

    return {"access_token": token, "token_type": "bearer", "user": {"email": req.email}}

@app.post("/login", response_model=TokenResponse, tags=["Auth"])
def login(req: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        logger.warning(f"Failed login attempt for email: {req.email}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(req.email)
    logger.info(f"User logged in: {req.email}")

    return {"access_token": token, "token_type": "bearer", "user": {"email": req.email}}

@app.get("/me", response_model=UserResponse, tags=["User"])
def get_current_user(email: str = Depends(verify_token), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"email": user.email, "created_at": user.created_at}

@app.post("/logout", tags=["Auth"])
def logout():
    return {"message": "Logged out successfully"}

# ----------------------- Error Handler -----------------------
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )

# ----------------------- Run Backend -----------------------
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)




"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from fastapi.responses import JSONResponse
from pydantic import BaseModel, EmailStr, Field
from passlib.context import CryptContext
from typing import Optional, Dict
import jwt
import os
from datetime import datetime, timedelta
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# FastAPI setup
app = FastAPI(title="Timi API", version="1.0.0")

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://localhost:8000",
]

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT settings
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

# In-memory "database"
users_db: Dict[str, Dict] = {}  # email -> {password_hash, created_at}

# Security
security = HTTPBearer()

# Pydantic models
class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    email: str
    created_at: Optional[str] = None

class ErrorResponse(BaseModel):
    detail: str
    status_code: int

# Helper functions
def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')[:72]  # truncate for bcrypt
    return pwd_context.hash(password_bytes)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    plain_bytes = plain_password.encode('utf-8')[:72]
    return pwd_context.verify(plain_bytes, hashed_password)

def create_access_token(email: str) -> str:
    payload = {
        "sub": email,
        "exp": datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def verify_token(credentials=Depends(security)) -> str:
    token = credentials.credentials  # HTTPBearer gives a .credentials property
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Create demo user at startup
@app.on_event("startup")
def create_demo_user():
    demo_email = "demo@example.com"
    demo_password = "password123"
    if demo_email not in users_db:
        users_db[demo_email] = {
            "password_hash": hash_password(demo_password),
            "created_at": datetime.utcnow().isoformat()
        }
        logger.info(f"Demo user created: {demo_email}")

# API Endpoints
@app.get("/health", tags=["Health"])
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.post("/register", response_model=TokenResponse, status_code=201, tags=["Auth"])
def register(req: RegisterRequest):
    if req.email in users_db:
        logger.warning(f"Registration attempt with existing email: {req.email}")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    # Validate password strength
    if not any(c.isupper() for c in req.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must contain at least one uppercase letter")
    if not any(c.islower() for c in req.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must contain at least one lowercase letter")
    if not any(c.isdigit() for c in req.password):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Password must contain at least one number")
    
    hashed_password = hash_password(req.password)
    users_db[req.email] = {
        "password_hash": hashed_password,
        "created_at": datetime.utcnow().isoformat()
    }

    token = create_access_token(req.email)
    logger.info(f"New user registered: {req.email}")

    return {"access_token": token, "token_type": "bearer", "user": {"email": req.email}}

@app.post("/login", response_model=TokenResponse, tags=["Auth"])
def login(req: LoginRequest):
    user_data = users_db.get(req.email)
    if not user_data or not verify_password(req.password, user_data["password_hash"]):
        logger.warning(f"Failed login attempt for email: {req.email}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_access_token(req.email)
    logger.info(f"User logged in: {req.email}")

    return {"access_token": token, "token_type": "bearer", "user": {"email": req.email}}

@app.get("/me", response_model=UserResponse, tags=["User"])
def get_current_user(email: str = Depends(verify_token)):
    user_data = users_db.get(email)
    if not user_data:
        raise HTTPException(status_code=404, detail="User not found")
    return {"email": email, "created_at": user_data.get("created_at")}

@app.post("/logout", tags=["Auth"])
def logout():
    return {"message": "Logged out successfully"}

# Error handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail, "status_code": exc.status_code}
    )

# Run backend
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)


"""