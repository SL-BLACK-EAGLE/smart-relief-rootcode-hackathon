"""
Image Processing Utilities
Helper functions for image manipulation and processing
"""
import cv2
import numpy as np
from PIL import Image
import os
from typing import Tuple, Optional

class ImageProcessor:
    """Utility class for image processing operations"""

    @staticmethod
    def resize_image(image_path: str, target_size: Tuple[int, int] = (512, 512)) -> np.ndarray:
        """Resize image to target size"""
        image = cv2.imread(image_path)
        if image is None:
            raise ValueError(f"Could not load image from {image_path}")
        return cv2.resize(image, target_size)

    @staticmethod
    def normalize_image(image: np.ndarray) -> np.ndarray:
        """Normalize image pixel values to 0-1 range"""
        return image.astype(np.float32) / 255.0

    @staticmethod
    def enhance_contrast(image: np.ndarray, alpha: float = 1.5, beta: int = 10) -> np.ndarray:
        """Enhance image contrast"""
        return cv2.convertScaleAbs(image, alpha=alpha, beta=beta)

    @staticmethod
    def apply_gaussian_blur(image: np.ndarray, kernel_size: int = 5) -> np.ndarray:
        """Apply Gaussian blur to reduce noise"""
        return cv2.GaussianBlur(image, (kernel_size, kernel_size), 0)

    @staticmethod
    def convert_to_grayscale(image: np.ndarray) -> np.ndarray:
        """Convert image to grayscale"""
        if len(image.shape) == 3:
            return cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        return image

    @staticmethod
    def save_processed_image(image: np.ndarray, output_path: str) -> bool:
        """Save processed image to file"""
        try:
            cv2.imwrite(output_path, image)
            return os.path.exists(output_path)
        except Exception:
            return False
