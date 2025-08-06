"""
Priority Scoring Model
"""
from sqlalchemy import Column, Integer, String, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .base import BaseModel

class PriorityScoreModel(BaseModel):
    """Database model for priority scoring"""
    __tablename__ = "priority_scores"

    damage_assessment_id = Column(Integer, ForeignKey("damage_assessments.id"), nullable=False)
    priority_level = Column(String, nullable=False)  # Low, Medium, High, Critical
    priority_score = Column(Float, nullable=False)  # 0-100
    urgency_factors = Column(JSON, nullable=True)
    resource_requirements = Column(JSON, nullable=True)
    estimated_response_time = Column(Float, nullable=True)  # in hours
    affected_population = Column(Integer, nullable=True)

    # Relationship
    damage_assessment = relationship("DamageAssessmentModel", backref="priority_scores")
