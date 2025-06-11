import math
import os
import dotenv
import polyline
import requests

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

def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    return 2 * R * math.asin(math.sqrt(a))

def randomize_images_and_find_closest(center_lat, center_lon):
    """
    Associe les 5 dernières images aux 5 coordonnées fixes fournies.
    Retourne la liste et le point le plus proche du centre.
    """
    image_files = get_latest_images(5)
    images = [{'filename': fname} for fname in image_files]

    # Liste de tes 5 coordonnées fixes (lat, lon)
    coords = [
        (46.28716019815672, 6.084893168592775),
        (46.28757310184566, 6.087230269869162),
        (46.28971213864676, 6.087976796211865),
        (46.286159954091296, 6.085662178826428),
        (46.288761093529395, 6.081591240189916)
    ]

    # Associe chaque image à une coordonnée
    randomized = []
    for img, (lat, lon) in zip(images, coords):
        randomized.append({**img, 'lat': lat, 'lon': lon})

    closest = min(
        randomized,
        key=lambda img: haversine(center_lat, center_lon, img['lat'], img['lon'])
    )

    return randomized, {'lat': closest['lat'], 'lon': closest['lon'], 'filename': closest['filename']}

def get_route(start_lat, start_lon, end_lat, end_lon):
    """
    Retourne le trajet entre deux points via OpenRouteService :
    - geometry : liste de coordonnées du trajet
    - distance : en mètres
    - duration : en secondes
    """
    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    headers = {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
    }
    body = {
        "coordinates": [
            [start_lon, start_lat],  # ORS attend [lon, lat]
            [end_lon, end_lat]
        ]
    }
    try:
        resp = requests.post(url, json=body, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()
        if not data.get("routes"):
            return {
                "geometry": [],
                "distance": None,
                "duration": None,
                "error": "No route found"
            }
        route = data["routes"][0]
        geometry = polyline.decode(route["geometry"])  # [(lat, lon), ...]
        geometry = [[lon, lat] for lat, lon in geometry]  # Pour Leaflet
        summary = route["summary"]
        return {
            "geometry": geometry,
            "distance": summary["distance"],
            "duration": summary["duration"]
        }
    except Exception as e:
        print("ORS error:", e)
        try:
            print("ORS response:", resp.text)
        except:
            pass
        return {
            "geometry": [],
            "distance": None,
            "duration": None,
            "error": str(e)
        }