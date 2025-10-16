from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Database
    DATABASE_URL: str = "postgresql://postgres:password@localhost:5432/timi_db"
    DB_USER: str = "postgres"
    DB_PASSWORD: str = "password"
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "timi_db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    
    # App
    APP_NAME: str = "Timi API"
    DEBUG: bool = False
    
    # For python-jose
    @property
    def algorithm(self) -> str:
        return "HS256"
    
    @property
    def secret_key(self) -> str:
        return self.SECRET_KEY
    
    @property
    def access_token_expire_minutes(self) -> int:
        return self.ACCESS_TOKEN_EXPIRE_MINUTES
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()