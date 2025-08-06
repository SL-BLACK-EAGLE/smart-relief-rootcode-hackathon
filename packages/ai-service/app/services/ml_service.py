"""
Machine Learning Service
Handles ML model loading, training, and predictions
"""
import pickle
import numpy as np
import pandas as pd
import logging
from typing import Dict, List, Optional, Any
import os
from datetime import datetime
import joblib

from ..config.settings import get_settings

logger = logging.getLogger(__name__)

class MLService:
    """Machine Learning service for disaster assessment and prediction"""

    def __init__(self):
        self.settings = get_settings()
        self.models = {}
        self._load_models()

    def _load_models(self):
        """Load pre-trained models"""
        try:
            # Load damage classifier
            damage_classifier_path = self.settings.damage_classifier_path
            if os.path.exists(damage_classifier_path):
                self.models['damage_classifier'] = joblib.load(damage_classifier_path)
                logger.info("Damage classifier model loaded successfully")
            else:
                logger.warning(f"Damage classifier not found at {damage_classifier_path}")

            # Load priority scorer
            priority_scorer_path = self.settings.priority_scorer_path
            if os.path.exists(priority_scorer_path):
                self.models['priority_scorer'] = joblib.load(priority_scorer_path)
                logger.info("Priority scorer model loaded successfully")
            else:
                logger.warning(f"Priority scorer not found at {priority_scorer_path}")

            # Load demand predictor
            demand_predictor_path = self.settings.demand_predictor_path
            if os.path.exists(demand_predictor_path):
                self.models['demand_predictor'] = joblib.load(demand_predictor_path)
                logger.info("Demand predictor model loaded successfully")
            else:
                logger.warning(f"Demand predictor not found at {demand_predictor_path}")

        except Exception as e:
            logger.error(f"Error loading models: {e}")

    async def predict_damage_level(self, features: Dict) -> Dict:
        """Predict damage level using ML model"""
        try:
            model = self.models.get('damage_classifier')
            if not model:
                # Fallback to rule-based prediction
                return self._rule_based_damage_prediction(features)

            # Prepare features for model
            feature_vector = self._prepare_damage_features(features)

            # Make prediction
            prediction = model.predict([feature_vector])[0]
            confidence = max(model.predict_proba([feature_vector])[0])

            damage_levels = ["Minor", "Moderate", "Severe"]
            predicted_level = damage_levels[prediction] if prediction < len(damage_levels) else "Unknown"

            return {
                "damage_level": predicted_level,
                "confidence_score": float(confidence),
                "model_used": "ml_classifier",
                "features_used": len(feature_vector)
            }

        except Exception as e:
            logger.error(f"Error in ML damage prediction: {e}")
            return self._rule_based_damage_prediction(features)

    def _prepare_damage_features(self, features: Dict) -> List[float]:
        """Prepare features for damage classification model"""
        feature_vector = []

        # Color features
        color_features = features.get("color", {})
        if color_features:
            mean_bgr = color_features.get("mean_bgr", [0, 0, 0])
            std_bgr = color_features.get("std_bgr", [0, 0, 0])
            feature_vector.extend(mean_bgr)
            feature_vector.extend(std_bgr)
        else:
            feature_vector.extend([0] * 6)  # 3 mean + 3 std

        # Texture features
        texture_features = features.get("texture", {})
        if texture_features:
            feature_vector.append(texture_features.get("energy", 0))
            feature_vector.append(texture_features.get("contrast", 0))
        else:
            feature_vector.extend([0, 0])

        # Edge features
        edge_features = features.get("edges", {})
        if edge_features:
            feature_vector.append(edge_features.get("edge_density", 0))
            feature_vector.append(edge_features.get("num_contours", 0))
        else:
            feature_vector.extend([0, 0])

        return feature_vector

    def _rule_based_damage_prediction(self, features: Dict) -> Dict:
        """Fallback rule-based damage prediction"""
        # Simple rule-based approach
        damage_score = 0.0

        color_features = features.get("color", {})
        texture_features = features.get("texture", {})
        edge_features = features.get("edges", {})

        if color_features:
            mean_bgr = color_features.get("mean_bgr", [0, 0, 0])
            brightness = sum(mean_bgr) / 3
            if brightness < 80:
                damage_score += 0.4

        if texture_features:
            energy = texture_features.get("energy", 0)
            if energy > 1500:
                damage_score += 0.3

        if edge_features:
            edge_density = edge_features.get("edge_density", 0)
            if edge_density > 0.15:
                damage_score += 0.3

        if damage_score >= 0.7:
            damage_level = "Severe"
            confidence = 0.8
        elif damage_score >= 0.4:
            damage_level = "Moderate"
            confidence = 0.75
        else:
            damage_level = "Minor"
            confidence = 0.7

        return {
            "damage_level": damage_level,
            "confidence_score": confidence,
            "model_used": "rule_based",
            "damage_score": damage_score
        }

    async def calculate_priority_score(self, damage_assessment: Dict, context_data: Dict = None) -> Dict:
        """Calculate priority score for response"""
        try:
            model = self.models.get('priority_scorer')

            # Prepare features
            priority_features = self._prepare_priority_features(damage_assessment, context_data)

            if model:
                # Use ML model
                priority_score = model.predict([priority_features])[0]
                confidence = 0.9  # Model confidence
            else:
                # Use rule-based approach
                priority_score = self._calculate_rule_based_priority(damage_assessment, context_data)
                confidence = 0.8

            # Determine priority level
            if priority_score >= 80:
                priority_level = "Critical"
            elif priority_score >= 60:
                priority_level = "High"
            elif priority_score >= 40:
                priority_level = "Medium"
            else:
                priority_level = "Low"

            return {
                "priority_score": float(priority_score),
                "priority_level": priority_level,
                "confidence": confidence,
                "urgency_factors": self._identify_urgency_factors(damage_assessment, context_data)
            }

        except Exception as e:
            logger.error(f"Error calculating priority score: {e}")
            return {
                "priority_score": 50.0,
                "priority_level": "Medium",
                "confidence": 0.5,
                "error": str(e)
            }

    def _prepare_priority_features(self, damage_assessment: Dict, context_data: Dict = None) -> List[float]:
        """Prepare features for priority scoring"""
        features = []

        # Damage level encoding
        damage_level = damage_assessment.get("damage_level", "Minor")
        damage_encoding = {"Minor": 1, "Moderate": 2, "Severe": 3}
        features.append(damage_encoding.get(damage_level, 1))

        # Confidence score
        features.append(damage_assessment.get("confidence_score", 0.5))

        # Context features
        if context_data:
            features.append(context_data.get("population_density", 0))
            features.append(context_data.get("accessibility_score", 0.5))
            features.append(context_data.get("weather_risk", 0))
        else:
            features.extend([0, 0.5, 0])  # Default values

        return features

    def _calculate_rule_based_priority(self, damage_assessment: Dict, context_data: Dict = None) -> float:
        """Calculate priority using rule-based approach"""
        base_score = 0

        # Damage level contribution
        damage_level = damage_assessment.get("damage_level", "Minor")
        if damage_level == "Severe":
            base_score += 40
        elif damage_level == "Moderate":
            base_score += 25
        else:
            base_score += 10

        # Confidence contribution
        confidence = damage_assessment.get("confidence_score", 0.5)
        base_score += confidence * 20

        # Context contributions
        if context_data:
            # Population density
            pop_density = context_data.get("population_density", 0)
            base_score += min(pop_density * 10, 20)

            # Weather conditions
            weather_risk = context_data.get("weather_risk", 0)
            base_score += weather_risk * 10

        return min(base_score, 100)

    def _identify_urgency_factors(self, damage_assessment: Dict, context_data: Dict = None) -> List[str]:
        """Identify factors that contribute to urgency"""
        factors = []

        damage_level = damage_assessment.get("damage_level", "Minor")
        if damage_level == "Severe":
            factors.append("Severe structural damage detected")

        confidence = damage_assessment.get("confidence_score", 0.5)
        if confidence > 0.9:
            factors.append("High confidence in assessment")

        if context_data:
            if context_data.get("population_density", 0) > 0.7:
                factors.append("High population density area")

            if context_data.get("weather_risk", 0) > 0.5:
                factors.append("Adverse weather conditions")

            if context_data.get("accessibility_score", 1.0) < 0.3:
                factors.append("Limited accessibility for response teams")

        return factors

    async def predict_resource_demand(self, damage_assessment: Dict, priority_score: Dict) -> Dict:
        """Predict resource requirements"""
        try:
            model = self.models.get('demand_predictor')

            # Prepare features
            demand_features = self._prepare_demand_features(damage_assessment, priority_score)

            if model:
                # Use ML model for prediction
                prediction = model.predict([demand_features])[0]
                resources = self._decode_resource_prediction(prediction)
            else:
                # Use rule-based approach
                resources = self._calculate_rule_based_resources(damage_assessment, priority_score)

            return {
                "medical_personnel": resources.get("medical_personnel", 0),
                "rescue_teams": resources.get("rescue_teams", 0),
                "emergency_vehicles": resources.get("emergency_vehicles", 0),
                "relief_supplies": resources.get("relief_supplies", {}),
                "equipment_needed": resources.get("equipment_needed", []),
                "deployment_timeline": resources.get("deployment_timeline", 24),
                "cost_estimate": resources.get("cost_estimate", 0),
                "confidence_score": resources.get("confidence_score", 0.8)
            }

        except Exception as e:
            logger.error(f"Error predicting resource demand: {e}")
            return self._get_default_resources()

    def _prepare_demand_features(self, damage_assessment: Dict, priority_score: Dict) -> List[float]:
        """Prepare features for resource demand prediction"""
        features = []

        # Damage level
        damage_level = damage_assessment.get("damage_level", "Minor")
        damage_encoding = {"Minor": 1, "Moderate": 2, "Severe": 3}
        features.append(damage_encoding.get(damage_level, 1))

        # Priority score
        features.append(priority_score.get("priority_score", 50) / 100)

        # Confidence scores
        features.append(damage_assessment.get("confidence_score", 0.5))
        features.append(priority_score.get("confidence", 0.8))

        return features

    def _decode_resource_prediction(self, prediction: Any) -> Dict:
        """Decode ML model prediction to resource requirements"""
        # This would depend on how the model was trained
        # For now, using a simple mapping
        if isinstance(prediction, (list, np.ndarray)):
            return {
                "medical_personnel": max(0, int(prediction[0] if len(prediction) > 0 else 2)),
                "rescue_teams": max(0, int(prediction[1] if len(prediction) > 1 else 1)),
                "emergency_vehicles": max(0, int(prediction[2] if len(prediction) > 2 else 1)),
                "confidence_score": 0.85
            }
        else:
            return self._get_default_resources()

    def _calculate_rule_based_resources(self, damage_assessment: Dict, priority_score: Dict) -> Dict:
        """Calculate resource requirements using rules"""
        damage_level = damage_assessment.get("damage_level", "Minor")
        priority = priority_score.get("priority_level", "Low")

        if damage_level == "Severe" or priority == "Critical":
            return {
                "medical_personnel": 10,
                "rescue_teams": 3,
                "emergency_vehicles": 5,
                "relief_supplies": {
                    "food_packages": 100,
                    "water_bottles": 200,
                    "blankets": 50,
                    "medical_kits": 20
                },
                "equipment_needed": ["generators", "tents", "communication_equipment"],
                "deployment_timeline": 2,  # hours
                "cost_estimate": 50000,
                "confidence_score": 0.8
            }
        elif damage_level == "Moderate" or priority == "High":
            return {
                "medical_personnel": 5,
                "rescue_teams": 2,
                "emergency_vehicles": 3,
                "relief_supplies": {
                    "food_packages": 50,
                    "water_bottles": 100,
                    "blankets": 25,
                    "medical_kits": 10
                },
                "equipment_needed": ["first_aid_supplies", "communication_equipment"],
                "deployment_timeline": 6,
                "cost_estimate": 25000,
                "confidence_score": 0.75
            }
        else:
            return {
                "medical_personnel": 2,
                "rescue_teams": 1,
                "emergency_vehicles": 1,
                "relief_supplies": {
                    "food_packages": 20,
                    "water_bottles": 50,
                    "blankets": 10,
                    "medical_kits": 5
                },
                "equipment_needed": ["first_aid_supplies"],
                "deployment_timeline": 12,
                "cost_estimate": 10000,
                "confidence_score": 0.7
            }

    def _get_default_resources(self) -> Dict:
        """Get default resource allocation"""
        return {
            "medical_personnel": 2,
            "rescue_teams": 1,
            "emergency_vehicles": 1,
            "relief_supplies": {
                "food_packages": 20,
                "water_bottles": 50,
                "blankets": 10
            },
            "equipment_needed": ["first_aid_supplies"],
            "deployment_timeline": 12,
            "cost_estimate": 10000,
            "confidence_score": 0.6
        }
