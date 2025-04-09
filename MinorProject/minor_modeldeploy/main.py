from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from routes import model1, model2, model3, model4

app = FastAPI()

# Include different model routes
app.include_router(model1.router, prefix="/api")
app.include_router(model2.router, prefix="/api")
app.include_router(model3.router, prefix="/api")
app.include_router(model4.router,prefix="/api")


@app.get("/", response_class=HTMLResponse)
async def main():
    content = """
    <html>
        <head><title>AI Model Predictor</title></head>
        <body>
            <h2>Upload an Image to Predict</h2>
            <form action="/api/predict_model1/" method="post" enctype="multipart/form-data">
                <input type="file" name="file" accept="image/*">
                <input type="submit" value="Upload to Model 1">
            </form>
             <form action="/api/predict_model2/" method="post" enctype="multipart/form-data">
                <input type="file" name="file" accept="image/*">
                <input type="submit" value="Upload to Model 2">
            </form>
            <form action="/api/predict_model3/" method="post" enctype="multipart/form-data">
                <input type="file" name="file" accept="image/*">
                <input type="submit" value="Upload to Model 3">
            </form>
             <form action="/api/predict_model4/" method="post" enctype="multipart/form-data">
                <input type="file" name="file" accept="image/*">
                <input type="submit" value="Upload to Model 4">
            </form>
        </body>
    </html>
    """
    return HTMLResponse(content=content)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8001)
