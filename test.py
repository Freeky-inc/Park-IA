import requests

ORS_API_KEY = '5b3ce3597851110001cf6248a2f2eb52fe76488588239b8367a8d17b'
url = "https://api.openrouteservice.org/v2/directions/driving-car"
headers = {
    "Authorization": ORS_API_KEY,
    "Content-Type": "application/json"
}
body = {
    "coordinates": [
        [6.0859641, 46.2885314],  # [lon, lat] départ
        [6.126, 46.2]# [lon, lat] arrivée (mets une autre coordonnée pour tester)
    ]
}
resp = requests.post(url, json=body, headers=headers)
print(resp.status_code)
print(resp.text)