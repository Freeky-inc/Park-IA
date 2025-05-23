from fastapi import File, UploadFile, APIRouter
import numpy as np
from http.client import HTTPException
import cv2
import base64

router = APIRouter()


@router.post("/gray_img")
async def show_uploaded_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Seules les images sont acceptées")

    try:
        contents = await file.read()
        img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)
        if img is None:
            raise HTTPException(status_code=400, detail="Image invalide ou illisible")

        # Fix: Correct constant name for grayscale conversion
        gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        # Save grayscale image
        gray_path = "static/gray_" + file.filename
        cv2.imwrite(gray_path, gray_img)
        
        # Convert to base64
        _, buffer = cv2.imencode('.jpg', gray_img)
        img_base64 = base64.b64encode(buffer).decode("utf-8")

        return {
            "image_base64": f"data:image/jpeg;base64,{img_base64}",
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    

    # router = APIRouter(tags=["AI"]) pour trier sur Swagger