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
