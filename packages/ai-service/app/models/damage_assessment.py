"""
Damage Assessment Model
"""
from sqlalchemy import Column, Integer, String, Float, Text, JSON, DateTime
from .base import BaseModel

class DamageAssessmentModel(BaseModel):
    """Database model for damage assessments"""
    __tablename__ = "damage_assessments"

    id = Column(Integer, primary_key=True, index=True)
    image_path = Column(String, nullable=False)
    image_filename = Column(String, nullable=False)
    damage_level = Column(String, nullable=False)  # Minor, Moderate, Severe
    confidence_score = Column(Float, nullable=False)
    analysis_data = Column(JSON, nullable=True)
    processing_time = Column(Float, nullable=True)
    location_data = Column(JSON, nullable=True)
    weather_data = Column(JSON, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String, default="completed")  # pending, processing, completed, failed
