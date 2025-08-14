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
    disaster_type: Optional[str] = Field(None, description="Type of disaster (earthquake, flood, fire, etc.)")
    notes: Optional[str] = Field(None, description="Additional notes")

class DamageAssessmentResponse(BaseModel):
    """Schema for comprehensive damage assessment response"""
    id: int = Field(..., description="Assessment ID")
    assessment_id: str = Field(..., description="Unique assessment identifier")

    # Core Assessment Results
    severity_score: float = Field(..., description="Severity score (1-10 scale)", ge=1.0, le=10.0)
    damage_level: str = Field(..., description="Damage level classification (Minimal/Minor/Moderate/Severe/Critical)")
    confidence_score: float = Field(..., description="Overall confidence score (0-1)", ge=0.0, le=1.0)

    # Priority Assessment
    priority_score: float = Field(..., description="Priority score for response planning (1-10)", ge=1.0, le=10.0)
    urgency_level: str = Field(..., description="Urgency level (Low/Medium/High/Critical)")

    # Resource Requirements
    resource_requirements: Dict[str, Any] = Field(..., description="Predicted resource requirements")

    # Infrastructure Impact
    infrastructure_impact: Dict[str, Any] = Field(..., description="Infrastructure damage assessment")

    # Comprehensive Analysis Data
    analysis_data: Dict[str, Any] = Field(..., description="Complete analysis results including CV and ML data")

    # Action Recommendations
    recommendations: List[str] = Field(..., description="AI-generated action recommendations")

    # Status and Metadata
    status: str = Field(..., description="Assessment status")
    created_at: datetime = Field(..., description="Assessment creation timestamp")

    class Config:
        from_attributes = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

class ResourceRequirements(BaseModel):
    """Schema for resource requirements breakdown"""
    # Personnel
    emergency_responders: int = Field(..., description="Number of emergency responders needed")
    medical_personnel: int = Field(..., description="Number of medical personnel needed")
    engineers: int = Field(..., description="Number of engineers needed")
    volunteers: int = Field(..., description="Number of volunteers needed")

    # Equipment
    ambulances: int = Field(..., description="Number of ambulances needed")
    fire_trucks: int = Field(..., description="Number of fire trucks needed")
    heavy_equipment: bool = Field(..., description="Whether heavy equipment is required")

    # Supplies
    medical_supplies: str = Field(..., description="Medical supplies required")
    water_bottles: str = Field(..., description="Water bottles needed")
    emergency_food: str = Field(..., description="Emergency food supplies")

    # Timeline
    deployment_timeline: Dict[str, str] = Field(..., description="Deployment timeline breakdown")
    estimated_duration: Dict[str, str] = Field(..., description="Estimated operation duration")

class InfrastructureImpact(BaseModel):
    """Schema for infrastructure impact assessment"""
    structural_integrity: str = Field(..., description="Structural integrity status")
    structural_integrity_score: float = Field(..., description="Structural integrity score (1-10)")
    safety_level: str = Field(..., description="Safety level assessment")
    safety_score: float = Field(..., description="Safety score (1-10)")
    accessibility: str = Field(..., description="Accessibility status")
    utilities_status: str = Field(..., description="Utilities status")
    evacuation_needed: bool = Field(..., description="Whether evacuation is needed")
    road_access_blocked: bool = Field(..., description="Whether road access is blocked")

class DamageAssessmentList(BaseModel):
    """Schema for listing damage assessments"""
    assessments: List[DamageAssessmentResponse]
    total: int
    skip: int
    limit: int

class AssessmentSummary(BaseModel):
    """Schema for assessment summary statistics"""
    total_assessments: int
    severity_distribution: Dict[str, int]
    urgency_distribution: Dict[str, int]
    average_severity: float
    critical_cases: int
    recent_assessments: List[DamageAssessmentResponse]
