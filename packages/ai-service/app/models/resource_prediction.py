"""
Resource Prediction Model
"""
from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class ResourcePredictionModel(BaseModel):
    """Database model for resource predictions"""
    __tablename__ = "resource_predictions"

    damage_assessment_id = Column(Integer, ForeignKey("damage_assessments.id"), nullable=False)
    priority_score_id = Column(Integer, ForeignKey("priority_scores.id"), nullable=False)

    # Predicted resources
    medical_personnel = Column(Integer, default=0)
    rescue_teams = Column(Integer, default=0)
    emergency_vehicles = Column(Integer, default=0)
    relief_supplies = Column(JSON, nullable=True)  # food, water, blankets, etc.
    equipment_needed = Column(JSON, nullable=True)  # generators, tents, etc.

    # Predictions
    deployment_timeline = Column(Float, nullable=True)  # hours
    cost_estimate = Column(Float, nullable=True)
    confidence_score = Column(Float, nullable=False)

    # Relationships
    damage_assessment = relationship("DamageAssessmentModel", backref="resource_predictions")
    priority_score = relationship("PriorityScoreModel", backref="resource_predictions")
