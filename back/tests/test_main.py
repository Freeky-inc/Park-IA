import os
import sys
import pytest
from fastapi.testclient import TestClient
from PIL import Image
from fastapi import FastAPI

app = FastAPI()

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

# Create a TestClient instance
client = TestClient(app)

# Fixture to create a temporary valid image file
@pytest.fixture
def fake_image(tmp_path):
    # Define the path for the temporary image
    image_path = tmp_path / "test_image.jpg"
    
    # Create a simple image using Pillow
    image = Image.new("RGB", (100, 100), color="white")
    image.save(image_path, format="JPEG")
    
    # Provide the path to the test
    yield image_path

    # Cleanup is handled automatically by tmp_path

def test_detect(fake_image):
    # Simulate file upload
    with open(fake_image, "rb") as image_file:
        response = client.post(
            "/detect",
            files={"file": ("test_image.jpg", image_file, "image/jpeg")}
        )

    # Verify the response status code
    assert response.status_code == 200

    # Verify the structure of the JSON response
    response_json = response.json()
    assert "places_detectees" in response_json
    assert "boxes" in response_json
    assert "image_url" in response_json

    # Verify that the annotated image has been generated
    annotated_image_path = "static/annotated.jpg"
    assert os.path.exists(annotated_image_path)