"""
Analytics Schemas
Pydantic models for analytics API responses
"""
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional
from datetime import datetime

class AnalyticsSummary(BaseModel):
    """Schema for analytics summary"""
    total_assessments: int = Field(..., description="Total number of assessments")
    today_assessments: int = Field(..., description="Assessments processed today")
    high_priority_count: int = Field(..., description="Number of high priority cases")
    average_response_time: float = Field(..., description="Average response time in seconds")
    system_performance: str = Field(..., description="Overall system performance status")

class DashboardData(BaseModel):
    """Schema for dashboard data"""
    summary: Dict[str, Any] = Field(..., description="Summary statistics")
    damage_distribution: Dict[str, Any] = Field(..., description="Damage level distribution")
    response_metrics: Dict[str, Any] = Field(..., description="Response time metrics")
    resource_utilization: Dict[str, Any] = Field(..., description="Resource utilization data")
    geographic_data: Dict[str, Any] = Field(..., description="Geographic distribution")
    trends: Dict[str, Any] = Field(..., description="Trend analysis")

class PerformanceReport(BaseModel):
    """Schema for performance report"""
    report_period: Dict[str, str] = Field(..., description="Report time period")
    accuracy: Dict[str, Any] = Field(..., description="Accuracy metrics")
    efficiency: Dict[str, Any] = Field(..., description="Efficiency metrics")
    quality: Dict[str, Any] = Field(..., description="Quality metrics")
    recommendations: List[str] = Field(..., description="Improvement recommendations")
