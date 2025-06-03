from fastapi import APIRouter
from fastapi.responses import JSONResponse
from app.map.maps import randomize_images_and_find_closest, get_route
from pydantic import BaseModel
import requests
import os
from app.ia.roboflow_detect import detect_parking
from app.map.maps import UPLOADS_DIR, haversine

router = APIRouter()

class Position(BaseModel):
    lat: float
    lon: float

@router.post("/trajet")
async def randomize_images(position: Position):
    center_lat = position.lat
    center_lon = position.lon
    randomized, _ = randomize_images_and_find_closest(center_lat, center_lon)
    
    # Trier les points du plus proche au plus éloigné
    sorted_points = sorted(
        randomized,
        key=lambda img: haversine(center_lat, center_lon, img['lat'], img['lon'])
    )
    
    for point in sorted_points:
        image_path = os.path.join(UPLOADS_DIR, point['filename'])
        result = detect_parking(image_path)
        if result["count"] > 0:  # Il y a au moins une place libre
            route = get_route(center_lat, center_lon, point['lat'], point['lon'])
            return JSONResponse({
                "randomized": randomized,
                "closest": {
                    "lat": point['lat'],
                    "lon": point['lon'],
                    "filename": point['filename'],
                    "places": result["count"]
                },
                "route": route
            })
    # Si aucune place libre trouvée
    return JSONResponse({
        "randomized": randomized,
        "closest": None,
        "route": None,
        "message": "Aucune place libre trouvée"
    })

@router.get("/geocode")
async def geocode_proxy(q: str):
    url = "https://nominatim.openstreetmap.org/search"
    params = {"format": "json", "q": q, "limit": 1}
    headers = {
        "Accept-Language": "fr",
        "User-Agent": "ParkIA/1.0"  # <-- Ajoute un User-Agent personnalisé
    }
    r = requests.get(url, params=params, headers=headers)
    try:
        return r.json()
    except Exception:
        return {"error": "Nominatim error", "status_code": r.status_code, "text": r.text}