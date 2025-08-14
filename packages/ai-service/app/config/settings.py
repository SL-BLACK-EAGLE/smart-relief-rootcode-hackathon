"""
Application Settings Configuration
"""
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List, Optional
import os

class Settings(BaseSettings):
    """Application settings"""

    model_config = {
        "extra": "allow",
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False
    }

    # Application settings
    app_name: str = "AI Disaster Relief System"
    app_version: str = "1.0.0"
    debug: bool = Field(default=True, description="Debug mode")

    # Database settings - Fixed connection string format
    database_url: str = Field(
        default="sqlite:///./disaster_relief.db",  # Default to SQLite for easier setup
        description="Database connection URL"
    )

    # PostgreSQL settings (when using Docker)
    postgres_user: str = Field(default="postgres", description="PostgreSQL username")
    postgres_password: str = Field(default="Tehan@14637", description="PostgreSQL password")
    postgres_db: str = Field(default="disaster_relief", description="PostgreSQL database name")
    postgres_host: str = Field(default="localhost", description="PostgreSQL host")
    postgres_port: int = Field(default=5432, description="PostgreSQL port")

    # Security settings
    secret_key: str = Field(
        default="your-secret-key-change-in-production-ai-disaster-relief-2025",
        description="Secret key for JWT tokens"
    )

    # File upload settings
    max_file_size: int = 10 * 1024 * 1024  # 10MB
    allowed_extensions: List[str] = ["jpg", "jpeg", "png", "bmp", "tiff"]
    upload_directory: str = "uploads"

    # Model settings
    model_directory: str = "ml_models"
    damage_classifier_path: str = "ml_models/damage_classifier/model.pkl"
    priority_scorer_path: str = "ml_models/priority_scorer/model.pkl"
    demand_predictor_path: str = "ml_models/demand_predictor/model.pkl"

    # Weather API settings
    openweather_api_key: str = Field(
        default="79a6afdcad1281c44a183bf14e00e538",  # Added the API key you mentioned
        description="OpenWeatherMap API key"
    )

    # CORS settings
    cors_origins: str = Field(default="*")

    # Logging settings
    log_level: str = "INFO"

    @property
    def cors_origins_list(self) -> List[str]:
        """Convert CORS origins string to list"""
        if self.cors_origins == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def postgres_url(self) -> str:
        """Generate PostgreSQL connection URL"""
        return f"postgresql://{self.postgres_user}:{self.postgres_password}@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"


# Cache settings instance
_settings: Optional[Settings] = None

def get_settings() -> Settings:
    """Get cached settings instance"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
