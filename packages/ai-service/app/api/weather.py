"""
Weather API endpoints for disaster prediction and DMC report integration
"""
from fastapi import APIRouter, HTTPException, Query
from typing import Dict, Any, Optional
from ..services.weather_service import WeatherService
# from ..schemas.analytics import WeatherResponse, DisasterPredictionResponse
import logging

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/weather", tags=["Weather & Disaster Prediction"])

# Initialize weather service
weather_service = WeatherService()

@router.get("/current/{city}", response_model=Dict[str, Any])
async def get_current_weather(
    city: str,
    include_disaster_risk: bool = Query(True, description="Include disaster risk assessment")
):
    """
    Get current weather data for a city with disaster risk assessment

    Features:
    - Real-time weather data from OpenWeatherMap
    - Automatic disaster risk assessment
    - Natural disaster probability scoring
    """
    try:
        weather_data = await weather_service.get_weather_by_city(city)

        return {
            "success": True,
            "message": f"Weather data retrieved for {city}",
            "data": weather_data
        }

    except Exception as e:
        logger.error(f"Weather data fetch failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch weather data: {str(e)}")

@router.get("/forecast/{city}", response_model=Dict[str, Any])
async def get_weather_forecast(
    city: str,
    days: int = Query(5, ge=1, le=5, description="Number of forecast days (1-5)")
):
    """
    Get weather forecast with disaster predictions

    Features:
    - 5-day weather forecast
    - Disaster probability predictions
    - Weather pattern analysis
    """
    try:
        forecast_data = await weather_service.get_weather_forecast(city, days)

        return {
            "success": True,
            "message": f"{days}-day forecast retrieved for {city}",
            "data": forecast_data
        }

    except Exception as e:
        logger.error(f"Weather forecast fetch failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch weather forecast: {str(e)}")

@router.get("/disaster-risk/{city}", response_model=Dict[str, Any])
async def assess_disaster_risk(city: str):
    """
    Assess natural disaster risk for a specific city

    Analyzes:
    - Current weather conditions
    - Historical patterns
    - Risk factors and probability
    """
    try:
        weather_data = await weather_service.get_weather_by_city(city)

        return {
            "success": True,
            "message": f"Disaster risk assessment for {city}",
            "data": {
                "city": weather_data["city"],
                "country": weather_data["country"],
                "assessment_time": weather_data["timestamp"],
                "disaster_risk": weather_data["disaster_risk"],
                "current_conditions": {
                    "temperature": weather_data["temperature"],
                    "humidity": weather_data["humidity"],
                    "wind_speed": weather_data["wind_speed"],
                    "pressure": weather_data["pressure"],
                    "weather": weather_data["weather_description"]
                }
            }
        }

    except Exception as e:
        logger.error(f"Disaster risk assessment failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to assess disaster risk: {str(e)}")

@router.get("/dmc-reports/latest", response_model=Dict[str, Any])
async def get_latest_dmc_report():
    """
    Download and analyze the latest DMC (Disaster Management Centre) weather report

    Features:
    - Automatic PDF download from DMC website
    - Text extraction and analysis
    - Disaster indicator detection
    - Weather pattern recognition
    """
    try:
        report_data = await weather_service.get_latest_dmc_report()

        return {
            "success": report_data["success"],
            "message": report_data["message"],
            "data": report_data["data"]
        }

    except Exception as e:
        logger.error(f"DMC report processing failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to process DMC report: {str(e)}")

@router.get("/dmc-reports/links", response_model=Dict[str, Any])
async def get_dmc_report_links():
    """
    Get available DMC weather report PDF links
    """
    try:
        links = weather_service.find_pdf_links()

        return {
            "success": True,
            "message": f"Found {len(links)} DMC report links",
            "data": {
                "total_reports": len(links),
                "reports": [
                    {
                        "title": title,
                        "url": url,
                        "filename": weather_service.sanitize_filename(title)
                    }
                    for title, url in links
                ]
            }
        }

    except Exception as e:
        logger.error(f"DMC links fetch failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch DMC report links: {str(e)}")

@router.post("/predict-disaster", response_model=Dict[str, Any])
async def predict_natural_disaster(
    city: str,
    analysis_days: int = Query(3, ge=1, le=7, description="Days to analyze for prediction")
):
    """
    Comprehensive natural disaster prediction system

    Combines:
    - Current weather data
    - Weather forecast analysis
    - DMC report indicators
    - Historical pattern matching
    """
    try:
        # Get current weather and forecast
        current_weather = await weather_service.get_weather_by_city(city)
        forecast = await weather_service.get_weather_forecast(city, analysis_days)

        # Get latest DMC report for additional context
        dmc_report = await weather_service.get_latest_dmc_report()

        # Combine all data for comprehensive prediction
        prediction_result = {
            "city": city,
            "analysis_period": f"{analysis_days} days",
            "prediction_time": current_weather["timestamp"],
            "current_conditions": {
                "temperature": current_weather["temperature"],
                "humidity": current_weather["humidity"],
                "wind_speed": current_weather["wind_speed"],
                "weather": current_weather["weather_description"],
                "disaster_risk": current_weather["disaster_risk"]
            },
            "forecast_analysis": forecast["disaster_predictions"],
            "dmc_indicators": dmc_report["data"]["disaster_indicators"] if dmc_report["success"] else {},
            "overall_assessment": _generate_overall_assessment(
                current_weather["disaster_risk"],
                forecast["disaster_predictions"],
                dmc_report["data"]["disaster_indicators"] if dmc_report["success"] else {}
            )
        }

        return {
            "success": True,
            "message": f"Natural disaster prediction completed for {city}",
            "data": prediction_result
        }

    except Exception as e:
        logger.error(f"Disaster prediction failed: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to predict natural disasters: {str(e)}")

def _generate_overall_assessment(current_risk: Dict, forecast_predictions: Dict, dmc_indicators: Dict) -> Dict[str, Any]:
    """Generate comprehensive disaster assessment"""

    # Calculate overall risk score
    risk_score = 0
    risk_factors = []

    # Current conditions risk
    current_risk_level = current_risk.get("risk_level", "Low")
    if current_risk_level == "Critical":
        risk_score += 40
    elif current_risk_level == "High":
        risk_score += 30
    elif current_risk_level == "Medium":
        risk_score += 15

    risk_factors.extend(current_risk.get("risk_factors", []))

    # Forecast predictions risk
    forecast_risk = forecast_predictions.get("overall_risk", "Low")
    if forecast_risk == "High":
        risk_score += 30
    elif forecast_risk == "Medium":
        risk_score += 15

    predictions = forecast_predictions.get("predictions", [])
    risk_factors.extend([p["description"] for p in predictions])

    # DMC indicators risk
    if dmc_indicators:
        if dmc_indicators.get("flood_risk"):
            risk_score += 20
            risk_factors.append("DMC flood indicators detected")
        if dmc_indicators.get("storm_risk"):
            risk_score += 25
            risk_factors.append("DMC storm indicators detected")
        if dmc_indicators.get("drought_risk"):
            risk_score += 15
            risk_factors.append("DMC drought indicators detected")
        if dmc_indicators.get("heat_wave_risk"):
            risk_score += 20
            risk_factors.append("DMC heat wave indicators detected")

    # Determine overall risk level
    if risk_score >= 70:
        overall_risk = "Critical"
        action_required = "Immediate evacuation and emergency response preparation"
    elif risk_score >= 50:
        overall_risk = "High"
        action_required = "Enhanced monitoring and preparation for potential evacuation"
    elif risk_score >= 25:
        overall_risk = "Medium"
        action_required = "Continued monitoring and basic preparedness measures"
    else:
        overall_risk = "Low"
        action_required = "Normal monitoring, no immediate action required"

    return {
        "overall_risk_level": overall_risk,
        "risk_score": risk_score,
        "confidence": min(95, max(60, 100 - (risk_score * 0.5))),  # Confidence decreases with higher risk
        "action_required": action_required,
        "risk_factors": list(set(risk_factors)),  # Remove duplicates
        "monitoring_recommendations": [
            "Continue weather monitoring",
            "Stay informed through official channels",
            "Prepare emergency supplies",
            "Review evacuation plans if applicable"
        ]
    }
