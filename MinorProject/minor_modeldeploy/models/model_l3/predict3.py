import numpy as np
import cv2
import tensorflow as tf
from tensorflow.keras.models import load_model
from io import BytesIO
from PIL import Image
import base64

# Define and register the custom metric

def iou_metric(y_true, y_pred):
    y_true = tf.cast(y_true, tf.float32)
    y_pred = tf.cast(y_pred > 0.5, tf.float32)  # Convert predictions to binary
    intersection = tf.reduce_sum(y_true * y_pred)
    union = tf.reduce_sum(y_true) + tf.reduce_sum(y_pred) - intersection
    return intersection / (union + tf.keras.backend.epsilon())

# Register the custom metric
tf.keras.utils.get_custom_objects()["iou_metric"] = iou_metric

# Load trained model
modelpath = r"C:\Users\KIIT\Documents\MinorProject\minor_modeldeploy\models\model_l3\mobileNet_model_v2.keras"
model = load_model(modelpath, custom_objects={"iou_metric": iou_metric})

# Define class labels
class_labels = {0: "Normal", 1: "Tuberculosis"}  # Modify if needed

def preprocess_image(file: bytes, target_size=(224, 224)):
    try:
        image = Image.open(BytesIO(file)).convert("RGB")
        image = np.array(image)
        image = cv2.resize(image, target_size)
        image = image / 255.0  # Normalize
        image = np.expand_dims(image, axis=0)  
        return image
    except Exception as e:
        raise ValueError(f"Image preprocessing error: {str(e)}")

def predict_disease(file: bytes):
    try:
        # Preprocess
        input_image = preprocess_image(file)
        prediction = model.predict(input_image)

        # Extract confidence and label
        confidence = float(prediction.flatten()[0])
        predicted_class = int(confidence > 0.5)
        label = class_labels.get(predicted_class, "Unknown")

        # Convert preprocessed image back to displayable base64
        img_uint8 = (input_image[0] * 255).astype(np.uint8)
        img_pil = Image.fromarray(img_uint8, mode="RGB")
        buffered = BytesIO()
        img_pil.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")

        return {
            "model": "Tuberculosis Detection",
            "label": label,
            "confidence": confidence
          
        }

    except Exception as e:
        return {"error": f"Prediction error: {str(e)}"}

 