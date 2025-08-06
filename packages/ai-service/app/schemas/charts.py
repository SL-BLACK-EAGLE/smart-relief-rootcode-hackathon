"""
Charts Schemas
Pydantic models for chart data responses
"""
from pydantic import BaseModel, Field
from typing import Dict, List, Any, Optional

class ChartData(BaseModel):
    """Schema for chart data"""
    type: str = Field(..., description="Chart type (pie, bar, line, etc.)")
    data: Dict[str, Any] = Field(..., description="Chart data including labels and datasets")
    options: Optional[Dict[str, Any]] = Field(None, description="Chart configuration options")

class ChartDataset(BaseModel):
    """Schema for chart dataset"""
    label: Optional[str] = Field(None, description="Dataset label")
    data: List[Any] = Field(..., description="Dataset values")
    backgroundColor: Optional[List[str]] = Field(None, description="Background colors")
    borderColor: Optional[str] = Field(None, description="Border color")
    borderWidth: Optional[int] = Field(None, description="Border width")

class TrendData(BaseModel):
    """Schema for trend analysis data"""
    metric: str = Field(..., description="Metric name")
    period_days: int = Field(..., description="Analysis period in days")
    trend_data: List[Dict[str, Any]] = Field(..., description="Trend data points")
    trend_direction: str = Field(..., description="Trend direction (increasing, decreasing, stable)")
