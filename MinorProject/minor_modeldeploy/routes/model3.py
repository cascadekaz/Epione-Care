from fastapi import APIRouter, UploadFile, File
from models.model_l3.predict3 import predict_disease

router = APIRouter()

@router.post("/predict_model3/")
async def predict(file: UploadFile = File(...)):
    try:
        file_bytes = await file.read()
        result = predict_disease(file_bytes)
        return result
    except Exception as e:
        return {"error": str(e)}
