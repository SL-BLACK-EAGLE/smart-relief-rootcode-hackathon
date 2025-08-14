#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Weather Service for AI Disaster Relief System

Integrates multiple weather data sources:
1. OpenWeatherMap API for real-time weather
2. DMC (Disaster Management Centre) PDF reports scraper
3. Weather-based disaster prediction

Features:
- Real-time weather data fetching
- PDF report downloading and text extraction
- Natural disaster risk assessment
- Weather pattern analysis
"""

import re
import os
import sys
import io
import logging
import asyncio
from datetime import datetime, timedelta
from urllib.parse import urljoin
from typing import Dict, List, Optional, Any
import requests
from bs4 import BeautifulSoup
from pypdf import PdfReader
import httpx
from ..config.settings import get_settings

logger = logging.getLogger(__name__)
settings = get_settings()

# DMC Weather Reports URL
DMC_WEATHER_URL = "https://www.dmc.gov.lk/index.php?option=com_dmcreports&view=reports&Itemid=274&report_type_id=2&lang=en"

class WeatherService:
    """Enhanced weather service with disaster prediction capabilities"""

    def __init__(self):
        self.openweather_api_key = settings.openweather_api_key
        self.base_url = "https://api.openweathermap.org/data/2.5"
        self.reports_dir = "weather_reports"
        os.makedirs(self.reports_dir, exist_ok=True)

    async def get_weather_by_city(self, city: str) -> Dict[str, Any]:
        """Get current weather data for a city"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/weather"
                params = {
                    "q": city,
                    "appid": self.openweather_api_key,
                    "units": "metric"
                }

                response = await client.get(url, params=params)
                response.raise_for_status()

                weather_data = response.json()

                # Extract key weather information
                result = {
                    "city": weather_data["name"],
                    "country": weather_data["sys"]["country"],
                    "temperature": weather_data["main"]["temp"],
                    "feels_like": weather_data["main"]["feels_like"],
                    "humidity": weather_data["main"]["humidity"],
                    "pressure": weather_data["main"]["pressure"],
                    "visibility": weather_data.get("visibility", 0) / 1000,  # Convert to km
                    "wind_speed": weather_data["wind"]["speed"],
                    "wind_direction": weather_data["wind"].get("deg", 0),
                    "weather_main": weather_data["weather"][0]["main"],
                    "weather_description": weather_data["weather"][0]["description"],
                    "clouds": weather_data["clouds"]["all"],
                    "timestamp": datetime.now().isoformat(),
                    "weather_data": weather_data  # Include full data for analysis
                }

                # Add disaster risk assessment
                result["disaster_risk"] = await self._assess_disaster_risk(result)

                return result

        except Exception as e:
            logger.error(f"Weather data fetch failed for {city}: {e}")
            raise

    async def get_weather_forecast(self, city: str, days: int = 5) -> Dict[str, Any]:
        """Get weather forecast for specified days"""
        try:
            async with httpx.AsyncClient() as client:
                url = f"{self.base_url}/forecast"
                params = {
                    "q": city,
                    "appid": self.openweather_api_key,
                    "units": "metric",
                    "cnt": days * 8  # 8 forecasts per day (every 3 hours)
                }

                response = await client.get(url, params=params)
                response.raise_for_status()

                forecast_data = response.json()

                # Process forecast data
                forecasts = []
                for item in forecast_data["list"]:
                    forecast_item = {
                        "datetime": item["dt_txt"],
                        "temperature": item["main"]["temp"],
                        "humidity": item["main"]["humidity"],
                        "pressure": item["main"]["pressure"],
                        "wind_speed": item["wind"]["speed"],
                        "weather_main": item["weather"][0]["main"],
                        "weather_description": item["weather"][0]["description"],
                        "clouds": item["clouds"]["all"],
                        "rain": item.get("rain", {}).get("3h", 0),
                        "snow": item.get("snow", {}).get("3h", 0)
                    }
                    forecasts.append(forecast_item)

                result = {
                    "city": forecast_data["city"]["name"],
                    "country": forecast_data["city"]["country"],
                    "forecasts": forecasts,
                    "disaster_predictions": await self._predict_weather_disasters(forecasts)
                }

                return result

        except Exception as e:
            logger.error(f"Weather forecast fetch failed for {city}: {e}")
            raise

    def find_pdf_links(self, page_url: str = DMC_WEATHER_URL) -> List[tuple]:
        """Find PDF links on the DMC Weather Reports page"""
        try:
            r = requests.get(page_url, timeout=30)
            r.raise_for_status()
            soup = BeautifulSoup(r.text, "lxml")
            links = []

            for a in soup.find_all("a", href=True):
                href = a["href"].strip()
                if re.search(r"\.pdf($|\?)", href, flags=re.I):
                    abs_url = urljoin(page_url, href)
                    text = a.get_text(strip=True) or os.path.basename(href)
                    links.append((text, abs_url))

            # Remove duplicates
            dedup = []
            seen = set()
            for t, u in links:
                if u not in seen:
                    seen.add(u)
                    dedup.append((t, u))

            logger.info(f"Found {len(dedup)} PDF links from DMC")
            return dedup

        except Exception as e:
            logger.error(f"Failed to find PDF links: {e}")
            return []

    def sanitize_filename(self, name: str) -> str:
        """Sanitize filename for safe file operations"""
        base = re.sub(r"[^A-Za-z0-9_.-]+", "_", name).strip("_")
        return base or "dmc_report.pdf"

    def download_file(self, url: str, out_path: str) -> bool:
        """Download file from URL"""
        try:
            with requests.get(url, stream=True, timeout=60) as r:
                r.raise_for_status()
                with open(out_path, "wb") as f:
                    for chunk in r.iter_content(chunk_size=8192):
                        if chunk:
                            f.write(chunk)
            return True
        except Exception as e:
            logger.error(f"File download failed: {e}")
            return False

    def pdf_to_text(self, pdf_path: str) -> str:
        """Extract text from PDF file"""
        out = io.StringIO()
        try:
            with open(pdf_path, "rb") as f:
                reader = PdfReader(f)
                for i, page in enumerate(reader.pages):
                    try:
                        text = page.extract_text() or ""
                    except Exception as e:
                        text = ""
                        logger.warning(f"Page {i+1} extraction failed: {e}")
                    out.write(text)
                    out.write("\n\n")
        except Exception as e:
            logger.error(f"PDF text extraction failed: {e}")
            return ""

        return out.getvalue()

    async def get_latest_dmc_report(self) -> Dict[str, Any]:
        """Download and process the latest DMC weather report"""
        try:
            logger.info(f"Fetching PDF links from: {DMC_WEATHER_URL}")
            links = self.find_pdf_links()

            if not links:
                return {
                    "success": False,
                    "message": "No PDF links found on the DMC page",
                    "data": None
                }

            # Get the first (latest) report
            title, pdf_url = links[0]
            logger.info(f"Processing report: {title}")

            # Generate filename
            name_from_url = os.path.basename(pdf_url.split("?")[0]) or "dmc_report.pdf"
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"{timestamp}_{self.sanitize_filename(name_from_url)}"
            pdf_path = os.path.join(self.reports_dir, filename)

            # Download PDF
            if not self.download_file(pdf_url, pdf_path):
                return {
                    "success": False,
                    "message": "Failed to download PDF",
                    "data": None
                }

            # Extract text
            text_content = self.pdf_to_text(pdf_path)

            # Save text file
            text_path = pdf_path + ".txt"
            with open(text_path, "w", encoding="utf-8") as f:
                f.write(text_content)

            # Analyze content for disaster indicators
            disaster_indicators = self._analyze_report_content(text_content)

            return {
                "success": True,
                "message": "DMC report processed successfully",
                "data": {
                    "title": title,
                    "pdf_url": pdf_url,
                    "pdf_path": pdf_path,
                    "text_path": text_path,
                    "text_preview": text_content[:1500],
                    "full_text_length": len(text_content),
                    "disaster_indicators": disaster_indicators,
                    "processed_at": datetime.now().isoformat()
                }
            }

        except Exception as e:
            logger.error(f"DMC report processing failed: {e}")
            return {
                "success": False,
                "message": f"Error processing DMC report: {str(e)}",
                "data": None
            }

    async def _assess_disaster_risk(self, weather_data: Dict[str, Any]) -> Dict[str, Any]:
        """Assess disaster risk based on current weather conditions"""
        risk_factors = []
        risk_level = "Low"

        temp = weather_data["temperature"]
        humidity = weather_data["humidity"]
        wind_speed = weather_data["wind_speed"]
        pressure = weather_data["pressure"]
        weather_main = weather_data["weather_main"]

        # Temperature-based risks
        if temp > 35:
            risk_factors.append("Extreme heat - heat wave risk")
            risk_level = "High"
        elif temp < 10:
            risk_factors.append("Cold weather - potential for frost damage")
            risk_level = "Medium"

        # Wind-based risks
        if wind_speed > 20:
            risk_factors.append("Strong winds - potential for damage")
            risk_level = "High"
        elif wind_speed > 15:
            risk_factors.append("Moderate winds - monitor conditions")
            risk_level = "Medium"

        # Pressure-based risks
        if pressure < 1000:
            risk_factors.append("Low pressure - storm system possible")
            risk_level = "High"

        # Weather condition risks
        if weather_main in ["Thunderstorm", "Tornado"]:
            risk_factors.append("Severe weather - immediate danger")
            risk_level = "Critical"
        elif weather_main in ["Rain", "Snow"]:
            risk_factors.append("Precipitation - potential flooding/accumulation")
            if risk_level == "Low":
                risk_level = "Medium"

        # Humidity risks
        if humidity > 85:
            risk_factors.append("High humidity - comfort and health concerns")

        return {
            "risk_level": risk_level,
            "risk_factors": risk_factors,
            "recommendations": self._get_risk_recommendations(risk_level, risk_factors)
        }

    async def _predict_weather_disasters(self, forecasts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Predict potential disasters based on weather forecast"""
        predictions = []

        # Analyze forecast patterns
        high_winds = [f for f in forecasts if f["wind_speed"] > 15]
        heavy_rain = [f for f in forecasts if f["rain"] > 10]
        extreme_temps = [f for f in forecasts if f["temperature"] > 35 or f["temperature"] < 5]

        if len(high_winds) > 3:
            predictions.append({
                "type": "Wind Damage",
                "probability": "High",
                "timeframe": "Next 24-48 hours",
                "description": "Sustained high winds may cause property damage"
            })

        if len(heavy_rain) > 2:
            predictions.append({
                "type": "Flooding",
                "probability": "Medium",
                "timeframe": "Next 12-24 hours",
                "description": "Heavy rainfall may cause localized flooding"
            })

        if len(extreme_temps) > 2:
            predictions.append({
                "type": "Temperature Extreme",
                "probability": "Medium",
                "timeframe": "Next 24-72 hours",
                "description": "Extreme temperatures may affect health and infrastructure"
            })

        return {
            "predictions": predictions,
            "overall_risk": "High" if len(predictions) > 1 else ("Medium" if predictions else "Low")
        }

    def _analyze_report_content(self, text: str) -> Dict[str, Any]:
        """Analyze DMC report content for disaster indicators"""
        indicators = {
            "flood_risk": False,
            "drought_risk": False,
            "storm_risk": False,
            "heat_wave_risk": False,
            "keywords_found": [],
            "severity_indicators": []
        }

        text_lower = text.lower()

        # Flood indicators
        flood_keywords = ["flood", "flooding", "inundation", "water level", "overflow", "deluge"]
        for keyword in flood_keywords:
            if keyword in text_lower:
                indicators["flood_risk"] = True
                indicators["keywords_found"].append(keyword)

        # Drought indicators
        drought_keywords = ["drought", "dry", "water shortage", "rainfall deficit", "arid"]
        for keyword in drought_keywords:
            if keyword in text_lower:
                indicators["drought_risk"] = True
                indicators["keywords_found"].append(keyword)

        # Storm indicators
        storm_keywords = ["storm", "cyclone", "thunder", "lightning", "severe weather"]
        for keyword in storm_keywords:
            if keyword in text_lower:
                indicators["storm_risk"] = True
                indicators["keywords_found"].append(keyword)

        # Heat wave indicators
        heat_keywords = ["heat wave", "extreme temperature", "hot weather", "high temperature"]
        for keyword in heat_keywords:
            if keyword in text_lower:
                indicators["heat_wave_risk"] = True
                indicators["keywords_found"].append(keyword)

        # Severity indicators
        severity_words = ["severe", "extreme", "critical", "emergency", "warning", "alert"]
        for word in severity_words:
            if word in text_lower:
                indicators["severity_indicators"].append(word)

        return indicators

    def _get_risk_recommendations(self, risk_level: str, risk_factors: List[str]) -> List[str]:
        """Get recommendations based on risk assessment"""
        recommendations = []

        if risk_level == "Critical":
            recommendations.extend([
                "Seek immediate shelter",
                "Avoid outdoor activities",
                "Monitor emergency broadcasts",
                "Prepare emergency supplies"
            ])
        elif risk_level == "High":
            recommendations.extend([
                "Limit outdoor exposure",
                "Monitor weather conditions closely",
                "Prepare for potential evacuations",
                "Check emergency supplies"
            ])
        elif risk_level == "Medium":
            recommendations.extend([
                "Stay informed about weather conditions",
                "Avoid unnecessary travel",
                "Secure loose outdoor items"
            ])
        else:
            recommendations.append("Continue normal activities with weather awareness")

        return recommendations
