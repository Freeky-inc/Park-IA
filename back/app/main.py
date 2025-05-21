import base64
from http.client import HTTPException

import cv2
import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse, FileResponse
import shutil
import os
from app.roboflow_detect import detect_parking
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ou remplace "*" par une liste d'origines autorisées
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"
ANNOTATED_IMAGE = "static/annotated.jpg"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs("static", exist_ok=True)

@app.post("/detect")
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



# Endpoint pour traiter une image upload (grayscale) et retourner le résultat en base64
@app.post("/show-uploaded")
async def show_uploaded_image(file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Seules les images sont acceptées")

    contents = await file.read()
    img = cv2.imdecode(np.frombuffer(contents, np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise HTTPException(status_code=400, detail="Image invalide ou illisible")

    # Exemple de traitement : conversion en niveaux de gris
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    _, buffer = cv2.imencode('.jpg', gray_img)
    img_base64 = base64.b64encode(buffer).decode("utf-8")

    return {
        "filename": file.filename,
        "image_base64": img_base64}

