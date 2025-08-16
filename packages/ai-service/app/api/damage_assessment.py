"""
Damage Assessment API
Handles image upload, analysis, and damage assessment endpoints
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import os
import uuid
import shutil
from datetime import datetime
from typing import Optional, Dict
import logging
import numpy as np


from ..config.database import get_database
from ..config.settings import get_settings
from ..services.cv_service import CVService
from ..services.ml_service import MLService
from ..services.geospatial_service import GeospatialService
from ..models.damage_assessment import DamageAssessmentModel
from ..schemas.damage_assessment import DamageAssessmentResponse
from ..utils.image_io import download_and_normalize_image, validate_image_file

router = APIRouter(prefix="/api/v1/damage")
settings = get_settings()
logger = logging.getLogger(__name__)

# Initialize services
cv_service = CVService()
ml_service = MLService()
geo_service = GeospatialService()

class AnalyzeByUrlPayload(BaseModel):
    fileUrl: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None


@router.post("/analyze-by-url", response_model=DamageAssessmentResponse)
async def analyze_damage_by_url(payload: AnalyzeByUrlPayload, db: Session = Depends(get_database)):
    try:
        if not payload.fileUrl:
            raise HTTPException(status_code=400, detail="fileUrl is required")

        # Download & normalize image from URL -> file_path
        try:
            file_path = download_and_normalize_image(payload.fileUrl, settings.upload_directory)
            logger.info(f"Image downloaded and normalized: {file_path}")

            # Validate the downloaded file
            if not validate_image_file(file_path):
                # Clean up invalid file
                if os.path.exists(file_path):
                    os.remove(file_path)
                raise HTTPException(status_code=400, detail="Downloaded file is not a valid image")

        except ValueError as e:
            raise HTTPException(status_code=400, detail=str(e))
        except Exception as e:
            logger.error(f"Failed to download image from URL: {str(e)}")
            raise HTTPException(status_code=500, detail="Failed to download image from URL")

        # Generate assessment_id for tracking
        assessment_id = str(uuid.uuid4())

        # 🔥 AI DAMAGE ASSESSMENT PIPELINE

        # 1. Computer Vision Analysis
        cv_result = await cv_service.analyze_damage(file_path)
        cv_result = convert_numpy_types(cv_result)

        # 2. Machine Learning Damage Classification
        ml_result = await ml_service.classify_damage(file_path, None)  # No disaster type from URL
        ml_result = convert_numpy_types(ml_result)

        # 3. Infrastructure Impact Assessment
        infrastructure_impact = await cv_service.assess_infrastructure_damage(file_path)
        infrastructure_impact = convert_numpy_types(infrastructure_impact)

        # 4. Severity Scoring (1-10 scale)
        severity_score = calculate_severity_score(cv_result, ml_result, infrastructure_impact)
        severity_score = float(severity_score)

        # 5. Resource Requirement Prediction
        resource_requirements = await ml_service.predict_resource_requirements(
            severity_score, infrastructure_impact, None
        )
        resource_requirements = convert_numpy_types(resource_requirements)

        # 6. Priority Assessment
        priority_score = await ml_service.calculate_priority_score(
            severity_score, resource_requirements, payload.latitude, payload.longitude
        )
        priority_score = float(priority_score)

        # 7. Geospatial Analysis (if coordinates provided)
        location_data = None
        if payload.latitude is not None and payload.longitude is not None:
            location_data = await geo_service.get_location_info(payload.latitude, payload.longitude)
            if location_data:
                location_data = convert_numpy_types(location_data)

        # 8. Generate Action Recommendations
        recommendations = generate_action_recommendations(
            severity_score, resource_requirements, infrastructure_impact
        )

        # Compile comprehensive assessment data
        analysis_data = {
            "file_info": {
                "filename": os.path.basename(file_path),
                "assessment_id": assessment_id,
                "file_path": file_path,
                "source_url": payload.fileUrl
            },
            "damage_analysis": {
                "severity_score": severity_score,
                "damage_level": get_damage_level(severity_score),
                "confidence_score": max(cv_result.get("confidence_score", 0), ml_result.get("confidence_score", 0)),
                "assessment_timestamp": datetime.utcnow().isoformat()
            },
            "computer_vision": cv_result,
            "machine_learning": ml_result,
            "infrastructure_impact": infrastructure_impact,
            "resource_requirements": resource_requirements,
            "priority_assessment": {
                "priority_score": priority_score,
                "urgency_level": get_urgency_level(priority_score),
                "estimated_response_time": calculate_response_time(priority_score)
            },
            "location_data": {
                "latitude": payload.latitude,
                "longitude": payload.longitude,
                "geospatial_analysis": location_data
            }
        }

        # Convert the entire analysis_data to ensure no numpy types remain
        analysis_data = convert_numpy_types(analysis_data)

        # Save to database
        assessment = DamageAssessmentModel(
            image_path=file_path,
            image_filename=os.path.basename(file_path),
            damage_level=get_damage_level(severity_score),
            severity_score=severity_score,
            confidence_score=float(analysis_data["damage_analysis"]["confidence_score"]),
            priority_score=priority_score,
            urgency_level=get_urgency_level(priority_score),
            analysis_data=analysis_data,
            processing_time=0,  # Will be calculated
            location_data={"latitude": payload.latitude, "longitude": payload.longitude} if payload.latitude and payload.longitude else None,
            disaster_type=None,  # URL-based analysis doesn't specify disaster type
            status="completed",
            created_at=datetime.utcnow()
        )

        db.add(assessment)
        db.commit()
        db.refresh(assessment)

        logger.info(f"✅ URL-based damage assessment completed - Severity: {severity_score}/10, Priority: {priority_score}")

        # Return properly structured response matching DamageAssessmentResponse schema
        return DamageAssessmentResponse(
            id=assessment.id,
            assessment_id=assessment_id,
            severity_score=severity_score,
            damage_level=get_damage_level(severity_score),
            confidence_score=float(analysis_data["damage_analysis"]["confidence_score"]),
            priority_score=priority_score,
            urgency_level=get_urgency_level(priority_score),
            resource_requirements=resource_requirements,
            infrastructure_impact=infrastructure_impact,
            analysis_data=analysis_data,
            recommendations=recommendations,
            status="completed",
            created_at=assessment.created_at
        )

    except HTTPException:
        raise
    except Exception as e:
        logger.exception("URL-based analysis failed")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

def convert_numpy_types(obj):
    """Convert numpy types to native Python types for JSON serialization"""
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.bool_):
        return bool(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {key: convert_numpy_types(value) for key, value in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy_types(item) for item in obj]
    else:
        return obj

@router.post("/assess-damage", response_model=DamageAssessmentResponse)
async def assess_damage(
    file: UploadFile = File(...),
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    disaster_type: Optional[str] = None,
    db: Session = Depends(get_database)
):
    """
    AI-powered disaster impact assessment from images

    - **file**: Image file to analyze
    - **latitude**: Location latitude (optional)
    - **longitude**: Location longitude (optional)
    - **disaster_type**: Type of disaster (earthquake, flood, fire, etc.)

    Returns comprehensive damage assessment with severity scoring and resource predictions
    """
    try:
        # Validate file
        if not file.filename:
            raise HTTPException(status_code=400, detail="No file provided")

        ext = file.filename.split('.')[-1].lower()
        if ext not in settings.allowed_extensions:
            raise HTTPException(
                status_code=400,
                detail=f"File type not allowed. Supported: {settings.allowed_extensions}"
            )

        if file.size > settings.max_file_size:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Maximum size: {settings.max_file_size / (1024*1024):.1f}MB"
            )

        # Create unique filename and save file
        file_id = str(uuid.uuid4())
        file_extension = file.filename.split('.')[-1].lower()
        saved_filename = f"{file_id}.{file_extension}"
        file_path = os.path.join(settings.upload_directory, saved_filename)

        # Ensure upload directory exists
        os.makedirs(settings.upload_directory, exist_ok=True)

        # Save uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        logger.info(f"File saved: {file_path}")

        # 🔥 AI DAMAGE ASSESSMENT PIPELINE

        # 1. Computer Vision Analysis
        cv_result = await cv_service.analyze_damage(file_path)
        cv_result = convert_numpy_types(cv_result)  # Convert numpy types

        # 2. Machine Learning Damage Classification
        ml_result = await ml_service.classify_damage(file_path, disaster_type)
        ml_result = convert_numpy_types(ml_result)  # Convert numpy types

        # 3. Infrastructure Impact Assessment
        infrastructure_impact = await cv_service.assess_infrastructure_damage(file_path)
        infrastructure_impact = convert_numpy_types(infrastructure_impact)  # Convert numpy types

        # 4. Severity Scoring (1-10 scale)
        severity_score = calculate_severity_score(cv_result, ml_result, infrastructure_impact)
        severity_score = float(severity_score)  # Ensure it's a Python float

        # 5. Resource Requirement Prediction
        resource_requirements = await ml_service.predict_resource_requirements(
            severity_score, infrastructure_impact, disaster_type
        )
        resource_requirements = convert_numpy_types(resource_requirements)  # Convert numpy types

        # 6. Priority Assessment
        priority_score = await ml_service.calculate_priority_score(
            severity_score, resource_requirements, latitude, longitude
        )
        priority_score = float(priority_score)  # Ensure it's a Python float

        # 7. Geospatial Analysis (if coordinates provided)
        geospatial_data = None
        if latitude and longitude:
            geospatial_data = await geo_service.analyze_location_risk(latitude, longitude)
            if geospatial_data:
                geospatial_data = convert_numpy_types(geospatial_data)

        # Compile comprehensive assessment
        assessment_data = {
            "file_info": {
                "filename": file.filename,
                "file_id": file_id,
                "file_path": file_path,
                "file_size": file.size
            },
            "damage_analysis": {
                "severity_score": severity_score,
                "damage_level": get_damage_level(severity_score),
                "confidence_score": max(cv_result.get("confidence_score", 0), ml_result.get("confidence_score", 0)),
                "assessment_timestamp": datetime.utcnow().isoformat()
            },
            "computer_vision": cv_result,
            "machine_learning": ml_result,
            "infrastructure_impact": infrastructure_impact,
            "resource_requirements": resource_requirements,
            "priority_assessment": {
                "priority_score": priority_score,
                "urgency_level": get_urgency_level(priority_score),
                "estimated_response_time": calculate_response_time(priority_score)
            },
            "location_data": {
                "latitude": latitude,
                "longitude": longitude,
                "geospatial_analysis": geospatial_data
            },
            "recommendations": generate_action_recommendations(
                severity_score, resource_requirements, infrastructure_impact
            )
        }

        # Convert the entire assessment_data to ensure no numpy types remain
        assessment_data = convert_numpy_types(assessment_data)

        # Save to database
        damage_assessment = DamageAssessmentModel(
            image_path=file_path,
            image_filename=file.filename,
            damage_level=get_damage_level(severity_score),
            severity_score=severity_score,
            confidence_score=float(assessment_data["damage_analysis"]["confidence_score"]),
            priority_score=priority_score,
            urgency_level=get_urgency_level(priority_score),
            analysis_data=assessment_data,
            processing_time=0,  # Will be calculated
            location_data={"latitude": latitude, "longitude": longitude} if latitude and longitude else None,
            disaster_type=disaster_type,
            status="completed",
            created_at=datetime.utcnow()
        )

        db.add(damage_assessment)
        db.commit()
        db.refresh(damage_assessment)

        logger.info(f"✅ Damage assessment completed - Severity: {severity_score}/10, Priority: {priority_score}")

        return DamageAssessmentResponse(
            id=damage_assessment.id,
            assessment_id=file_id,
            severity_score=severity_score,
            damage_level=get_damage_level(severity_score),
            confidence_score=float(assessment_data["damage_analysis"]["confidence_score"]),
            priority_score=priority_score,
            urgency_level=get_urgency_level(priority_score),
            resource_requirements=resource_requirements,
            infrastructure_impact=infrastructure_impact,
            analysis_data=assessment_data,
            recommendations=assessment_data["recommendations"],
            status="completed",
            created_at=damage_assessment.created_at
        )

    except Exception as e:
        logger.error(f"Damage assessment failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

def calculate_severity_score(cv_result: Dict, ml_result: Dict, infrastructure_impact: Dict) -> float:
    """Calculate severity score (1-10 scale) based on all analysis results"""

    # Base scores from different analysis methods
    cv_score = cv_result.get("damage_score", 0) * 10  # Convert to 1-10 scale
    ml_score = ml_result.get("damage_score", 0) * 10

    # Infrastructure impact factors
    structural_impact = infrastructure_impact.get("structural_integrity_score", 5)
    safety_impact = infrastructure_impact.get("safety_score", 5)

    # Weighted combination
    severity = (
        cv_score * 0.35 +           # Computer vision analysis
        ml_score * 0.35 +           # ML classification
        structural_impact * 0.20 +   # Structural assessment
        safety_impact * 0.10        # Safety considerations
    )

    # Ensure score is between 1-10
    return max(1.0, min(10.0, round(severity, 1)))

def get_damage_level(severity_score: float) -> str:
    """Convert severity score to damage level classification"""
    if severity_score <= 2.0:
        return "Minimal"
    elif severity_score <= 4.0:
        return "Minor"
    elif severity_score <= 6.0:
        return "Moderate"
    elif severity_score <= 8.0:
        return "Severe"
    else:
        return "Critical"

def get_urgency_level(priority_score: float) -> str:
    """Convert priority score to urgency level"""
    if priority_score >= 8.0:
        return "Critical"
    elif priority_score >= 6.0:
        return "High"
    elif priority_score >= 4.0:
        return "Medium"
    else:
        return "Low"

def calculate_response_time(priority_score: float) -> str:
    """Estimate response time based on priority score"""
    if priority_score >= 8.0:
        return "Immediate (< 1 hour)"
    elif priority_score >= 6.0:
        return "Urgent (1-4 hours)"
    elif priority_score >= 4.0:
        return "Standard (4-24 hours)"
    else:
        return "Routine (24-72 hours)"

def generate_action_recommendations(
    severity_score: float,
    resource_requirements: Dict,
    infrastructure_impact: Dict
) -> list:
    """Generate actionable recommendations based on assessment results"""

    recommendations = []

    # Critical damage recommendations
    if severity_score >= 8.0:
        recommendations.extend([
            "🚨 IMMEDIATE EVACUATION required",
            "🚑 Deploy emergency medical teams",
            "🏗️ Structural engineers needed for safety assessment",
            "🚓 Establish security perimeter",
            "📡 Set up emergency communication hub"
        ])

    # Severe damage recommendations
    elif severity_score >= 6.0:
        recommendations.extend([
            "⚠️ Area cordoning required",
            "🏥 Medical assistance may be needed",
            "🔧 Utility services inspection required",
            "🏠 Temporary shelter arrangements",
            "📋 Damage documentation for insurance"
        ])

    # Moderate damage recommendations
    elif severity_score >= 4.0:
        recommendations.extend([
            "🔍 Detailed structural inspection recommended",
            "🛠️ Repair planning required",
            "📞 Contact insurance providers",
            "🚧 Monitor for further deterioration"
        ])

    # Infrastructure-specific recommendations
    if infrastructure_impact.get("utilities_affected"):
        recommendations.append("⚡ Utility restoration priority")

    if infrastructure_impact.get("road_access_blocked"):
        recommendations.append("🛣️ Clear access routes for emergency vehicles")

    # Resource-based recommendations
    if resource_requirements.get("medical_personnel", 0) > 0:
        recommendations.append(f"👨‍⚕️ Deploy {resource_requirements['medical_personnel']} medical personnel")

    if resource_requirements.get("heavy_equipment"):
        recommendations.append("🚜 Heavy machinery required for debris removal")

    return recommendations

# Legacy endpoint for backward compatibility
@router.post("/analyze", response_model=DamageAssessmentResponse)
async def analyze_damage(
    file: UploadFile = File(...),
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    db: Session = Depends(get_database)
):
    """Legacy endpoint - redirects to assess-damage"""
    return await assess_damage(file, latitude, longitude, None, db)

@router.get("/assessment/{assessment_id}")
async def get_assessment(assessment_id: str, db: Session = Depends(get_database)):
    """Retrieve a specific damage assessment by ID"""
    assessment = db.query(DamageAssessmentModel).filter(
        DamageAssessmentModel.id == assessment_id
    ).first()

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    return assessment

@router.get("/assessments")
async def list_assessments(
    skip: int = 0,
    limit: int = 100,
    severity_min: Optional[float] = None,
    db: Session = Depends(get_database)
):
    """List all damage assessments with optional filtering"""
    query = db.query(DamageAssessmentModel)

    if severity_min:
        query = query.filter(DamageAssessmentModel.severity_score >= severity_min)

    assessments = query.offset(skip).limit(limit).all()
    return assessments
