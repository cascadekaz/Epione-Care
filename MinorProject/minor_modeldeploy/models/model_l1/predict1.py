import numpy as np
from PIL import Image
import base64
import io
from io import BytesIO
from tensorflow.keras.models import load_model

def load_and_preprocess_image(file, target_size):
    """Loads and preprocesses an image."""
    try:
        img = Image.open(io.BytesIO(file))
        if img.mode != 'RGB':
            img = img.convert('RGB')
        img = img.resize(target_size)
        img_array = np.array(img)
        img_array = np.expand_dims(img_array, axis=0) / 255.0
        return img_array
    except Exception as e:
        raise ValueError(f"Error processing the image: {str(e)}")

def load_trained_model(model_path):
    """Loads a trained model from the given path."""
    try:
        return load_model(model_path)
    except Exception as e:
        raise ValueError(f"Error loading model: {str(e)}")
