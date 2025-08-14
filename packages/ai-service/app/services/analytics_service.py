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
        self.damage_levels = ["Minimal", "Minor", "Moderate", "Severe", "Critical"]
        self.priority_levels = ["Low", "Medium", "High", "Critical"]

    async def generate_dashboard_data(self, days: int = 30) -> Dict:
        """Generate dashboard analytics data"""
        try:
            db: Session = next(get_database())

            # Calculate date range based on current time (01:02 AM +08, August 09, 2025)
            end_date = datetime.now()  # 2025-08-09 01:02:00+08:00
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
            logger.error(f"Error generating dashboard data: {str(e)}")
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
                          if assessment.processing_time is not None and isinstance(assessment.processing_time, (int, float))]

        if not processing_times:
            return {"average": 0, "min": 0, "max": 0, "median": 0, "std": 0}

        return {
            "average": float(np.mean(processing_times)),
            "min": float(np.min(processing_times)),
            "max": float(np.max(processing_times)),
            "median": float(np.median(processing_times)),
            "std": float(np.std(processing_times))
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
                return {"total_medical_personnel": 0, "total_rescue_teams": 0, "total_vehicles": 0, "total_cost_estimate": 0, "average_deployment_time": 0}

            total_medical = sum(rp.medical_personnel for rp in resource_predictions if rp.medical_personnel is not None)
            total_rescue = sum(rp.rescue_teams for rp in resource_predictions if rp.rescue_teams is not None)
            total_vehicles = sum(rp.emergency_vehicles for rp in resource_predictions if rp.emergency_vehicles is not None)
            total_cost = sum(float(rp.cost_estimate or 0) for rp in resource_predictions)
            deployment_times = [rp.deployment_timeline for rp in resource_predictions if rp.deployment_timeline is not None]

            avg_deployment_time = float(np.mean(deployment_times)) if deployment_times else 0

            return {
                "total_medical_personnel": int(total_medical),
                "total_rescue_teams": int(total_rescue),
                "total_vehicles": int(total_vehicles),
                "total_cost_estimate": float(total_cost),
                "average_deployment_time": avg_deployment_time
            }

        except Exception as e:
            logger.error(f"Error calculating resource utilization: {str(e)}")
            return {"total_medical_personnel": 0, "total_rescue_teams": 0, "total_vehicles": 0, "total_cost_estimate": 0, "average_deployment_time": 0}

    def _calculate_geographic_distribution(self, assessments: List[DamageAssessmentModel]) -> Dict:
        """Calculate geographic distribution of incidents"""
        locations = {}
        for assessment in assessments:
            if assessment.location_data and "city" in assessment.location_data:
                location = assessment.location_data["city"]
                locations[location] = locations.get(location, 0) + 1

        sorted_locations = sorted(locations.items(), key=lambda x: x[1], reverse=True)
        top_areas = [loc[0] for loc in sorted_locations[:5]] if sorted_locations else []

        return {
            "distribution": dict(sorted_locations),
            "top_areas": top_areas,
            "total_locations": len(locations)
        }

    async def _calculate_trends(self, db: Session, start_date: datetime, end_date: datetime) -> Dict:
        """Calculate trends over time"""
        try:
            assessments = db.query(DamageAssessmentModel).filter(
                DamageAssessmentModel.created_at >= start_date,
                DamageAssessmentModel.created_at <= end_date
            ).all()

            daily_counts = {}
            daily_severity = {level: {} for level in self.damage_levels}

            for assessment in assessments:
                date_key = assessment.created_at.date().isoformat()
                daily_counts[date_key] = daily_counts.get(date_key, 0) + 1
                if date_key not in daily_severity[assessment.damage_level]:
                    daily_severity[assessment.damage_level][date_key] = 0
                daily_severity[assessment.damage_level][date_key] += 1

            return {
                "daily_counts": daily_counts,
                "daily_severity": daily_severity,
                "trend_direction": self._calculate_trend_direction(daily_counts)
            }

        except Exception as e:
            logger.error(f"Error calculating trends: {str(e)}")
            return {"daily_counts": {}, "daily_severity": {}, "trend_direction": "stable"}

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
        return "stable"

    def _get_default_dashboard_data(self) -> Dict:
        """Get default dashboard data when no data is available"""
        return {
            "summary": {
                "total_assessments": 0,
                "date_range": {
                    "start": (datetime.now() - timedelta(days=30)).isoformat(),
                    "end": datetime.now().isoformat()
                },
                "average_processing_time": 0,
                "most_affected_areas": []
            },
            "damage_distribution": {
                "counts": {level: 0 for level in self.damage_levels},
                "percentages": {level: 0 for level in self.damage_levels},
                "total": 0
            },
            "response_metrics": {"average": 0, "min": 0, "max": 0, "median": 0, "std": 0},
            "resource_utilization": {"total_medical_personnel": 0, "total_rescue_teams": 0, "total_vehicles": 0, "total_cost_estimate": 0, "average_deployment_time": 0},
            "geographic_data": {"distribution": {}, "top_areas": [], "total_locations": 0},
            "trends": {"daily_counts": {}, "daily_severity": {level: {} for level in self.damage_levels}, "trend_direction": "stable"}
        }

    async def generate_performance_report(self, days: int = 30) -> Dict:
        """Generate performance analysis report"""
        try:
            db: Session = next(get_database())

            end_date = datetime.now()
            start_date = end_date - timedelta(days=days)

            assessments = db.query(DamageAssessmentModel).filter(
                DamageAssessmentModel.created_at >= start_date,
                DamageAssessmentModel.created_at <= end_date
            ).all()

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
            logger.error(f"Error generating performance report: {str(e)}")
            return {"error": str(e)}
        finally:
            db.close()

    def _calculate_accuracy_metrics(self, assessments: List[DamageAssessmentModel]) -> Dict:
        """Calculate accuracy metrics"""
        if not assessments:
            return {"average_confidence": 0.0, "high_confidence_rate": 0.0, "confidence_distribution": {"low": 0, "medium": 0, "high": 0}}

        confidences = [assessment.confidence_score for assessment in assessments
                      if assessment.confidence_score is not None and 0 <= assessment.confidence_score <= 1]

        if not confidences:
            return {"average_confidence": 0.0, "high_confidence_rate": 0.0, "confidence_distribution": {"low": 0, "medium": 0, "high": 0}}

        avg_confidence = float(np.mean(confidences))
        high_confidence_rate = (len([c for c in confidences if c > 0.8]) / len(confidences) * 100) if confidences else 0.0

        return {
            "average_confidence": avg_confidence,
            "high_confidence_rate": float(high_confidence_rate),
            "confidence_distribution": {
                "low": len([c for c in confidences if c < 0.6]),
                "medium": len([c for c in confidences if 0.6 <= c <= 0.8]),
                "high": len([c for c in confidences if c > 0.8])
            }
        }

    def _calculate_efficiency_metrics(self, assessments: List[DamageAssessmentModel]) -> Dict:
        """Calculate efficiency metrics"""
        if not assessments:
            return {"average_processing_time": 0.0, "throughput_per_day": 0.0, "processing_time_trend": "stable"}

        processing_times = [assessment.processing_time for assessment in assessments
                          if assessment.processing_time is not None and isinstance(assessment.processing_time, (int, float))]

        if not processing_times:
            return {"average_processing_time": 0.0, "throughput_per_day": 0.0, "processing_time_trend": "stable"}

        avg_time = float(np.mean(processing_times))
        unique_days = len(set(assessment.created_at.date() for assessment in assessments))
        throughput = len(assessments) / unique_days if unique_days > 0 else 0.0
        trend = self._calculate_processing_time_trend(processing_times)

        return {
            "average_processing_time": avg_time,
            "throughput_per_day": float(throughput),
            "processing_time_trend": trend
        }

    def _calculate_processing_time_trend(self, processing_times: List[float]) -> str:
        """Calculate trend in processing times"""
        if len(processing_times) < 2:
            return "stable"

        sorted_times = sorted(processing_times)
        recent_avg = np.mean(sorted_times[-5:]) if len(sorted_times) >= 5 else np.mean(sorted_times[-2:])
        older_avg = np.mean(sorted_times[:-5]) if len(sorted_times) >= 10 else np.mean(sorted_times[:-2])

        if recent_avg > older_avg * 1.1:
            return "increasing"
        elif recent_avg < older_avg * 0.9:
            return "decreasing"
        return "stable"

    def _calculate_quality_metrics(self, assessments: List[DamageAssessmentModel]) -> Dict:
        """Calculate quality metrics"""
        try:
            if not assessments:
                return {"completeness_rate": 0.0, "consistency_score": 0.0, "reliability_index": 0.0}

            complete_assessments = sum(1 for a in assessments if all(getattr(a, field) is not None 
                                                                   for field in ["damage_level", "confidence_score", "processing_time"]))
            completeness_rate = (complete_assessments / len(assessments) * 100) if assessments else 0.0

            # Simplified consistency score based on damage level variance
            severity_scores = [a.severity_score for a in assessments if a.severity_score is not None]
            consistency_score = 100 - (np.std(severity_scores) * 10) if severity_scores else 85.0
            consistency_score = max(0.0, min(100.0, consistency_score))

            reliability_index = (completeness_rate + consistency_score) / 2

            return {
                "completeness_rate": float(completeness_rate),
                "consistency_score": float(consistency_score),
                "reliability_index": float(reliability_index)
            }
        except Exception as e:
            logger.error(f"Error calculating quality metrics: {str(e)}")
            return {"completeness_rate": 0.0, "consistency_score": 0.0, "reliability_index": 0.0}

    def _generate_recommendations(self, accuracy: Dict, efficiency: Dict) -> List[str]:
        """Generate recommendations based on performance metrics"""
        recommendations = []

        if accuracy.get("average_confidence", 0.0) < 0.7:
            recommendations.append("Consider model retraining to improve confidence scores")

        if efficiency.get("average_processing_time", 0.0) > 10:
            recommendations.append("Optimize image processing pipeline to reduce processing time")

        if accuracy.get("high_confidence_rate", 0.0) < 60:
            recommendations.append("Review cases with low confidence for model improvement")

        if efficiency.get("throughput_per_day", 0.0) < 5:
            recommendations.append("Increase assessment throughput with additional resources")

        return recommendations