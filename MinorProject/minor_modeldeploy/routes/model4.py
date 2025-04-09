from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
import shutil
import os
import cv2
from models.model_l4.predict4 import predict_mask

router = APIRouter()

UPLOAD_DIR = "uploads"
MASK_DIR = "static/masks"
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(MASK_DIR, exist_ok=True)

@router.post("/predict_model4/")
async def predict(file: UploadFile = File(...)):
    """Handles image upload and returns the predicted lung mask image."""
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save uploaded image
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Predict mask (returns path to saved mask image)
    mask_path = predict_mask(file_path)

    # Optional cleanup of uploaded image if you want
    os.remove(file_path)

    return FileResponse(mask_path, media_type="image/png")
