import cv2
import numpy as np
import logging
from typing import Dict, List, Optional, Any
import os
import asyncio
import joblib  # <-- needed for model loading

from ..config.settings import get_settings

logger = logging.getLogger(__name__)

class MLService:
    """Machine Learning service for disaster assessment and prediction"""

    def __init__(self):
        self.settings = get_settings()
        self.models: Dict[str, Any] = {}
        self.damage_classes = ["Minimal", "Minor", "Moderate", "Severe", "Critical"]
        self._load_models()

    def _load_models(self):
        """Load pre-trained models"""
        try:
            damage_classifier_path = os.path.abspath(self.settings.damage_classifier_path)
            priority_scorer_path = os.path.abspath(self.settings.priority_scorer_path)
            demand_predictor_path = os.path.abspath(self.settings.demand_predictor_path)

            if os.path.exists(damage_classifier_path):
                self.models['damage_classifier'] = joblib.load(damage_classifier_path)
                logger.info("✅ Damage classifier model loaded successfully")
            else:
                logger.warning(f"Damage classifier not found at {damage_classifier_path}")
                self._create_fallback_models()

            if os.path.exists(priority_scorer_path):
                self.models['priority_scorer'] = joblib.load(priority_scorer_path)
                logger.info("✅ Priority scorer model loaded successfully")
            else:
                logger.warning(f"Priority scorer not found at {priority_scorer_path}")

            if os.path.exists(demand_predictor_path):
                self.models['demand_predictor'] = joblib.load(demand_predictor_path)
                logger.info("✅ Demand predictor model loaded successfully")
            else:
                logger.warning(f"Demand predictor not found at {demand_predictor_path}")

        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
            self._create_fallback_models()

    def _create_fallback_models(self):
        """Create simple rule-based fallback models"""
        logger.info("Creating fallback rule-based models...")
        self.models['damage_classifier'] = "rule_based"
        self.models['priority_scorer'] = "rule_based"
        self.models['demand_predictor'] = "rule_based"

    # ---------- NEW: called by your /analyze-by-url flow ----------
    def predict_damage_level(self, features: Dict) -> Dict:
        """
        Predict damage level from a CV features dict like:
        {
          "color": {"mean_bgr": [...], "std_bgr": [...], "dominant_colors": [[...], ...]},
          "texture": {"energy": float, "contrast": float},
          "edges": {"edge_density": float, "num_contours": int}
        }
        Returns: {damage_level, confidence_score, model_used, damage_score}
        """
        try:
            x = self._features_dict_to_array(features)
            if self.models.get('damage_classifier') == "rule_based":
                # Use same rule-based logic as classify_damage()
                return self._rule_based_damage_classification(x, disaster_type=None)
            # ML path
            clf = self.models.get('damage_classifier')
            pred = clf.predict(x.reshape(1, -1))[0]
            if hasattr(clf, "predict_proba"):
                conf = float(np.max(clf.predict_proba(x.reshape(1, -1))[0]))
            else:
                # fallback confidence if model lacks predict_proba
                conf = 0.7
            return {
                "damage_level": self.damage_classes[int(pred)] if int(pred) < len(self.damage_classes) else "Moderate",
                "confidence_score": conf,
                "model_used": "ml_model",
                "damage_score": conf,
            }
        except Exception as e:
            logger.error(f"predict_damage_level failed: {e}")
            # Fall back to rule-based if something goes wrong
            x = self._features_dict_to_array(features, safe=True)
            return self._rule_based_damage_classification(x, disaster_type=None)

    def _features_dict_to_array(self, features: Dict, safe: bool = False) -> np.ndarray:
        """
        Flatten your CV feature dict into a numeric vector compatible with ML models
        and the rule-based classifier. The goal is to be stable even when some fields
        are missing.
        """
        try:
            color = features.get("color", {})
            texture = features.get("texture", {})
            edges = features.get("edges", {})

            mean_bgr = color.get("mean_bgr", [0, 0, 0])
            std_bgr = color.get("std_bgr", [0, 0, 0])
            # Flatten dominant colors (3x3 -> 9 values) with safe defaults
            dominant = color.get("dominant_colors", [[0, 0, 0]] * 3)
            dom_flat = []
            for c in dominant[:3]:
                if isinstance(c, (list, tuple)) and len(c) == 3:
                    dom_flat.extend(list(c))
                else:
                    dom_flat.extend([0, 0, 0])
            while len(dom_flat) < 9:
                dom_flat.append(0)

            texture_energy = float(texture.get("energy", 0.0))
            texture_contrast = float(texture.get("contrast", 0.0))

            edge_density = float(edges.get("edge_density", 0.0))
            num_contours = float(edges.get("num_contours", 0.0))

            vec = np.array(
                list(map(float, mean_bgr))
                + list(map(float, std_bgr))
                + list(map(float, dom_flat))
                + [texture_energy, texture_contrast, edge_density, num_contours],
                dtype=np.float32,
            )

            # If you trained with a fixed dimensionality, you could pad/trim here.
            return vec
        except Exception as e:
            logger.error(f"_features_dict_to_array failed: {e}")
            return np.zeros(20, dtype=np.float32) if safe else np.zeros(0, dtype=np.float32)

    # ---------- Legacy/other APIs you already had ----------

    async def classify_damage(self, image_path: str, disaster_type: Optional[str] = None) -> Dict:
        """Classify damage level using ML models based on image path"""
        try:
            if not os.path.exists(image_path):
                raise FileNotFoundError(f"Image not found at {image_path}")

            features_vec = await asyncio.to_thread(self._extract_ml_features, image_path)

            if self.models.get('damage_classifier') == "rule_based":
                damage_result = self._rule_based_damage_classification(features_vec, disaster_type)
            else:
                damage_result = self._ml_damage_classification(features_vec, disaster_type)

            return damage_result

        except Exception as e:
            logger.error(f"Damage classification failed: {str(e)}")
            return {
                "damage_level": "Minimal",
                "confidence_score": 0.5,
                "model_used": "fallback",
                "error": str(e)
            }

    def _extract_ml_features(self, image_path: str) -> np.ndarray:
        """Extract features from image for ML model input"""
        try:
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not load image from {image_path}")

            image = cv2.resize(image, (224, 224))
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            color_features = [
                np.mean(image[:,:,0]), np.std(image[:,:,0]),
                np.mean(image[:,:,1]), np.std(image[:,:,1]),
                np.mean(image[:,:,2]), np.std(image[:,:,2]),
                np.mean(hsv[:,:,0]), np.std(hsv[:,:,0]),
                np.mean(hsv[:,:,1]), np.std(hsv[:,:,1]),
                np.mean(hsv[:,:,2]), np.std(hsv[:,:,2])
            ]

            texture_features = self._extract_texture_features(gray)
            edge_features = self._extract_edge_features(gray)

            return np.array(color_features + texture_features + edge_features, dtype=np.float32)

        except Exception as e:
            logger.error(f"Feature extraction failed: {str(e)}")
            return np.zeros(50, dtype=np.float32)

    def _extract_texture_features(self, gray_image: np.ndarray) -> List[float]:
        """Extract texture-based features"""
        try:
            kernel = np.array([[-1,-1,-1], [-1,8,-1], [-1,-1,-1]], dtype=np.float32)
            texture_response = cv2.filter2D(gray_image, -1, kernel)
            return [
                float(np.mean(texture_response)),
                float(np.std(texture_response)),
                float(np.var(texture_response)),
                float(np.percentile(texture_response, 25)),
                float(np.percentile(texture_response, 75))
            ]
        except Exception as e:
            logger.error(f"Texture feature extraction failed: {str(e)}")
            return [0.0] * 5

    def _extract_edge_features(self, gray_image: np.ndarray) -> List[float]:
        """Extract edge-based features"""
        try:
            edges = cv2.Canny(gray_image, 50, 150)
            sobel_x = cv2.Sobel(gray_image, cv2.CV_64F, 1, 0, ksize=3)
            sobel_y = cv2.Sobel(gray_image, cv2.CV_64F, 0, 1, ksize=3)
            sobel_magnitude = np.sqrt(sobel_x**2 + sobel_y**2)
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            return [
                float(np.sum(edges > 0) / edges.size),
                float(np.mean(sobel_magnitude)),
                float(np.std(sobel_magnitude)),
                float(np.max(sobel_magnitude)),
                float(len(contours))
            ]
        except Exception as e:
            logger.error(f"Edge feature extraction failed: {str(e)}")
            return [0.0] * 5

    def _rule_based_damage_classification(self, features: np.ndarray, disaster_type: Optional[str]) -> Dict:
        """Rule-based damage classification when ML models are not available"""
        try:
            # Defensive defaults if vector shorter than expected
            f = np.array(features, dtype=np.float32).ravel()
            # color variance approx from first 12 elements (as in prior code)
            color_variance = np.std(f[:12]) if f.size >= 12 else 0.0
            texture_range = f[12:17] if f.size >= 17 else np.zeros(5, dtype=np.float32)
            texture_complexity = float(np.mean(texture_range))
            edge_density = float(f[17]) if f.size > 17 else 0.1

            # Thresholds (same as your earlier code)
            color_score = max(0.0, (color_variance - 20) / 150)
            texture_score = max(0.0, (texture_complexity - 70) / 1500)
            edge_score = max(0.0, edge_density - 0.2)

            damage_score = (color_score * 0.15 + texture_score * 0.2 + edge_score * 0.3)
            damage_score = max(0.0, min(1.0, damage_score))

            if (color_score < 0.1 and texture_score < 0.1 and edge_score < 0.1):
                damage_level = "Minimal"
            elif damage_score <= 0.3:
                damage_level = "Minimal"
            elif damage_score <= 0.5:
                damage_level = "Minor"
            elif damage_score <= 0.7:
                damage_level = "Moderate"
            elif damage_score <= 0.85:
                damage_level = "Severe"
            else:
                damage_level = "Critical"

            if disaster_type:
                disaster_multipliers = {
                    "earthquake": 1.2,
                    "flood": 0.9,
                    "fire": 1.1,
                    "hurricane": 1.15,
                    "tornado": 1.3
                }
                multiplier = disaster_multipliers.get(str(disaster_type).lower(), 1.0)
                damage_score = min(1.0, damage_score * multiplier)
                if damage_score > 0.85:
                    damage_level = "Critical"
                elif damage_score > 0.7:
                    damage_level = "Severe"

            return {
                "damage_level": damage_level,
                "confidence_score": 0.7,
                "model_used": "rule_based",
                "damage_score": float(damage_score)
            }
        except Exception as e:
            logger.error(f"Rule-based classification failed: {str(e)}")
            return {
                "damage_level": "Minimal",
                "confidence_score": 0.5,
                "model_used": "rule_based",
                "damage_score": 0.0
            }

    def _ml_damage_classification(self, features: np.ndarray, disaster_type: Optional[str]) -> Dict:
        """ML-based damage classification"""
        try:
            clf = self.models.get('damage_classifier')
            if clf == "rule_based" or clf is None:
                return self._rule_based_damage_classification(features, disaster_type)

            prediction = clf.predict(features.reshape(1, -1))[0]
            if hasattr(clf, "predict_proba"):
                confidence = float(np.max(clf.predict_proba(features.reshape(1, -1))[0]))
            else:
                confidence = 0.7

            return {
                "damage_level": self.damage_classes[int(prediction)] if int(prediction) < len(self.damage_classes) else "Moderate",
                "confidence_score": confidence,
                "model_used": "ml_model",
                "damage_score": confidence
            }
        except Exception as e:
            logger.error(f"ML damage classification failed: {str(e)}")
            return self._rule_based_damage_classification(features, disaster_type)

    # ----- The remaining utility methods you already had (unchanged) -----

    async def predict_resource_requirements(
        self,
        severity_score: float,
        infrastructure_impact: Dict,
        disaster_type: Optional[str] = None
    ) -> Dict:
        """Predict resource requirements based on damage assessment"""
        try:
            if not 0 <= severity_score <= 10:
                raise ValueError("Severity score must be between 0 and 10")

            resources = self._calculate_base_resources(severity_score, infrastructure_impact)

            if disaster_type:
                resources = self._adjust_resources_for_disaster_type(resources, disaster_type.lower())

            resources.update({
                "deployment_timeline": self._calculate_deployment_timeline(severity_score),
                "resource_priority": self._calculate_resource_priority(severity_score, infrastructure_impact),
                "estimated_duration": self._estimate_operation_duration(severity_score, infrastructure_impact)
            })

            return resources

        except Exception as e:
            logger.error(f"Resource prediction failed: {str(e)}")
            return self._get_default_resources()

    async def calculate_priority_score(
        self,
        severity_score: float,
        resource_requirements: Dict,
        latitude: Optional[float] = None,
        longitude: Optional[float] = None
    ) -> float:
        """Calculate priority score for response planning"""
        try:
            if not 0 <= severity_score <= 10:
                raise ValueError("Severity score must be between 0 and 10")

            priority = severity_score * 0.6
            resource_urgency = self._calculate_resource_urgency(resource_requirements)
            priority += resource_urgency * 0.25

            if latitude is not None and longitude is not None:
                if not (-90 <= latitude <= 90 and -180 <= longitude <= 180):
                    raise ValueError("Invalid geographic coordinates")
                geo_factor = self._calculate_geographic_priority(latitude, longitude)
                priority += geo_factor * 0.15

            return max(1.0, min(10.0, priority))

        except Exception as e:
            logger.error(f"Priority calculation failed: {str(e)}")
            return max(1.0, severity_score)

    def _calculate_base_resources(self, severity_score: float, infrastructure_impact: Dict) -> Dict:
        """Calculate base resource requirements"""
        base_multiplier = severity_score / 10.0
        return {
            "emergency_responders": max(2, int(base_multiplier * 20)),
            "medical_personnel": max(1, int(base_multiplier * 10)),
            "engineers": max(1, int(base_multiplier * 5)),
            "volunteers": max(5, int(base_multiplier * 50)),
            "ambulances": max(1, int(base_multiplier * 3)),
            "fire_trucks": max(1, int(base_multiplier * 2)),
            "heavy_equipment": severity_score >= 6.0,
            "generators": max(1, int(base_multiplier * 4)),
            "communication_equipment": True,
            "medical_supplies": f"{int(base_multiplier * 100)} units",
            "water_bottles": f"{int(base_multiplier * 500)} bottles",
            "emergency_food": f"{int(base_multiplier * 200)} meals",
            "blankets": f"{int(base_multiplier * 100)} blankets",
            "temporary_shelter": severity_score >= 7.0,
            "temporary_bridges": infrastructure_impact.get("road_access_blocked", False),
            "utility_repair_crews": infrastructure_impact.get("utilities_affected", False),
            "debris_removal_equipment": severity_score >= 5.0
        }

    def _adjust_resources_for_disaster_type(self, resources: Dict, disaster_type: str) -> Dict:
        """Adjust resource requirements based on disaster type"""
        if disaster_type == "fire":
            resources["fire_trucks"] = max(3, resources["fire_trucks"] * 2)
            resources["water_tankers"] = max(2, int(resources.get("ambulances", 1) * 1.5))
        elif disaster_type == "flood":
            resources["boats"] = max(2, int(resources.get("ambulances", 1)))
            resources["water_pumps"] = max(3, int(resources.get("generators", 1) * 2))
            resources["sanitation_supplies"] = f"{int(resources.get('volunteers', 5)) * 10} units"
        elif disaster_type == "earthquake":
            resources["search_and_rescue_teams"] = max(3, int(resources.get("emergency_responders", 2) * 0.5))
            resources["heavy_equipment"] = True
            resources["structural_engineers"] = max(2, resources.get("engineers", 1))
        elif disaster_type in ["hurricane", "tornado"]:
            resources["emergency_shelters"] = max(2, int(resources.get("volunteers", 5) / 20))
            resources["power_restoration_crews"] = max(2, resources.get("engineers", 1))
        return resources

    def _calculate_deployment_timeline(self, severity_score: float) -> Dict:
        """Calculate deployment timeline based on severity"""
        if severity_score >= 8.0:
            return {"immediate_response": "0-15 minutes", "first_responders": "15-30 minutes", "specialized_teams": "30-60 minutes", "heavy_equipment": "1-2 hours"}
        elif severity_score >= 6.0:
            return {"immediate_response": "15-30 minutes", "first_responders": "30-60 minutes", "specialized_teams": "1-2 hours", "heavy_equipment": "2-4 hours"}
        return {"immediate_response": "1-2 hours", "first_responders": "2-4 hours", "specialized_teams": "4-8 hours", "heavy_equipment": "8-24 hours"}

    def _calculate_resource_priority(self, severity_score: float, infrastructure_impact: Dict) -> List[str]:
        """Calculate resource deployment priority"""
        if severity_score >= 8.0:
            return ["Emergency medical teams", "Search and rescue", "Evacuation support", "Security and cordoning", "Communication establishment"]
        elif severity_score >= 6.0:
            return ["First responders", "Medical assistance", "Area assessment", "Utility restoration", "Temporary shelter"]
        return ["Damage assessment", "Utility inspection", "Cleanup coordination", "Insurance documentation", "Community support"]

    def _estimate_operation_duration(self, severity_score: float, infrastructure_impact: Dict) -> Dict:
        """Estimate operation duration"""
        if severity_score >= 8.0:
            return {"emergency_phase": "24-72 hours", "rescue_operations": "3-7 days", "recovery_phase": "2-6 months", "total_operation": "6-12 months"}
        elif severity_score >= 6.0:
            return {"emergency_phase": "12-24 hours", "rescue_operations": "1-3 days", "recovery_phase": "2-8 weeks", "total_operation": "2-4 months"}
        return {"emergency_phase": "6-12 hours", "rescue_operations": "12-24 hours", "recovery_phase": "1-4 weeks", "total_operation": "1-2 months"}

    def _calculate_resource_urgency(self, resource_requirements: Dict) -> float:
        """Calculate urgency factor based on resource requirements"""
        try:
            urgency_factors = [
                1.0 if resource_requirements.get("heavy_equipment") else 0.0,
                1.0 if resource_requirements.get("temporary_shelter") else 0.0,
                min(1.0, resource_requirements.get("emergency_responders", 0) / 20),
                min(1.0, resource_requirements.get("medical_personnel", 0) / 10)
            ]
            return np.mean(urgency_factors) * 2.0
        except Exception as e:
            logger.error(f"Resource urgency calculation failed: {str(e)}")
            return 1.0

    def _calculate_geographic_priority(self, latitude: float, longitude: float) -> float:
        """Calculate geographic priority factor"""
        try:
            return 0.5
        except Exception as e:
            logger.error(f"Geographic priority calculation failed: {str(e)}")
            return 0.5

    def _get_default_resources(self) -> Dict:
        """Get default resource allocation for fallback"""
        return {
            "emergency_responders": 5,
            "medical_personnel": 2,
            "engineers": 1,
            "volunteers": 10,
            "ambulances": 1,
            "communication_equipment": True,
            "medical_supplies": "50 units",
            "water_bottles": "100 bottles",
            "emergency_food": "50 meals"
        }
