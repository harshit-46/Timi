from sqlalchemy import Column, String, DateTime
from datetime import datetime
from core.database import Base

class User(Base):
    __tablename__ = "users"

    email = Column(String, primary_key=True, index=True, unique=True)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
