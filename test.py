import requests

ORS_API_KEY = "ta_clé"
url = "https://api.openrouteservice.org/v2/directions/driving-car"
headers = {
    "Authorization": ORS_API_KEY,
    "Content-Type": "application/json"
}
body = {
    "coordinates": [
        [6.0859641, 46.2885314],  # lon, lat départ
        [6.087230269869162, 46.28757310184566]  # lon, lat arrivée
    ]
}
resp = requests.post(url, json=body, headers=headers)
print(resp.status_code)
print(resp.text)