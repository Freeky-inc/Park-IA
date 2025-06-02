from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from app.map.maps import randomize_images_and_find_closest, get_route

router = APIRouter()

@router.post("/detect")
async def randomize_images(request: Request):
    data = await request.json()
    center_lat = data["lat"]
    center_lon = data["lon"]
    randomized, closest = randomize_images_and_find_closest(center_lat, center_lon)
    # Appel à OMS/ORS pour générer le trajet
    route = get_route(center_lat, center_lon, closest['lat'], closest['lon'])
    return JSONResponse({"randomized": randomized, "closest": closest, "route": route})