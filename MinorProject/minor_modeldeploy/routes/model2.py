from fastapi import APIRouter, File, UploadFile, HTTPException
from models.model_l2.predict2 import predict_disease
import time

router = APIRouter()

@router.post("/predict_model2/")
async def predict(file: UploadFile = File(...)):
    try:
        start_time = time.time()
        contents = await file.read()
        
        # Predict
        result = predict_disease(contents)
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])

        result["prediction_time"] = time.time() - start_time
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
