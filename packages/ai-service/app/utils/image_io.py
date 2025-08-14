# app/utils/image_io.py
import io
import os
import uuid
from typing import Tuple
import numpy as np
from PIL import Image
import cv2
import requests
from urllib.parse import urlparse


def decode_image_bytes(data: bytes) -> Tuple[np.ndarray, str]:
    """
    Decode raw image bytes to an OpenCV BGR ndarray and return the detected
    PIL format string (e.g., 'PNG', 'JPEG', 'WEBP'). Raises ValueError on failure.
    """
    # Try PIL first (handles more formats than some OpenCV builds)
    try:
        with Image.open(io.BytesIO(data)) as im:
            fmt = (im.format or "").upper()
            # Normalize color space for OpenCV
            if im.mode not in ("RGB", "RGBA"):
                im = im.convert("RGB")
            arr = np.array(im)
            if arr.ndim == 2:
                arr = np.stack([arr] * 3, axis=-1)
            if arr.shape[2] == 4:  # drop alpha
                arr = arr[:, :, :3]
            bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
            return bgr, fmt
    except Exception:
        pass

    # Fallback to OpenCV imdecode
    nparr = np.frombuffer(data, dtype=np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Not a valid image or unsupported/corrupt format.")
    return img, "UNKNOWN"


def download_and_normalize_image(file_url: str, upload_directory: str) -> str:
    """
    Download image from URL, normalize it, and save to local directory.
    Returns the local file path.
    """
    try:
        # Validate URL
        parsed_url = urlparse(file_url)
        if not parsed_url.scheme in ['http', 'https']:
            raise ValueError("Only HTTP and HTTPS URLs are supported")

        # Download image with timeout and size limits
        headers = {
            'User-Agent': 'AI-Disaster-Relief-System/1.0'
        }

        response = requests.get(file_url, headers=headers, timeout=30, stream=True)
        response.raise_for_status()

        # Check content type
        content_type = response.headers.get('content-type', '').lower()
        if not content_type.startswith('image/'):
            raise ValueError(f"URL does not point to an image. Content-Type: {content_type}")

        # Check file size (limit to 50MB)
        content_length = response.headers.get('content-length')
        if content_length and int(content_length) > 50 * 1024 * 1024:
            raise ValueError("Image file too large (>50MB)")

        # Read image data with size limit
        image_data = b""
        downloaded_size = 0
        max_size = 50 * 1024 * 1024  # 50MB limit

        for chunk in response.iter_content(chunk_size=8192):
            downloaded_size += len(chunk)
            if downloaded_size > max_size:
                raise ValueError("Image file too large (>50MB)")
            image_data += chunk

        # Decode and validate image
        image_array, format_detected = decode_image_bytes(image_data)

        # Normalize image dimensions (resize if too large)
        height, width = image_array.shape[:2]
        max_dimension = 2048

        if max(height, width) > max_dimension:
            if height > width:
                new_height = max_dimension
                new_width = int(width * (max_dimension / height))
            else:
                new_width = max_dimension
                new_height = int(height * (max_dimension / width))

            image_array = cv2.resize(image_array, (new_width, new_height), interpolation=cv2.INTER_LANCZOS4)

        # Generate unique filename
        file_id = str(uuid.uuid4())

        # Determine file extension from URL or content type
        url_path = parsed_url.path
        if url_path and '.' in url_path:
            file_extension = url_path.split('.')[-1].lower()
        else:
            # Map content type to extension
            extension_map = {
                'image/jpeg': 'jpg',
                'image/jpg': 'jpg',
                'image/png': 'png',
                'image/webp': 'webp',
                'image/bmp': 'bmp',
                'image/tiff': 'tiff'
            }
            file_extension = extension_map.get(content_type, 'jpg')

        # Ensure supported extension
        supported_extensions = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'tiff']
        if file_extension not in supported_extensions:
            file_extension = 'jpg'  # Default to JPEG

        saved_filename = f"{file_id}.{file_extension}"

        # Ensure upload directory exists
        os.makedirs(upload_directory, exist_ok=True)

        # Save normalized image
        file_path = os.path.join(upload_directory, saved_filename)

        # Save based on extension
        if file_extension.lower() in ['jpg', 'jpeg']:
            cv2.imwrite(file_path, image_array, [cv2.IMWRITE_JPEG_QUALITY, 90])
        elif file_extension.lower() == 'png':
            cv2.imwrite(file_path, image_array, [cv2.IMWRITE_PNG_COMPRESSION, 6])
        elif file_extension.lower() == 'webp':
            cv2.imwrite(file_path, image_array, [cv2.IMWRITE_WEBP_QUALITY, 90])
        else:
            cv2.imwrite(file_path, image_array)

        return file_path

    except requests.RequestException as e:
        raise ValueError(f"Failed to download image from URL: {str(e)}")
    except Exception as e:
        raise ValueError(f"Failed to process image: {str(e)}")


def validate_image_file(file_path: str) -> bool:
    """
    Validate that the file at the given path is a valid image.
    """
    try:
        with Image.open(file_path) as img:
            img.verify()
        return True
    except Exception:
        return False
