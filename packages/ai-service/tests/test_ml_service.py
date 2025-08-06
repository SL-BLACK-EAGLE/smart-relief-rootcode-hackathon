"""
Test ML Service
Unit tests for machine learning service functionality
"""
import pytest
from unittest.mock import Mock, patch
import numpy as np

from app.services.ml_service import MLService

class TestMLService:
    """Test cases for MLService"""

    def setup_method(self):
        """Setup test environment"""
        self.ml_service = MLService()

    @pytest.mark.asyncio
    async def test_predict_damage_level(self):
        """Test damage level prediction"""
        features = {
            "color": {"mean_bgr": [120, 110, 100], "std_bgr": [30, 25, 20]},
            "texture": {"energy": 1200, "contrast": 150},
            "edges": {"edge_density": 0.15, "num_contours": 50}
        }

        result = await self.ml_service.predict_damage_level(features)

        assert "damage_level" in result
        assert "confidence_score" in result
        assert result["damage_level"] in ["Minor", "Moderate", "Severe"]
        assert 0 <= result["confidence_score"] <= 1

    @pytest.mark.asyncio
    async def test_calculate_priority_score(self):
        """Test priority score calculation"""
        damage_assessment = {
            "damage_level": "Moderate",
            "confidence_score": 0.85
        }

        context_data = {
            "population_density": 0.7,
            "weather_risk": 0.3,
            "accessibility_score": 0.6
        }

        result = await self.ml_service.calculate_priority_score(damage_assessment, context_data)

        assert "priority_score" in result
        assert "priority_level" in result
        assert result["priority_level"] in ["Low", "Medium", "High", "Critical"]
        assert 0 <= result["priority_score"] <= 100
