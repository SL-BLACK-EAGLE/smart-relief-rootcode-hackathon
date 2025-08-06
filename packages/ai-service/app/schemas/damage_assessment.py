"""
Damage Assessment Schemas
Pydantic models for damage assessment API requests and responses
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime

class DamageAssessmentCreate(BaseModel):
    """Schema for creating damage assessment"""
    image_filename: str = Field(..., description="Name of the uploaded image file")
    latitude: Optional[float] = Field(None, description="Latitude coordinate")
    longitude: Optional[float] = Field(None, description="Longitude coordinate")
    notes: Optional[str] = Field(None, description="Additional notes")

class DamageAssessmentResponse(BaseModel):
    """Schema for damage assessment response"""
    id: int = Field(..., description="Assessment ID")
    damage_level: str = Field(..., description="Detected damage level")
    confidence_score: float = Field(..., description="Confidence score (0-1)")
    analysis_data: Optional[Dict[str, Any]] = Field(None, description="Detailed analysis data")
    location_data: Optional[Dict[str, Any]] = Field(None, description="Location information")
    infrastructure_impact: Optional[Dict[str, Any]] = Field(None, description="Infrastructure impact analysis")
    created_at: str = Field(..., description="Creation timestamp")
    status: str = Field(..., description="Assessment status")

    class Config:
        from_attributes = True

class DamageAssessmentList(BaseModel):
    """Schema for listing damage assessments"""
    assessments: List[DamageAssessmentResponse]
    total: int
    skip: int
    limit: int
