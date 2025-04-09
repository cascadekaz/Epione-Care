from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from models.model_l1.predict1 import load_and_preprocess_image, load_trained_model
import base64
import io
from io import BytesIO
import traceback
import numpy as np
from PIL import Image


router = APIRouter()

# Load the model for Model 1
model_path = "C:/Users/KIIT/Documents/MinorProject/minor_modeldeploy/models/model_l1/mobileNet_model.keras"
model = load_trained_model(model_path)

@router.post("/predict_model1/")
async def predict(file: UploadFile = File(...)):
    """Handles image upload and prediction for Model 1."""
    try:
        contents = await file.read()
        img_array = load_and_preprocess_image(contents, target_size=(224, 224))
        prediction = model.predict(img_array)[0][0]  
        label = 'Normal' if prediction < 0.5 else 'Pneumonia'
        img_data = (img_array[0] * 255).astype(np.uint8)
        if img_data.shape[-1] == 1:
              img_data = np.concatenate([img_data] * 3, axis=-1)
        elif img_data.shape[-1] != 3:
              raise ValueError("Expected 3-channel RGB image, got shape: " + str(img_data.shape))
        img = Image.fromarray(img_data, mode='RGB')
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode("utf-8")


        return JSONResponse(content={"model": "Pneumonia Detection", "label": label, "confidence": float(prediction),   "preprocessed_image": img_base64 })
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
