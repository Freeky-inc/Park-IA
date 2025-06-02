import random
import math
import os
import dotenv

dotenv.load_dotenv()

ORS_API_KEY = os.getenv('ORS_API_KEY')

UPLOADS_DIR = os.path.join(os.path.dirname(__file__), '../../uploads')

def get_latest_images(n=5):
    """Retourne les n derniers fichiers du dossier uploads (par date de modification décroissante)."""
    files = [
        f for f in os.listdir(UPLOADS_DIR)
        if os.path.isfile(os.path.join(UPLOADS_DIR, f))
    ]
    files = sorted(
        files,
        key=lambda f: os.path.getmtime(os.path.join(UPLOADS_DIR, f)),
        reverse=True
    )
    return files[:n]

def randomize_images_and_find_closest(center_lat, center_lon, radius_m=200):
    """
    Prend les 5 images du dossier uploads, randomise leur position autour du centre,
    et retourne la liste randomisée + la lat/lon du point le plus proche du centre + l'image correspondante.
    """
    def random_point(lat, lon, radius):
        angle = random.uniform(0, 2 * math.pi)
        distance = random.uniform(0, radius)
        dx = distance * math.cos(angle)
        dy = distance * math.sin(angle)
        delta_lat = dy / 111320
        delta_lon = dx / (40075000 * math.cos(math.radians(lat)) / 360)
        return lat + delta_lat, lon + delta_lon

    def haversine(lat1, lon1, lat2, lon2):
        R = 6371000
        phi1, phi2 = math.radians(lat1), math.radians(lat2)
        dphi = math.radians(lat2 - lat1)
        dlambda = math.radians(lon2 - lon1)
        a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
        return 2 * R * math.asin(math.sqrt(a))

    # Récupère les 5 dernières images
    image_files = get_latest_images(5)
    images = [{'filename': fname} for fname in image_files]

    randomized = []
    for img in images:
        new_lat, new_lon = random_point(center_lat, center_lon, radius_m)
        randomized.append({**img, 'lat': new_lat, 'lon': new_lon})

    closest = min(
        randomized,
        key=lambda img: haversine(center_lat, center_lon, img['lat'], img['lon'])
    )

    # Retourne la liste randomisée, la lat/lon du point le plus proche et l'image correspondante
    return randomized, {'lat': closest['lat'], 'lon': closest['lon'], 'filename': closest['filename']}

import requests

def get_route(start_lat, start_lon, end_lat, end_lon):
    """
    Retourne un trajet (liste de coordonnées) entre deux points via OpenRouteService.
    """
    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    headers = {
        "Authorization": ORS_API_KEY,  # Mets ta clé ici
        "Content-Type": "application/json"
    }
    body = {
        "coordinates": [
            [start_lon, start_lat],
            [end_lon, end_lat]
        ]
    }
    try:
        resp = requests.post(url, json=body, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        # Retourne la géométrie du trajet (liste de points)
        return data["features"][0]["geometry"]["coordinates"]
    except Exception as e:
        return []