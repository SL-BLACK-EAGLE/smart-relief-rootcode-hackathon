"""
Computer Vision Service
Handles image processing, damage detection, and assessment
"""
import cv2
import numpy as np
import logging
from typing import Dict, List, Tuple, Optional
from PIL import Image
import os

from ..config.settings import get_settings

logger = logging.getLogger(__name__)

class CVService:
    """Computer Vision service for disaster image analysis"""

    def __init__(self):
        self.settings = get_settings()
        self.damage_classes = ["Minor", "Moderate", "Severe"]

    async def preprocess_image(self, image_path: str) -> Dict:
        """Preprocess image for analysis"""
        try:
            # Load image
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not load image from {image_path}")

            # Get original dimensions
            original_height, original_width = image.shape[:2]

            # Resize for processing
            processed_image = cv2.resize(image, (512, 512))

            # Enhance image quality
            enhanced_image = self._enhance_image(processed_image)

            # Extract features
            features = self._extract_features(enhanced_image)

            return {
                "original_dimensions": (original_width, original_height),
                "processed_dimensions": (512, 512),
                "features": features,
                "enhancement_applied": True,
                "status": "success"
            }

        except Exception as e:
            logger.error(f"Error preprocessing image: {e}")
            return {"status": "error", "error": str(e)}

    def _enhance_image(self, image: np.ndarray) -> np.ndarray:
        """Enhance image quality for better analysis"""
        # Convert to LAB color space
        lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)

        # Apply CLAHE to L channel
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        lab[:, :, 0] = clahe.apply(lab[:, :, 0])

        # Convert back to BGR
        enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)

        # Apply denoising
        enhanced = cv2.fastNlMeansDenoisingColored(enhanced, None, 10, 10, 7, 21)

        return enhanced

    def _extract_features(self, image: np.ndarray) -> Dict:
        """Extract features from image"""
        try:
            # Color features
            color_features = self._extract_color_features(image)

            # Texture features
            texture_features = self._extract_texture_features(image)

            # Edge features
            edge_features = self._extract_edge_features(image)

            return {
                "color": color_features,
                "texture": texture_features,
                "edges": edge_features
            }
        except Exception as e:
            logger.error(f"Error extracting features: {e}")
            return {}

    def _extract_color_features(self, image: np.ndarray) -> Dict:
        """Extract color-based features"""
        # Convert to different color spaces
        hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

        # Calculate histograms
        hist_b = cv2.calcHist([image], [0], None, [256], [0, 256])
        hist_g = cv2.calcHist([image], [1], None, [256], [0, 256])
        hist_r = cv2.calcHist([image], [2], None, [256], [0, 256])

        # Calculate mean and std for each channel
        mean_bgr = np.mean(image, axis=(0, 1))
        std_bgr = np.std(image, axis=(0, 1))

        return {
            "mean_bgr": mean_bgr.tolist(),
            "std_bgr": std_bgr.tolist(),
            "dominant_colors": self._get_dominant_colors(image)
        }

    def _extract_texture_features(self, image: np.ndarray) -> Dict:
        """Extract texture-based features"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Calculate texture measures
        # Local Binary Pattern could be added here
        texture_energy = np.var(gray)
        texture_contrast = np.max(gray) - np.min(gray)

        return {
            "energy": float(texture_energy),
            "contrast": float(texture_contrast)
        }

    def _extract_edge_features(self, image: np.ndarray) -> Dict:
        """Extract edge-based features"""
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Apply Canny edge detection
        edges = cv2.Canny(gray, 50, 150)

        # Calculate edge density
        edge_density = np.sum(edges > 0) / (edges.shape[0] * edges.shape[1])

        # Find contours
        contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        num_contours = len(contours)

        return {
            "edge_density": float(edge_density),
            "num_contours": num_contours
        }

    def _get_dominant_colors(self, image: np.ndarray, k: int = 3) -> List:
        """Get dominant colors using K-means clustering"""
        try:
            # Reshape image to be a list of pixels
            pixels = image.reshape((-1, 3))
            pixels = np.float32(pixels)

            # Apply K-means
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
            _, labels, centers = cv2.kmeans(pixels, k, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)

            # Convert centers to uint8
            centers = np.uint8(centers)

            return centers.tolist()
        except:
            return []

    async def detect_damage(self, features: Dict) -> Dict:
        """Detect damage level from extracted features"""
        try:
            # This is a simplified damage detection algorithm
            # In a real implementation, you would use a trained ML model

            # Extract key metrics
            color_features = features.get("color", {})
            texture_features = features.get("texture", {})
            edge_features = features.get("edges", {})

            # Calculate damage indicators
            damage_score = 0.0

            # Color-based indicators (debris, dust, unusual colors)
            if color_features:
                mean_bgr = color_features.get("mean_bgr", [0, 0, 0])
                # Lower brightness often indicates damage
                brightness = sum(mean_bgr) / 3
                if brightness < 100:
                    damage_score += 0.3

            # Texture-based indicators (rough, irregular surfaces)
            if texture_features:
                texture_energy = texture_features.get("energy", 0)
                if texture_energy > 1000:  # High texture variation
                    damage_score += 0.4

            # Edge-based indicators (broken structures, debris)
            if edge_features:
                edge_density = edge_features.get("edge_density", 0)
                if edge_density > 0.1:  # High edge density
                    damage_score += 0.3

            # Determine damage level
            if damage_score >= 0.7:
                damage_level = "Severe"
                confidence = min(0.95, damage_score)
            elif damage_score >= 0.4:
                damage_level = "Moderate"
                confidence = min(0.85, damage_score)
            else:
                damage_level = "Minor"
                confidence = max(0.6, 1.0 - damage_score)

            return {
                "damage_level": damage_level,
                "confidence_score": round(confidence, 3),
                "damage_score": round(damage_score, 3),
                "indicators": {
                    "color_based": color_features is not None,
                    "texture_based": texture_features is not None,
                    "edge_based": edge_features is not None
                }
            }

        except Exception as e:
            logger.error(f"Error detecting damage: {e}")
            return {
                "damage_level": "Unknown",
                "confidence_score": 0.0,
                "error": str(e)
            }

    async def analyze_infrastructure(self, image_path: str, damage_assessment: Dict) -> Dict:
        """Analyze infrastructure impact"""
        try:
            # This would typically involve more sophisticated analysis
            damage_level = damage_assessment.get("damage_level", "Minor")
            confidence = damage_assessment.get("confidence_score", 0.0)

            # Determine infrastructure impact
            if damage_level == "Severe":
                impact = {
                    "structural_integrity": "Compromised",
                    "safety_level": "Unsafe",
                    "accessibility": "Blocked",
                    "utilities_status": "Disrupted",
                    "evacuation_needed": True
                }
            elif damage_level == "Moderate":
                impact = {
                    "structural_integrity": "Partially Damaged",
                    "safety_level": "Caution Required",
                    "accessibility": "Limited",
                    "utilities_status": "Partially Affected",
                    "evacuation_needed": False
                }
            else:
                impact = {
                    "structural_integrity": "Stable",
                    "safety_level": "Safe",
                    "accessibility": "Clear",
                    "utilities_status": "Operational",
                    "evacuation_needed": False
                }

            return {
                "infrastructure_impact": impact,
                "assessment_confidence": confidence,
                "recommendations": self._generate_recommendations(damage_level)
            }

        except Exception as e:
            logger.error(f"Error analyzing infrastructure: {e}")
            return {"error": str(e)}

    def _generate_recommendations(self, damage_level: str) -> List[str]:
        """Generate recommendations based on damage level"""
        recommendations = {
            "Severe": [
                "Immediate evacuation required",
                "Deploy search and rescue teams",
                "Establish emergency medical facilities",
                "Coordinate with local emergency services",
                "Set up temporary shelters"
            ],
            "Moderate": [
                "Assess structural safety",
                "Provide medical assistance if needed",
                "Monitor for further deterioration",
                "Coordinate utility repairs",
                "Prepare contingency plans"
            ],
            "Minor": [
                "Document damage for insurance",
                "Monitor situation",
                "Provide basic assistance if needed",
                "Check utility services",
                "Maintain communication channels"
            ]
        }

        return recommendations.get(damage_level, [])
