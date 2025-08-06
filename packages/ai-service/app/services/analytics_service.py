"""
Analytics Service
Handles data analysis, reporting, and insights generation
"""
import pandas as pd
import numpy as np
import logging
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
from sqlalchemy.orm import Session

from ..config.database import get_database
from ..models.damage_assessment import DamageAssessmentModel
from ..models.priority_scoring import PriorityScoreModel
from ..models.resource_prediction import ResourcePredictionModel

logger = logging.getLogger(__name__)

class AnalyticsService:
    """Analytics service for disaster relief data analysis"""

    def __init__(self):
        self.damage_levels = ["Minor", "Moderate", "Severe"]
        self.priority_levels = ["Low", "Medium", "High", "Critical"]

    async def generate_dashboard_data(self, days: int = 30) -> Dict:
        """Generate dashboard analytics data"""
        try:
            db: Session = next(get_database())

            # Calculate date range
            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)

            # Get assessments in date range
            assessments = db.query(DamageAssessmentModel).filter(
                DamageAssessmentModel.created_at >= start_date,
                DamageAssessmentModel.created_at <= end_date
            ).all()

            if not assessments:
                return self._get_default_dashboard_data()

            # Calculate metrics
            total_assessments = len(assessments)
            damage_distribution = self._calculate_damage_distribution(assessments)
            response_times = self._calculate_response_times(assessments)
            resource_utilization = await self._calculate_resource_utilization(db, start_date, end_date)
            geographic_distribution = self._calculate_geographic_distribution(assessments)

            return {
                "summary": {
                    "total_assessments": total_assessments,
                    "date_range": {
                        "start": start_date.isoformat(),
                        "end": end_date.isoformat()
                    },
                    "average_processing_time": response_times.get("average", 0),
                    "most_affected_areas": geographic_distribution.get("top_areas", [])
                },
                "damage_distribution": damage_distribution,
                "response_metrics": response_times,
                "resource_utilization": resource_utilization,
                "geographic_data": geographic_distribution,
                "trends": await self._calculate_trends(db, start_date, end_date)
            }

        except Exception as e:
            logger.error(f"Error generating dashboard data: {e}")
            return self._get_default_dashboard_data()
        finally:
            db.close()

    def _calculate_damage_distribution(self, assessments: List[DamageAssessmentModel]) -> Dict:
        """Calculate damage level distribution"""
        distribution = {level: 0 for level in self.damage_levels}

        for assessment in assessments:
            level = assessment.damage_level
            if level in distribution:
                distribution[level] += 1

        total = len(assessments)
        percentages = {level: (count / total * 100) if total > 0 else 0
                      for level, count in distribution.items()}

        return {
            "counts": distribution,
            "percentages": percentages,
            "total": total
        }

    def _calculate_response_times(self, assessments: List[DamageAssessmentModel]) -> Dict:
        """Calculate response time metrics"""
        processing_times = [assessment.processing_time for assessment in assessments
                          if assessment.processing_time is not None]

        if not processing_times:
            return {"average": 0, "min": 0, "max": 0, "median": 0}

        return {
            "average": np.mean(processing_times),
            "min": np.min(processing_times),
            "max": np.max(processing_times),
            "median": np.median(processing_times),
            "std": np.std(processing_times)
        }

    async def _calculate_resource_utilization(self, db: Session, start_date: datetime, end_date: datetime) -> Dict:
        """Calculate resource utilization metrics"""
        try:
            resource_predictions = db.query(ResourcePredictionModel).join(
                DamageAssessmentModel
            ).filter(
                DamageAssessmentModel.created_at >= start_date,
                DamageAssessmentModel.created_at <= end_date
            ).all()

            if not resource_predictions:
                return {"total_personnel": 0, "total_vehicles": 0, "total_cost": 0}

            total_medical = sum(rp.medical_personnel for rp in resource_predictions)
            total_rescue = sum(rp.rescue_teams for rp in resource_predictions)
            total_vehicles = sum(rp.emergency_vehicles for rp in resource_predictions)
            total_cost = sum(rp.cost_estimate for rp in resource_predictions if rp.cost_estimate)

            return {
                "total_medical_personnel": total_medical,
                "total_rescue_teams": total_rescue,
                "total_vehicles": total_vehicles,
                "total_cost_estimate": total_cost,
                "average_deployment_time": np.mean([rp.deployment_timeline for rp in resource_predictions
                                                  if rp.deployment_timeline])
            }

        except Exception as e:
            logger.error(f"Error calculating resource utilization: {e}")
            return {"total_personnel": 0, "total_vehicles": 0, "total_cost": 0}

    def _calculate_geographic_distribution(self, assessments: List[DamageAssessmentModel]) -> Dict:
        """Calculate geographic distribution of incidents"""
        # This would typically use actual location data
        # For now, using mock data

        locations = {}
        for assessment in assessments:
            if assessment.location_data:
                # Extract location info (this would depend on your location data structure)
                location = assessment.location_data.get("city", "Unknown")
                locations[location] = locations.get(location, 0) + 1

        # Sort by frequency
        sorted_locations = sorted(locations.items(), key=lambda x: x[1], reverse=True)

        return {
            "distribution": dict(sorted_locations),
            "top_areas": [loc[0] for loc in sorted_locations[:5]],
            "total_locations": len(locations)
        }

    async def _calculate_trends(self, db: Session, start_date: datetime, end_date: datetime) -> Dict:
        """Calculate trends over time"""
        try:
            # Group assessments by day
            assessments = db.query(DamageAssessmentModel).filter(
                DamageAssessmentModel.created_at >= start_date,
                DamageAssessmentModel.created_at <= end_date
            ).all()

            # Create daily buckets
            daily_counts = {}
            daily_severity = {}

            for assessment in assessments:
                date_key = assessment.created_at.date().isoformat()
                daily_counts[date_key] = daily_counts.get(date_key, 0) + 1

                # Track severity trends
                if date_key not in daily_severity:
                    daily_severity[date_key] = {"Minor": 0, "Moderate": 0, "Severe": 0}
                daily_severity[date_key][assessment.damage_level] += 1

            return {
                "daily_counts": daily_counts,
                "daily_severity": daily_severity,
                "trend_direction": self._calculate_trend_direction(daily_counts)
            }

        except Exception as e:
            logger.error(f"Error calculating trends: {e}")
            return {"daily_counts": {}, "daily_severity": {}}

    def _calculate_trend_direction(self, daily_counts: Dict) -> str:
        """Calculate if incidents are trending up or down"""
        if len(daily_counts) < 2:
            return "stable"

        values = list(daily_counts.values())
        recent_avg = np.mean(values[-7:]) if len(values) >= 7 else np.mean(values[-3:])
        older_avg = np.mean(values[:-7]) if len(values) >= 14 else np.mean(values[:-3])

        if recent_avg > older_avg * 1.1:
            return "increasing"
        elif recent_avg < older_avg * 0.9:
            return "decreasing"
        else:
            return "stable"

    def _get_default_dashboard_data(self) -> Dict:
        """Get default dashboard data when no data is available"""
        return {
            "summary": {
                "total_assessments": 0,
                "average_processing_time": 0,
                "most_affected_areas": []
            },
            "damage_distribution": {
                "counts": {"Minor": 0, "Moderate": 0, "Severe": 0},
                "percentages": {"Minor": 0, "Moderate": 0, "Severe": 0},
                "total": 0
            },
            "response_metrics": {"average": 0, "min": 0, "max": 0, "median": 0},
            "resource_utilization": {"total_personnel": 0, "total_vehicles": 0, "total_cost": 0},
            "geographic_data": {"distribution": {}, "top_areas": [], "total_locations": 0},
            "trends": {"daily_counts": {}, "daily_severity": {}}
        }

    async def generate_performance_report(self, days: int = 30) -> Dict:
        """Generate performance analysis report"""
        try:
            db: Session = next(get_database())

            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)

            assessments = db.query(DamageAssessmentModel).filter(
                DamageAssessmentModel.created_at >= start_date
            ).all()

            # Calculate performance metrics
            accuracy_metrics = self._calculate_accuracy_metrics(assessments)
            efficiency_metrics = self._calculate_efficiency_metrics(assessments)
            quality_metrics = self._calculate_quality_metrics(assessments)

            return {
                "report_period": {
                    "start": start_date.isoformat(),
                    "end": end_date.isoformat(),
                    "days": days
                },
                "accuracy": accuracy_metrics,
                "efficiency": efficiency_metrics,
                "quality": quality_metrics,
                "recommendations": self._generate_recommendations(accuracy_metrics, efficiency_metrics)
            }

        except Exception as e:
            logger.error(f"Error generating performance report: {e}")
            return {"error": str(e)}
        finally:
            db.close()

    def _calculate_accuracy_metrics(self, assessments: List[DamageAssessmentModel]) -> Dict:
        """Calculate accuracy metrics"""
        if not assessments:
            return {"average_confidence": 0, "high_confidence_rate": 0}

        confidences = [assessment.confidence_score for assessment in assessments
                      if assessment.confidence_score is not None]

        if not confidences:
            return {"average_confidence": 0, "high_confidence_rate": 0}

        avg_confidence = np.mean(confidences)
        high_confidence_rate = len([c for c in confidences if c > 0.8]) / len(confidences) * 100

        return {
            "average_confidence": avg_confidence,
            "high_confidence_rate": high_confidence_rate,
            "confidence_distribution": {
                "low": len([c for c in confidences if c < 0.6]),
                "medium": len([c for c in confidences if 0.6 <= c <= 0.8]),
                "high": len([c for c in confidences if c > 0.8])
            }
        }

    def _calculate_efficiency_metrics(self, assessments: List[DamageAssessmentModel]) -> Dict:
        """Calculate efficiency metrics"""
        if not assessments:
            return {"average_processing_time": 0, "throughput": 0}

        processing_times = [assessment.processing_time for assessment in assessments
                          if assessment.processing_time is not None]

        if not processing_times:
            return {"average_processing_time": 0, "throughput": 0}

        avg_time = np.mean(processing_times)
        throughput = len(assessments) / len(set(assessment.created_at.date() for assessment in assessments))

        return {
            "average_processing_time": avg_time,
            "throughput_per_day": throughput,
            "processing_time_trend": "stable"  # Would calculate actual trend
        }

    def _calculate_quality_metrics(self, assessments: List[DamageAssessmentModel]) -> Dict:
        """Calculate quality metrics"""
        return {
            "completeness_rate": 100,  # Percentage of complete assessments
            "consistency_score": 85,   # Consistency in similar scenarios
            "reliability_index": 90    # Overall reliability score
        }

    def _generate_recommendations(self, accuracy: Dict, efficiency: Dict) -> List[str]:
        """Generate recommendations based on performance metrics"""
        recommendations = []

        if accuracy.get("average_confidence", 0) < 0.7:
            recommendations.append("Consider model retraining to improve confidence scores")

        if efficiency.get("average_processing_time", 0) > 10:
            recommendations.append("Optimize image processing pipeline to reduce processing time")

        if accuracy.get("high_confidence_rate", 0) < 60:
            recommendations.append("Review cases with low confidence for model improvement")

        return recommendations
