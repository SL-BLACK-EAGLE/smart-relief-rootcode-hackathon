"""
Damage Assessment API
Handles image upload, analysis, and damage assessment endpoints
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
import os
import uuid
import shutil
from datetime import datetime
from typing import Optional

from ..config.database import get_database
from ..config.settings import get_settings
from ..services.cv_service import CVService
from ..services.ml_service import MLService
from ..services.geospatial_service import GeospatialService
from ..models.damage_assessment import DamageAssessmentModel
from ..schemas.damage_assessment import DamageAssessmentResponse, DamageAssessmentCreate

router = APIRouter()
settings = get_settings()

# Initialize services
cv_service = CVService()
ml_service = MLService()
geo_service = GeospatialService()

@router.post("/analyze", response_model=DamageAssessmentResponse)
async def analyze_damage(
    file: UploadFile = File(...),
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    db: Session = Depends(get_database)
):
    """Analyze uploaded image for damage assessment"""
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

        # Create unique filename and save file
        file_id = str(uuid.uuid4())
        file_extension = file.filename.split('.')[-1].lower()
        unique_filename = f"{file_id}.{file_extension}"

        # Ensure upload directory exists
        os.makedirs(settings.upload_directory, exist_ok=True)
        file_path = os.path.join(settings.upload_directory, unique_filename)

        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process image with CV service
        preprocessing_result = await cv_service.preprocess_image(file_path)
        if preprocessing_result.get("status") != "success":
            raise HTTPException(status_code=500, detail="Image preprocessing failed")

        # Extract features and detect damage
        features = preprocessing_result.get("features", {})
        damage_result = await cv_service.detect_damage(features)

        # Use ML service for enhanced prediction
        ml_result = await ml_service.predict_damage_level(features)

        # Combine CV and ML results (prefer ML if available)
        final_damage_level = ml_result.get("damage_level", damage_result.get("damage_level"))
        final_confidence = ml_result.get("confidence_score", damage_result.get("confidence_score"))

        # Get location data if coordinates provided
        location_data = None
        if latitude and longitude:
            location_data = await geo_service.get_location_info(latitude, longitude)

        # Analyze infrastructure impact
        infrastructure_analysis = await cv_service.analyze_infrastructure(file_path, {
            "damage_level": final_damage_level,
            "confidence_score": final_confidence
        })

        # Save to database
        assessment = DamageAssessmentModel(
            image_path=file_path,
            image_filename=file.filename,
            damage_level=final_damage_level,
            confidence_score=final_confidence,
            analysis_data={
                "cv_result": damage_result,
                "ml_result": ml_result,
                "preprocessing": preprocessing_result,
                "infrastructure": infrastructure_analysis
            },
            processing_time=preprocessing_result.get("processing_time", 0),
            location_data=location_data,
            status="completed"
        )

        db.add(assessment)
        db.commit()
        db.refresh(assessment)

        return {
            "id": assessment.id,
            "damage_level": final_damage_level,
            "confidence_score": final_confidence,
            "analysis_data": assessment.analysis_data,
            "location_data": location_data,
            "infrastructure_impact": infrastructure_analysis,
            "created_at": assessment.created_at.isoformat(),
            "status": "completed"
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/assessments/{assessment_id}")
async def get_assessment(assessment_id: int, db: Session = Depends(get_database)):
    """Get specific damage assessment by ID"""
    assessment = db.query(DamageAssessmentModel).filter(
        DamageAssessmentModel.id == assessment_id
    ).first()

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    return {
        "id": assessment.id,
        "damage_level": assessment.damage_level,
        "confidence_score": assessment.confidence_score,
        "analysis_data": assessment.analysis_data,
        "location_data": assessment.location_data,
        "created_at": assessment.created_at.isoformat(),
        "status": assessment.status
    }

@router.get("/assessments")
async def list_assessments(
    skip: int = 0,
    limit: int = 100,
    damage_level: Optional[str] = None,
    db: Session = Depends(get_database)
):
    """List damage assessments with optional filtering"""
    query = db.query(DamageAssessmentModel)

    if damage_level:
        query = query.filter(DamageAssessmentModel.damage_level == damage_level)

    assessments = query.offset(skip).limit(limit).all()

    return {
        "assessments": [
            {
                "id": assessment.id,
                "damage_level": assessment.damage_level,
                "confidence_score": assessment.confidence_score,
                "image_filename": assessment.image_filename,
                "created_at": assessment.created_at.isoformat(),
                "status": assessment.status
            }
            for assessment in assessments
        ],
        "total": query.count(),
        "skip": skip,
        "limit": limit
    }

@router.delete("/assessments/{assessment_id}")
async def delete_assessment(assessment_id: int, db: Session = Depends(get_database)):
    """Delete damage assessment"""
    assessment = db.query(DamageAssessmentModel).filter(
        DamageAssessmentModel.id == assessment_id
    ).first()

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    # Delete image file if exists
    if os.path.exists(assessment.image_path):
        os.remove(assessment.image_path)

    db.delete(assessment)
    db.commit()

    return {"message": "Assessment deleted successfully"}
