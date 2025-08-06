"""
Validation Utilities
Helper functions for data validation and file validation
"""
from typing import List, Dict, Any, Optional
import os
import magic
from fastapi import UploadFile

class FileValidator:
    """Utility class for file validation"""

    ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'bmp', 'tiff']
    MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

    @staticmethod
    def validate_image_file(file: UploadFile) -> Dict[str, Any]:
        """Validate uploaded image file"""
        result = {"valid": True, "errors": []}

        # Check filename
        if not file.filename:
            result["valid"] = False
            result["errors"].append("No filename provided")
            return result

        # Check extension
        ext = file.filename.split('.')[-1].lower()
        if ext not in FileValidator.ALLOWED_EXTENSIONS:
            result["valid"] = False
            result["errors"].append(f"File extension '{ext}' not allowed. Allowed: {FileValidator.ALLOWED_EXTENSIONS}")

        # Check file size
        if hasattr(file.file, 'seek'):
            file.file.seek(0, 2)  # Seek to end
            size = file.file.tell()
            file.file.seek(0)  # Reset to beginning

            if size > FileValidator.MAX_FILE_SIZE:
                result["valid"] = False
                result["errors"].append(f"File size {size} exceeds maximum {FileValidator.MAX_FILE_SIZE}")

        return result

    @staticmethod
    def validate_coordinates(latitude: float, longitude: float) -> Dict[str, Any]:
        """Validate geographic coordinates"""
        result = {"valid": True, "errors": []}

        if not (-90 <= latitude <= 90):
            result["valid"] = False
            result["errors"].append(f"Invalid latitude: {latitude}. Must be between -90 and 90")

        if not (-180 <= longitude <= 180):
            result["valid"] = False
            result["errors"].append(f"Invalid longitude: {longitude}. Must be between -180 and 180")

        return result

class DataValidator:
    """Utility class for data validation"""

    @staticmethod
    def validate_damage_level(damage_level: str) -> bool:
        """Validate damage level value"""
        return damage_level in ["Minor", "Moderate", "Severe"]

    @staticmethod
    def validate_priority_level(priority_level: str) -> bool:
        """Validate priority level value"""
        return priority_level in ["Low", "Medium", "High", "Critical"]

    @staticmethod
    def validate_confidence_score(score: float) -> bool:
        """Validate confidence score"""
        return 0.0 <= score <= 1.0

    @staticmethod
    def validate_assessment_data(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate complete assessment data"""
        result = {"valid": True, "errors": []}

        # Required fields
        required_fields = ["damage_level", "confidence_score"]
        for field in required_fields:
            if field not in data:
                result["valid"] = False
                result["errors"].append(f"Missing required field: {field}")

        # Validate damage level
        if "damage_level" in data and not DataValidator.validate_damage_level(data["damage_level"]):
            result["valid"] = False
            result["errors"].append(f"Invalid damage level: {data['damage_level']}")

        # Validate confidence score
        if "confidence_score" in data and not DataValidator.validate_confidence_score(data["confidence_score"]):
            result["valid"] = False
            result["errors"].append(f"Invalid confidence score: {data['confidence_score']}")

        return result
