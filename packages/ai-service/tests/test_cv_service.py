"""
Test CV Service
Unit tests for computer vision service functionality
"""
import pytest
import numpy as np
from unittest.mock import Mock, patch
import tempfile
import os

from app.services.cv_service import CVService

class TestCVService:
    """Test cases for CVService"""

    def setup_method(self):
        """Setup test environment"""
        self.cv_service = CVService()

    @pytest.mark.asyncio
    async def test_preprocess_image_success(self):
        """Test successful image preprocessing"""
        # Create a temporary test image
        with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as tmp:
            # Create a simple test image
            import cv2
            test_image = np.zeros((100, 100, 3), dtype=np.uint8)
            cv2.imwrite(tmp.name, test_image)

            result = await self.cv_service.preprocess_image(tmp.name)

            assert result["status"] == "success"
            assert "features" in result
            assert "original_dimensions" in result

            # Cleanup
            os.unlink(tmp.name)

    @pytest.mark.asyncio
    async def test_detect_damage(self):
        """Test damage detection"""
        # Mock features
        features = {
            "color": {"mean_bgr": [100, 100, 100]},
            "texture": {"energy": 1500},
            "edges": {"edge_density": 0.2}
        }

        result = await self.cv_service.detect_damage(features)

        assert "damage_level" in result
        assert "confidence_score" in result
        assert result["damage_level"] in ["Minor", "Moderate", "Severe"]
        assert 0 <= result["confidence_score"] <= 1
