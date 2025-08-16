"""
Charts API
Handles chart data generation for visualization components
"""
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import Optional, Dict, List
from datetime import datetime, timedelta

from ..config.database import get_database
from ..models.damage_assessment import DamageAssessmentModel
from ..models.priority_scoring import PriorityScoreModel

router = APIRouter(prefix="/api/v1/charts")

@router.get("/damage-distribution")
async def get_damage_distribution_chart(days: int = 30, db: Session = Depends(get_database)):
    """Get damage level distribution chart data"""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        assessments = db.query(DamageAssessmentModel).filter(
            DamageAssessmentModel.created_at >= start_date
        ).all()

        damage_counts = {"Minor": 0, "Moderate": 0, "Severe": 0}
        for assessment in assessments:
            if assessment.damage_level in damage_counts:
                damage_counts[assessment.damage_level] += 1

        chart_data = {
            "type": "pie",
            "data": {
                "labels": list(damage_counts.keys()),
                "datasets": [{
                    "data": list(damage_counts.values()),
                    "backgroundColor": ["#10B981", "#F59E0B", "#EF4444"],
                    "borderWidth": 2
                }]
            },
            "options": {
                "responsive": True,
                "plugins": {
                    "title": {
                        "display": True,
                        "text": f"Damage Distribution (Last {days} days)"
                    }
                }
            }
        }

        return chart_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate chart: {str(e)}")

@router.get("/response-time-trend")
async def get_response_time_trend(days: int = 30, db: Session = Depends(get_database)):
    """Get response time trend chart data"""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        assessments = db.query(DamageAssessmentModel).filter(
            DamageAssessmentModel.created_at >= start_date
        ).all()

        # Group by day
        daily_times = {}
        for assessment in assessments:
            date_key = assessment.created_at.date()
            if date_key not in daily_times:
                daily_times[date_key] = []
            if assessment.processing_time:
                daily_times[date_key].append(assessment.processing_time)

        # Calculate averages
        labels = []
        data = []
        for date in sorted(daily_times.keys()):
            labels.append(date.strftime("%Y-%m-%d"))
            avg_time = sum(daily_times[date]) / len(daily_times[date]) if daily_times[date] else 0
            data.append(round(avg_time, 2))

        chart_data = {
            "type": "line",
            "data": {
                "labels": labels,
                "datasets": [{
                    "label": "Average Response Time (seconds)",
                    "data": data,
                    "borderColor": "#3B82F6",
                    "backgroundColor": "rgba(59, 130, 246, 0.1)",
                    "tension": 0.4
                }]
            },
            "options": {
                "responsive": True,
                "plugins": {
                    "title": {
                        "display": True,
                        "text": "Response Time Trend"
                    }
                },
                "scales": {
                    "y": {
                        "beginAtZero": True,
                        "title": {
                            "display": True,
                            "text": "Time (seconds)"
                        }
                    }
                }
            }
        }

        return chart_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate chart: {str(e)}")

@router.get("/priority-breakdown")
async def get_priority_breakdown_chart(days: int = 30, db: Session = Depends(get_database)):
    """Get priority level breakdown chart data"""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)

        priority_scores = db.query(PriorityScoreModel).join(DamageAssessmentModel).filter(
            DamageAssessmentModel.created_at >= start_date
        ).all()

        priority_counts = {"Low": 0, "Medium": 0, "High": 0, "Critical": 0}
        for score in priority_scores:
            if score.priority_level in priority_counts:
                priority_counts[score.priority_level] += 1

        chart_data = {
            "type": "bar",
            "data": {
                "labels": list(priority_counts.keys()),
                "datasets": [{
                    "label": "Number of Cases",
                    "data": list(priority_counts.values()),
                    "backgroundColor": ["#10B981", "#F59E0B", "#F97316", "#EF4444"],
                    "borderWidth": 1
                }]
            },
            "options": {
                "responsive": True,
                "plugins": {
                    "title": {
                        "display": True,
                        "text": f"Priority Level Distribution (Last {days} days)"
                    }
                },
                "scales": {
                    "y": {
                        "beginAtZero": True,
                        "title": {
                            "display": True,
                            "text": "Number of Cases"
                        }
                    }
                }
            }
        }

        return chart_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate chart: {str(e)}")

@router.get("/resource-allocation")
async def get_resource_allocation_chart(days: int = 30):
    """Get resource allocation chart data"""
    try:
        # Mock data for resource allocation
        chart_data = {
            "type": "doughnut",
            "data": {
                "labels": ["Medical Personnel", "Rescue Teams", "Emergency Vehicles", "Equipment"],
                "datasets": [{
                    "data": [35, 25, 20, 20],
                    "backgroundColor": ["#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"],
                    "borderWidth": 2
                }]
            },
            "options": {
                "responsive": True,
                "plugins": {
                    "title": {
                        "display": True,
                        "text": "Resource Allocation"
                    }
                }
            }
        }

        return chart_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate chart: {str(e)}")
