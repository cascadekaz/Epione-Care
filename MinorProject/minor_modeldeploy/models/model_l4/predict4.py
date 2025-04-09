import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model
import uuid
import os

# Load the trained model
MODEL_PATH = r"C:\Users\KIIT\Documents\model_l4\final_model.keras"
model = load_model(MODEL_PATH, compile=False)

def preprocess_image(image_path, target_size=(224, 224)):
    """Preprocesses an input image for model inference."""
    image = cv2.imread(image_path)
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = cv2.resize(image, target_size)
    image = image / 255.0
    return np.expand_dims(image, axis=0)

def predict_mask(image_path):
    """Predicts lung mask for the given image and resizes it to original dimensions."""
    original_image = cv2.imread(image_path)  # Get original dimensions
    original_size = (original_image.shape[1], original_image.shape[0])  # (width, height)
    
    image = preprocess_image(image_path)
    prediction = model.predict(image)[0]  

    mask = (prediction > 0.5).astype(np.uint8) * 255  
    mask_resized = cv2.resize(mask, original_size, interpolation=cv2.INTER_NEAREST)  # Resize mask
    
    return mask_resized


