import os
import pytest
from fastapi.testclient import TestClient
from app.main import app  # Assure-toi que tu importes bien ton app FastAPI

# Crée une instance de testclient
client = TestClient(app)

# Crée un dossier temporaire pour les fichiers uploadés
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Crée un fichier temporaire pour simuler l'upload d'une image
@pytest.fixture
def fake_image():
    with open("test_image.jpg", "wb") as f:
        f.write(b"fake_image_data")  # Simule des données d'image
    yield "test_image.jpg"
    os.remove("test_image.jpg")  # Nettoyage après test

def test_detect(fake_image):
    # Simule un upload de fichier
    with open(fake_image, "rb") as image_file:
        response = client.post("/detect", files={"file": ("test_image.jpg", image_file, "image/jpeg")})

    # Vérifie que la réponse a un statut 200 OK
    assert response.status_code == 200

    # Vérifie la structure de la réponse JSON
    response_json = response.json()
    assert "places_detectees" in response_json
    assert "boxes" in response_json
    assert "image_url" in response_json

    # Vérifie que l'image annotée a bien été générée
    assert os.path.exists("static/annotated.jpg")
