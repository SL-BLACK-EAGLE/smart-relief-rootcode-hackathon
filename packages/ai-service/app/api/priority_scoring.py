from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional

from ..config.database import get_database
from ..services.ml_service import MLService
from ..services.geospatial_service import GeospatialService
from ..models.damage_assessment import DamageAssessmentModel
from ..models.priority_scoring import PriorityScoreModel
from ..models.resource_prediction import ResourcePredictionModel

router = APIRouter(prefix="/api/v1/priority")

# Initialize services
ml_service = MLService()
geo_service = GeospatialService()

@router.post("/calculate/{assessment_id}")
async def calculate_priority(
    assessment_id: int,
    population_density: Optional[float] = None,
    weather_risk: Optional[float] = None,
    accessibility_score: Optional[float] = None,
    db: Session = Depends(get_database)
):
    """Calculate priority score for damage assessment"""
    try:
        # Get assessment
        assessment = db.query(DamageAssessmentModel).filter(
            DamageAssessmentModel.id == assessment_id
        ).first()

        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")

        # Prepare context data
        context_data = {
            "population_density": population_density or 0.5,
            "weather_risk": weather_risk or 0.2,
            "accessibility_score": accessibility_score or 0.7
        }

        # Calculate priority score
        priority_result = await ml_service.calculate_priority_score(
            {
                "damage_level": assessment.damage_level,
                "confidence_score": assessment.confidence_score
            },
            context_data
        )

        # Predict resource requirements
        resource_prediction = await ml_service.predict_resource_demand(
            {
                "damage_level": assessment.damage_level,
                "confidence_score": assessment.confidence_score
            },
            priority_result
        )

        # Save priority score
        priority_score = PriorityScoreModel(
            damage_assessment_id=assessment_id,
            priority_level=priority_result["priority_level"],
            priority_score=priority_result["priority_score"],
            urgency_factors=priority_result.get("urgency_factors", []),
            resource_requirements=resource_prediction,
            estimated_response_time=resource_prediction.get("deployment_timeline", 24),
            affected_population=int(context_data["population_density"] * 1000)
        )

        db.add(priority_score)
        db.commit()
        db.refresh(priority_score)

        # Save resource prediction
        resource_pred = ResourcePredictionModel(
            damage_assessment_id=assessment_id,
            priority_score_id=priority_score.id,
            medical_personnel=resource_prediction.get("medical_personnel", 0),
            rescue_teams=resource_prediction.get("rescue_teams", 0),
            emergency_vehicles=resource_prediction.get("emergency_vehicles", 0),
            relief_supplies=resource_prediction.get("relief_supplies", {}),
            equipment_needed=resource_prediction.get("equipment_needed", []),
            deployment_timeline=resource_prediction.get("deployment_timeline", 24),
            cost_estimate=resource_prediction.get("cost_estimate", 0),
            confidence_score=resource_prediction.get("confidence_score", 0.8)
        )

        db.add(resource_pred)
        db.commit()
        db.refresh(resource_pred)

        return {
            "priority_score_id": priority_score.id,
            "priority_level": priority_result["priority_level"],
            "priority_score": priority_result["priority_score"],
            "urgency_factors": priority_result.get("urgency_factors", []),
            "resource_prediction": {
                "medical_personnel": resource_prediction.get("medical_personnel", 0),
                "rescue_teams": resource_prediction.get("rescue_teams", 0),
                "emergency_vehicles": resource_prediction.get("emergency_vehicles", 0),
                "relief_supplies": resource_prediction.get("relief_supplies", {}),
                "equipment_needed": resource_prediction.get("equipment_needed", []),
                "deployment_timeline": resource_prediction.get("deployment_timeline", 24),
                "cost_estimate": resource_prediction.get("cost_estimate", 0)
            },
            "estimated_response_time": resource_prediction.get("deployment_timeline", 24),
            "affected_population": int(context_data["population_density"] * 1000)
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Priority calculation failed: {str(e)}")

@router.get("/scores/{assessment_id}")
async def get_priority_scores(assessment_id: int, db: Session = Depends(get_database)):
    """Get priority scores for assessment"""
    scores = db.query(PriorityScoreModel).filter(
        PriorityScoreModel.damage_assessment_id == assessment_id
    ).all()

    if not scores:
        raise HTTPException(status_code=404, detail="No priority scores found")

    return {
        "assessment_id": assessment_id,
        "scores": [
            {
                "id": score.id,
                "priority_level": score.priority_level,
                "priority_score": score.priority_score,
                "urgency_factors": score.urgency_factors,
                "estimated_response_time": score.estimated_response_time,
                "affected_population": score.affected_population,
                "created_at": score.created_at.isoformat()
            }
            for score in scores
        ]
    }

@router.get("/queue")
async def get_priority_queue(limit: int = 50, db: Session = Depends(get_database)):
    """Get prioritized queue of assessments"""
    # Get assessments with priority scores, ordered by priority
    results = db.query(DamageAssessmentModel, PriorityScoreModel).join(
        PriorityScoreModel
    ).order_by(
        PriorityScoreModel.priority_score.desc()
    ).limit(limit).all()

    queue = []
    for assessment, priority in results:
        queue.append({
            "assessment_id": assessment.id,
            "damage_level": assessment.damage_level,
            "priority_level": priority.priority_level,
            "priority_score": priority.priority_score,
            "estimated_response_time": priority.estimated_response_time,
            "affected_population": priority.affected_population,
            "created_at": assessment.created_at.isoformat(),
            "urgency_factors": priority.urgency_factors
        })

    return {
        "queue": queue,
        "total_items": len(queue)
    }
