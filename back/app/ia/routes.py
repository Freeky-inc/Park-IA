from fastapi import APIRouter, UploadFile, File
from app.ia.roboflow_detect import detect_parking
from fastapi import APIRouter
from fastapi.responses import JSONResponse
import os
import shutil

router = APIRouter()


UPLOAD_FOLDER = "uploads"
ANNOTATED_IMAGE = "static/annotated.jpg"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("static", exist_ok=True)

@router.post("/detect")
async def detect(file: UploadFile = File(...)):
    # 1. Sauvegarder l'image uploadée
    file_location = os.path.join(UPLOAD_FOLDER, file.filename)
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 2. Appeler la détection
    result = detect_parking(file_location, save_path=ANNOTATED_IMAGE)

    # 3. Retourner les résultats JSON + lien vers l'image annotée
    return JSONResponse(content={
        "places_detectees": result["count"],
        "boxes": result["boxes"],
        "image_url": f"/annotated"
    })