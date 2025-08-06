"""
Data Preprocessing Utilities
Helper functions for data cleaning, transformation, and preparation
"""
import pandas as pd
import numpy as np
from typing import Dict, List, Any, Optional
import json
from datetime import datetime

class DataPreprocessor:
    """Utility class for data preprocessing operations"""

    @staticmethod
    def clean_assessment_data(data: Dict) -> Dict:
        """Clean and validate assessment data"""
        cleaned = {}

        # Ensure required fields exist
        cleaned['damage_level'] = data.get('damage_level', 'Unknown')
        cleaned['confidence_score'] = max(0.0, min(1.0, float(data.get('confidence_score', 0.0))))
        cleaned['processing_time'] = max(0.0, float(data.get('processing_time', 0.0)))

        # Clean location data
        if 'location_data' in data and data['location_data']:
            cleaned['location_data'] = DataPreprocessor._clean_location_data(data['location_data'])

        return cleaned

    @staticmethod
    def _clean_location_data(location_data: Dict) -> Dict:
        """Clean location data"""
        cleaned = {}
        if 'latitude' in location_data:
            cleaned['latitude'] = float(location_data['latitude'])
        if 'longitude' in location_data:
            cleaned['longitude'] = float(location_data['longitude'])
        if 'address' in location_data:
            cleaned['address'] = location_data['address']
        return cleaned

    @staticmethod
    def normalize_features(features: Dict) -> Dict:
        """Normalize feature values"""
        normalized = {}

        # Normalize color features
        if 'color' in features:
            color_features = features['color']
            if 'mean_bgr' in color_features:
                normalized['mean_bgr'] = [x/255.0 for x in color_features['mean_bgr']]
            if 'std_bgr' in color_features:
                normalized['std_bgr'] = [x/255.0 for x in color_features['std_bgr']]

        # Normalize texture features
        if 'texture' in features:
            texture_features = features['texture']
            normalized['texture_energy'] = min(1.0, texture_features.get('energy', 0) / 5000.0)
            normalized['texture_contrast'] = min(1.0, texture_features.get('contrast', 0) / 255.0)

        # Normalize edge features
        if 'edges' in features:
            edge_features = features['edges']
            normalized['edge_density'] = min(1.0, edge_features.get('edge_density', 0))
            normalized['num_contours'] = min(1.0, edge_features.get('num_contours', 0) / 1000.0)

        return normalized

    @staticmethod
    def prepare_ml_features(assessment_data: Dict, context_data: Optional[Dict] = None) -> List[float]:
        """Prepare features for ML model input"""
        features = []

        # Damage level encoding
        damage_encoding = {'Minor': 0, 'Moderate': 1, 'Severe': 2, 'Unknown': -1}
        features.append(damage_encoding.get(assessment_data.get('damage_level', 'Unknown'), -1))

        # Confidence score
        features.append(assessment_data.get('confidence_score', 0.0))

        # Processing time (normalized)
        processing_time = assessment_data.get('processing_time', 0.0)
        features.append(min(1.0, processing_time / 60.0))  # Normalize to minutes

        # Context features
        if context_data:
            features.extend([
                context_data.get('population_density', 0.5),
                context_data.get('accessibility_score', 0.5),
                context_data.get('weather_risk', 0.0)
            ])
        else:
            features.extend([0.5, 0.5, 0.0])  # Default values

        return features

    @staticmethod
    def validate_json_data(data: Any) -> bool:
        """Validate if data can be serialized to JSON"""
        try:
            json.dumps(data)
            return True
        except (TypeError, ValueError):
            return False

    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename for safe storage"""
        import re
        # Remove unsafe characters
        safe_filename = re.sub(r'[^\w\-_\.]', '_', filename)
        # Limit length
        if len(safe_filename) > 100:
            name, ext = safe_filename.rsplit('.', 1) if '.' in safe_filename else (safe_filename, '')
            safe_filename = name[:95] + ('.' + ext if ext else '')
        return safe_filename
