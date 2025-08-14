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
    damage_level = Column(String, nullable=False)  # Minimal, Minor, Moderate, Severe, Critical
    severity_score = Column(Float, nullable=False)  # 1-10 scale severity scoring
    confidence_score = Column(Float, nullable=False)
    priority_score = Column(Float, nullable=True)  # 1-10 scale priority scoring
    urgency_level = Column(String, nullable=True)  # Low, Medium, High, Critical
    disaster_type = Column(String, nullable=True)  # earthquake, flood, fire, hurricane, etc.
    analysis_data = Column(JSON, nullable=True)  # Complete analysis results
    processing_time = Column(Float, nullable=True)

    # Location and context
    location_data = Column(JSON, nullable=True)
    weather_data = Column(JSON, nullable=True)

    # Additional information
    notes = Column(Text, nullable=True)
    status = Column(String, default="completed")  # pending, processing, completed, failed
    created_by = Column(String, nullable=True)  # User who created the assessment
