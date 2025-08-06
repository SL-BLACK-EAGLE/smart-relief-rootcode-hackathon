"""
Application Settings Configuration
"""
from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List, Optional
import os

class Settings(BaseSettings):
    """Application settings"""

    # Application settings
    app_name: str = "AI Disaster Relief System"
    app_version: str = "1.0.0"
    debug: bool = False

    # Database settings
    database_url: str = Field(
        default="postgresql://postgres:Tehan@14637@localhost:5432/disaster_relief",
        description="Database connection URL"
    )

    # Security settings
    secret_key: str = Field(
        default="your-secret-key-change-in-production",
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
        default="",
        description="OpenWeatherMap API key"
    )

    # CORS settings
    cors_origins: str = Field(default="*")

    # Logging settings
    log_level: str = "INFO"

    # AI/ML settings
    confidence_threshold: float = 0.7
    batch_size: int = 32

    @property
    def cors_origins_list(self) -> List[str]:
        """Convert CORS origins string to list"""
        if self.cors_origins == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        extra = "ignore"

# Global settings instance
_settings = None

def get_settings() -> Settings:
    """Get application settings singleton"""
    global _settings
    if _settings is None:
        _settings = Settings()
    return _settings
