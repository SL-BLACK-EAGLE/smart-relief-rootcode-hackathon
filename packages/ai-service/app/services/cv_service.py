import asyncio
import logging
import os
from typing import Dict, List, Tuple, Optional, Union

import cv2
import numpy as np
from PIL import Image

from ..config.settings import get_settings

logger = logging.getLogger(__name__)


class CVService:
    """Computer Vision service for disaster image analysis"""

    def __init__(self):
        self.settings = get_settings()
        self.damage_classes = ["Minimal", "Minor", "Moderate", "Severe", "Critical"]

    async def analyze_damage(self, image_path: str, debug: bool = False) -> Dict:
        """Comprehensive damage analysis using computer vision"""
        try:
            abs_path = os.path.abspath(image_path)
            cwd = os.getcwd()
            if not os.path.exists(image_path):
                logger.error(f"Image not found at {image_path} (absolute: {abs_path}, cwd: {cwd})")
                raise FileNotFoundError(f"Image not found at {image_path} (absolute: {abs_path}, cwd: {cwd})")

            image_cv = await asyncio.to_thread(cv2.imread, image_path)
            if image_cv is None:
                logger.error(f"cv2.imread failed to load image at {image_path} (absolute: {abs_path})")
                # Try PIL for diagnostics
                try:
                    with Image.open(image_path) as img:
                        img.verify()
                    logger.error("PIL can open the image, but OpenCV cannot. Check image format compatibility.")
                except Exception as pil_e:
                    logger.error(f"PIL also failed to open image: {pil_e}")
                raise ValueError(f"Could not load image from {image_path} (absolute: {abs_path})")

            preprocessing_result = await self.preprocess_image(image_path)
            # Use ndarray to avoid re-reading from disk
            damage_indicators = await asyncio.to_thread(self._detect_damage_indicators, image_cv)
            damage_score = self._calculate_damage_score(damage_indicators)
            damage_level = self._classify_damage_level(damage_score)
            confidence = self._calculate_confidence(damage_indicators)

            debug_image_path = None
            if debug:
                debug_image_path = await asyncio.to_thread(
                    self._generate_debug_visualization, image_path, damage_indicators
                )

            return {
                "damage_level": damage_level,
                "damage_score": float(damage_score),
                "confidence_score": float(confidence),
                "indicators": damage_indicators,
                "preprocessing": preprocessing_result,
                "analysis_method": "computer_vision",
                "debug_image_path": debug_image_path,
            }

        except Exception as e:
            logger.error(f"CV damage analysis failed: {str(e)}")
            return {
                "damage_level": "Minimal",
                "damage_score": 0.0,
                "confidence_score": 0.0,
                "error": str(e),
            }

    async def assess_infrastructure_damage(self, image_path: str) -> Dict:
        """Assess infrastructure-specific damage indicators"""
        try:
            abs_path = os.path.abspath(image_path)
            cwd = os.getcwd()

            if not os.path.exists(image_path):
                logger.error(f"Image not found at {image_path} (absolute: {abs_path}, cwd: {cwd})")
                raise FileNotFoundError(f"Image not found at {image_path} (absolute: {abs_path}, cwd: {cwd})")

            image = await asyncio.to_thread(cv2.imread, image_path)
            if image is None:
                logger.error(f"Could not load image from {image_path} (absolute: {abs_path}, cwd: {cwd})")
                raise ValueError(f"Could not load image from {image_path} (absolute: {abs_path}, cwd: {cwd})")

            structural_analysis = await asyncio.to_thread(self._analyze_structural_integrity, image)
            safety_analysis = await asyncio.to_thread(self._assess_safety_conditions, image)
            accessibility_analysis = await asyncio.to_thread(self._check_accessibility, image)
            utilities_analysis = await asyncio.to_thread(self._assess_utilities_damage, image)

            return {
                "structural_integrity": structural_analysis["status"],
                "structural_integrity_score": structural_analysis["score"],
                "safety_level": safety_analysis["level"],
                "safety_score": safety_analysis["score"],
                "accessibility": accessibility_analysis["status"],
                "accessibility_score": accessibility_analysis["score"],
                "utilities_status": utilities_analysis["status"],
                "utilities_affected": utilities_analysis["affected"],
                "evacuation_needed": safety_analysis["score"] <= 3.0,
                "road_access_blocked": accessibility_analysis["score"] <= 4.0,
                "overall_infrastructure_score": (
                    structural_analysis["score"]
                    + safety_analysis["score"]
                    + accessibility_analysis["score"]
                )
                / 3.0,
            }

        except Exception as e:
            logger.error(f"Infrastructure assessment failed: {str(e)}")
            return {
                "structural_integrity": "Unknown",
                "safety_level": "Unknown",
                "accessibility": "Unknown",
                "utilities_status": "Unknown",
                "error": str(e),
            }

    async def detect_damage(self, features: Dict) -> Dict:
        """Detect damage from extracted features (for API compatibility)"""
        try:
            edge_density = features.get("edges", {}).get("edge_density", 0)
            color_variance = sum(features.get("color", {}).get("std_bgr", [0, 0, 0])) / 3
            texture_energy = features.get("texture", {}).get("energy", 0)

            damage_score = min(1.0, (edge_density * 2 + color_variance / 100 + texture_energy / 1000) / 3)

            damage_level = self._classify_damage_level(damage_score)
            confidence_score = 0.7 + (damage_score * 0.2)

            return {
                "damage_level": damage_level,
                "damage_score": float(damage_score),
                "confidence_score": float(confidence_score),
                "analysis_method": "feature_based",
            }
        except Exception as e:
            logger.error(f"Feature-based damage detection failed: {str(e)}")
            return {
                "damage_level": "Minimal",
                "damage_score": 0.0,
                "confidence_score": 0.5,
                "error": str(e),
            }

    async def analyze_infrastructure(self, image_path: str, damage_data: Dict) -> Dict:
        """Analyze infrastructure impact (for API compatibility)"""
        try:
            infrastructure_result = await self.assess_infrastructure_damage(image_path)
            combined_analysis = {
                **infrastructure_result,
                "damage_context": damage_data,
                "recommendations": self._generate_infrastructure_recommendations(
                    infrastructure_result, damage_data
                ),
            }
            return combined_analysis
        except Exception as e:
            logger.error(f"Infrastructure analysis failed: {str(e)}")
            return {"error": str(e), "recommendations": ["Unable to analyze infrastructure impact"]}

    def _generate_infrastructure_recommendations(self, infrastructure: Dict, damage_data: Dict) -> List[str]:
        """Generate infrastructure-specific recommendations"""
        recommendations: List[str] = []

        if infrastructure.get("evacuation_needed", False):
            recommendations.append("Immediate evacuation required")

        if infrastructure.get("road_access_blocked", False):
            recommendations.append("Clear access routes for emergency vehicles")

        if infrastructure.get("utilities_status") == "Severely Affected":
            recommendations.append("Priority utility restoration needed")

        safety_score = infrastructure.get("safety_score", 10)
        if safety_score <= 3:
            recommendations.append("Area is unsafe - restrict access")
        elif safety_score <= 6:
            recommendations.append("Exercise caution when entering area")

        if not recommendations:
            recommendations.append("Monitor situation for changes")

        return recommendations

    async def preprocess_image(self, image_path: str) -> Dict:
        """Preprocess image for analysis"""
        try:
            image = await asyncio.to_thread(cv2.imread, image_path)
            if image is None:
                abs_path = os.path.abspath(image_path)
                raise ValueError(f"Could not load image from {image_path} (absolute: {abs_path})")

            original_height, original_width = image.shape[:2]
            processed_image = await asyncio.to_thread(cv2.resize, image, (512, 512))
            enhanced_image = await asyncio.to_thread(self._enhance_image, processed_image)
            features = await asyncio.to_thread(self._extract_features, enhanced_image)

            return {
                "original_dimensions": (original_width, original_height),
                "processed_dimensions": (512, 512),
                "features": features,
                "enhancement_applied": True,
                "status": "success",
            }

        except Exception as e:
            logger.error(f"Image preprocessing failed: {str(e)}")
            return {"status": "error", "error": str(e)}

    def _generate_debug_visualization(self, image_path: str, indicators: Dict) -> str:
        """Generate annotated debug image showing detection areas"""
        try:
            image = cv2.imread(image_path)
            if image is None:
                raise ValueError(f"Could not load image from {image_path}")

            output = image.copy()
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            output[edges > 0] = (0, 0, 255)  # red for cracks

            debris_mask = self._create_debris_mask(gray)
            output[debris_mask > 0] = (0, 255, 255)  # yellow for debris

            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            damage_colors = [([10, 50, 50], [25, 255, 200]), ([0, 0, 50], [180, 30, 150])]
            for lower, upper in damage_colors:
                mask = cv2.inRange(hsv, np.array(lower), np.array(upper))
                output[mask > 0] = (255, 0, 0)  # blue for color anomalies

            cv2.putText(output, f"ColorScore: {indicators['color_score']:.2f}", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(output, f"TextureScore: {indicators['texture_score']:.2f}", (10, 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
            cv2.putText(output, f"EdgeScore: {indicators['edge_score']:.2f}", (10, 90),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)

            debug_path = os.path.splitext(image_path)[0] + "_debug.jpg"
            cv2.imwrite(debug_path, output)
            return debug_path

        except Exception as e:
            logger.error(f"Debug visualization failed: {str(e)}")
            return ""

    # -------- detection helpers --------

    def _detect_damage_indicators(self, image_or_path: Union[str, np.ndarray]) -> Dict:
        """Detect damage indicators (accepts path or ndarray)."""
        try:
            if isinstance(image_or_path, str):
                image = cv2.imread(image_or_path)
            else:
                image = image_or_path

            if image is None:
                raise ValueError("Could not load image.")

            color_damage = self._detect_color_anomalies(image)
            texture_damage = self._detect_texture_anomalies(image)
            edge_damage = self._detect_edge_anomalies(image)
            debris_detected = self._detect_debris(image)
            deformation = self._detect_structural_deformation(image)

            if (color_damage < 0.2 and texture_damage < 0.2 and edge_damage < 0.2 and
                debris_detected < 0.2 and deformation < 0.2):
                return {
                    "color_based": False, "texture_based": False, "edge_based": False,
                    "debris_present": False, "structural_deformation": False,
                    "color_score": 0.0, "texture_score": 0.0, "edge_score": 0.0,
                    "debris_score": 0.0, "deformation_score": 0.0,
                }

            return {
                "color_based": color_damage > 0.5,
                "texture_based": texture_damage > 0.5,
                "edge_based": edge_damage > 0.4,
                "debris_present": debris_detected > 0.5,
                "structural_deformation": deformation > 0.5,
                "color_score": float(color_damage),
                "texture_score": float(texture_damage),
                "edge_score": float(edge_damage),
                "debris_score": float(debris_detected),
                "deformation_score": float(deformation),
            }
        except Exception as e:
            logger.error(f"Damage indicator detection failed: {str(e)}")
            return {
                "color_based": False, "texture_based": False, "edge_based": False,
                "debris_present": False, "structural_deformation": False,
                "color_score": 0.0, "texture_score": 0.0, "edge_score": 0.0,
                "debris_score": 0.0, "deformation_score": 0.0,
            }

    def _create_debris_mask(self, gray_image: np.ndarray) -> np.ndarray:
        try:
            blur = cv2.GaussianBlur(gray_image, (5, 5), 0)
            diff = cv2.absdiff(gray_image, blur)
            _, mask = cv2.threshold(diff, 25, 255, cv2.THRESH_BINARY)
            kernel = np.ones((3, 3), np.uint8)
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
            return mask
        except Exception as e:
            logger.error(f"Debris mask creation failed: {str(e)}")
            return np.zeros_like(gray_image)

    def _detect_color_anomalies(self, image: np.ndarray) -> float:
        try:
            hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
            damage_colors = [
                ([10, 50, 50], [25, 255, 200]),   # rust/brown
                ([0, 0, 0], [180, 30, 100]),      # dark/smoke
                ([160, 50, 50], [180, 255, 255])  # red
            ]
            total_damage_pixels = 0
            total_pixels = image.shape[0] * image.shape[1]
            for lower, upper in damage_colors:
                mask = cv2.inRange(hsv, np.array(lower), np.array(upper))
                total_damage_pixels += int(np.count_nonzero(mask))
            return min(1.0, total_damage_pixels / (total_pixels * 0.3))
        except Exception as e:
            logger.error(f"Color anomaly detection failed: {str(e)}")
            return 0.0

    def _detect_texture_anomalies(self, image: np.ndarray) -> float:
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            lbp = self._calculate_lbp(gray)
            hist = cv2.calcHist([lbp], [0], None, [256], [0, 256]).flatten()
            hist = hist / (np.sum(hist) + 1e-10)
            entropy = -np.sum(hist * np.log2(hist + 1e-12))
            max_entropy = 8.0
            return min(1.0, entropy / max_entropy)
        except Exception as e:
            logger.error(f"Texture anomaly detection failed: {str(e)}")
            return 0.0

    def _calculate_lbp(self, gray: np.ndarray, radius: int = 1, n_points: int = 8) -> np.ndarray:
        try:
            h, w = gray.shape
            lbp = np.zeros((h, w), dtype=np.uint8)
            for i in range(radius, h - radius):
                for j in range(radius, w - radius):
                    center = gray[i, j]
                    code = 0
                    for p in range(n_points):
                        angle = 2 * np.pi * p / n_points
                        x = int(round(i + radius * np.cos(angle)))
                        y = int(round(j + radius * np.sin(angle)))
                        if 0 <= x < h and 0 <= y < w:
                            if gray[x, y] >= center:
                                code |= (1 << p)
                    lbp[i, j] = code
            return lbp
        except Exception as e:
            logger.error(f"LBP calculation failed: {str(e)}")
            return np.zeros_like(gray)

    def _detect_edge_anomalies(self, image: np.ndarray) -> float:
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150, apertureSize=3)
            edge_pixels = int(np.count_nonzero(edges))
            total_pixels = edges.shape[0] * edges.shape[1]
            edge_density = edge_pixels / max(total_pixels, 1)

            lines = cv2.HoughLines(edges, 1, np.pi / 180, threshold=100)
            line_count = len(lines) if lines is not None else 0

            edge_score = min(1.0, edge_density * 10)
            line_score = min(1.0, line_count / 50)
            return (edge_score + line_score) / 2
        except Exception as e:
            logger.error(f"Edge anomaly detection failed: {str(e)}")
            return 0.0

    def _detect_debris(self, image: np.ndarray) -> float:
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            debris_mask = self._create_debris_mask(gray)
            contours, _ = cv2.findContours(debris_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            debris_contours = []
            for contour in contours:
                area = cv2.contourArea(contour)
                if 50 < area < 5000:
                    perimeter = cv2.arcLength(contour, True)
                    if perimeter > 0:
                        circularity = 4 * np.pi * area / (perimeter * perimeter)
                        if 0.1 < circularity < 0.9:
                            debris_contours.append(contour)
            debris_count = len(debris_contours)
            total_debris_area = sum(cv2.contourArea(c) for c in debris_contours)
            image_area = image.shape[0] * image.shape[1]
            count_score = min(1.0, debris_count / 20)
            area_score = min(1.0, total_debris_area / (image_area * 0.1))
            return (count_score + area_score) / 2
        except Exception as e:
            logger.error(f"Debris detection failed: {str(e)}")
            return 0.0

    def _detect_structural_deformation(self, image: np.ndarray) -> float:
        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            edges = cv2.Canny(gray, 50, 150)
            lines = cv2.HoughLines(edges, 1, np.pi / 180, threshold=100)
            if lines is None or len(lines) < 5:
                return 0.0
            angles: List[float] = []
            for line in lines:
                rho, theta = line[0]
                angle = theta * 180 / np.pi
                angles.append(angle)
            expected_angles = [0, 45, 90, 135]
            deformation_score = 0.0
            for angle in angles:
                min_dev = min(abs(angle - expected) for expected in expected_angles)
                if min_dev > 15:
                    deformation_score += 0.1
            return min(1.0, deformation_score)
        except Exception as e:
            logger.error(f"Structural deformation detection failed: {str(e)}")
            return 0.0

    def _calculate_damage_score(self, indicators: Dict) -> float:
        try:
            scores = [
                indicators.get("color_score", 0.0) * 0.25,
                indicators.get("texture_score", 0.0) * 0.25,
                indicators.get("edge_score", 0.0) * 0.20,
                indicators.get("debris_score", 0.0) * 0.20,
                indicators.get("deformation_score", 0.0) * 0.10,
            ]
            return float(sum(scores))
        except Exception as e:
            logger.error(f"Damage score calculation failed: {str(e)}")
            return 0.0

    def _classify_damage_level(self, damage_score: float) -> str:
        if damage_score >= 0.8:
            return "Critical"
        elif damage_score >= 0.6:
            return "Severe"
        elif damage_score >= 0.4:
            return "Moderate"
        elif damage_score >= 0.2:
            return "Minor"
        else:
            return "Minimal"

    def _calculate_confidence(self, indicators: Dict) -> float:
        try:
            detected = sum(
                [
                    indicators.get("color_based", False),
                    indicators.get("texture_based", False),
                    indicators.get("edge_based", False),
                    indicators.get("debris_present", False),
                    indicators.get("structural_deformation", False),
                ]
            )
            base_conf = 0.6 + (detected * 0.08)
            scores = [
                indicators.get("color_score", 0.0),
                indicators.get("texture_score", 0.0),
                indicators.get("edge_score", 0.0),
                indicators.get("debris_score", 0.0),
                indicators.get("deformation_score", 0.0),
            ]
            score_std = float(np.std(scores)) if scores else 0.5
            consistency_bonus = max(0.0, 0.3 - score_std)
            return float(min(0.95, base_conf + consistency_bonus))
        except Exception as e:
            logger.error(f"Confidence calculation failed: {str(e)}")
            return 0.6

    # -------- infra summaries --------

    def _analyze_structural_integrity(self, image: np.ndarray) -> Dict:
        try:
            damage_score = self._detect_structural_deformation(image)
            if damage_score >= 0.7:
                status, score = "Critical", 2.0
            elif damage_score >= 0.5:
                status, score = "Compromised", 4.0
            elif damage_score >= 0.3:
                status, score = "Damaged", 6.0
            elif damage_score >= 0.1:
                status, score = "Minor Issues", 8.0
            else:
                status, score = "Stable", 10.0
            return {"status": status, "score": score}
        except Exception as e:
            logger.error(f"Structural integrity analysis failed: {str(e)}")
            return {"status": "Unknown", "score": 5.0}

    def _assess_safety_conditions(self, image: np.ndarray) -> Dict:
        """Assess safety conditions for emergency response"""
        try:
            debris_score = self._detect_debris(image)
            # FIX: analyze the already-loaded image
            damage_indicators = self._detect_damage_indicators(image)

            safety_factors = [
                (1.0 - debris_score) * 0.4,
                (1.0 - damage_indicators.get("edge_score", 0.0)) * 0.3,
                (1.0 - damage_indicators.get("deformation_score", 0.0)) * 0.3,
            ]
            safety_score = sum(safety_factors) * 10

            if safety_score >= 8:
                level = "Safe"
            elif safety_score >= 6:
                level = "Caution"
            elif safety_score >= 4:
                level = "Unsafe"
            else:
                level = "Dangerous"

            return {"level": level, "score": safety_score}
        except Exception as e:
            logger.error(f"Safety assessment failed: {str(e)}")
            return {"level": "Unknown", "score": 5.0}

    def _check_accessibility(self, image: np.ndarray) -> Dict:
        try:
            debris_score = self._detect_debris(image)
            if debris_score >= 0.7:
                status, score = "Blocked", 2.0
            elif debris_score >= 0.5:
                status, score = "Partially Blocked", 4.0
            elif debris_score >= 0.3:
                status, score = "Limited Access", 6.0
            elif debris_score >= 0.1:
                status, score = "Minor Obstacles", 8.0
            else:
                status, score = "Clear", 10.0
            return {"status": status, "score": score}
        except Exception as e:
            logger.error(f"Accessibility check failed: {str(e)}")
            return {"status": "Unknown", "score": 5.0}

    def _assess_utilities_damage(self, image: np.ndarray) -> Dict:
        try:
            edge_score = self._detect_edge_anomalies(image)
            affected = []
            if edge_score > 0.6:
                affected.extend(["Power Lines", "Communication"])
            if edge_score > 0.4:
                affected.append("Water Supply")
            if edge_score > 0.8:
                affected.append("Gas Lines")
            status = "Operational" if not affected else ("Partially Affected" if len(affected) <= 2 else "Severely Affected")
            return {"status": status, "affected": affected}
        except Exception as e:
            logger.error(f"Utilities assessment failed: {str(e)}")
            return {"status": "Unknown", "affected": []}

    def _enhance_image(self, image: np.ndarray) -> np.ndarray:
        try:
            lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
            clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
            lab[:, :, 0] = clahe.apply(lab[:, :, 0])
            enhanced = cv2.cvtColor(lab, cv2.COLOR_LAB2BGR)
            kernel = np.array([[-1, -1, -1], [-1, 9, -1], [-1, -1, -1]])
            sharpened = cv2.filter2D(enhanced, -1, kernel)
            return sharpened
        except Exception as e:
            logger.error(f"Image enhancement failed: {str(e)}")
            return image

    def _extract_features(self, image: np.ndarray) -> Dict:
        try:
            mean_bgr = np.mean(image, axis=(0, 1)).tolist()
            std_bgr = np.std(image, axis=(0, 1)).tolist()

            data = image.reshape((-1, 3)).astype(np.float32)
            criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 10, 1.0)
            _, labels, centers = cv2.kmeans(data, 3, None, criteria, 10, cv2.KMEANS_RANDOM_CENTERS)
            dominant_colors = centers.astype(int).tolist()

            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            glcm = self._calculate_glcm(gray)

            edges = cv2.Canny(gray, 50, 150)
            edge_density = float(np.count_nonzero(edges)) / float(edges.shape[0] * edges.shape[1])
            contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

            return {
                "color": {"mean_bgr": mean_bgr, "std_bgr": std_bgr, "dominant_colors": dominant_colors},
                "texture": {"energy": float(glcm.get("energy", 0)), "contrast": float(glcm.get("contrast", 0))},
                "edges": {"edge_density": float(edge_density), "num_contours": int(len(contours))},
            }
        except Exception as e:
            logger.error(f"Feature extraction failed: {str(e)}")
            return {}

    def _calculate_glcm(self, gray: np.ndarray) -> Dict:
        try:
            levels = 32
            normalized = (gray.astype(np.float32) / 256.0 * levels).astype(np.uint8)
            glcm = np.zeros((levels, levels), dtype=np.float32)
            h, w = normalized.shape
            for i in range(h):
                row = normalized[i]
                for j in range(w - 1):
                    glcm[row[j], row[j + 1]] += 1.0
            glcm_sum = np.sum(glcm)
            if glcm_sum == 0:
                return {"energy": 0.0, "contrast": 0.0}
            glcm /= glcm_sum
            energy = float(np.sum(glcm ** 2))
            i = np.arange(levels).reshape(-1, 1)
            j = np.arange(levels).reshape(1, -1)
            contrast = float(np.sum(glcm * (i - j) ** 2))
            return {"energy": energy, "contrast": contrast}
        except Exception as e:
            logger.error(f"GLCM calculation failed: {str(e)}")
            return {"energy": 0.0, "contrast": 0.0}
