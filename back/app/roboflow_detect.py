from roboflow import Roboflow
from dotenv import load_dotenv
import os

load_dotenv()

Api_key = os.getenv("API_KEY")

rf = Roboflow(api_key=Api_key)  
project = rf.workspace('minervas-workspace-7comk').project('car-parking-occupation')
model = project.version(1).model
def detect_parking(image_path: str, save_path: str = "static/annotated.jpg"):
    results = model.predict(image_path, confidence=40, overlap=0.88)
    results.save(save_path)

    raw = results.json()
    nb_places = len(raw["predictions"])
    boxes = [
        {
            "x": int(p["x"]),
            "y": int(p["y"]),
            "width": int(p["width"]),
            "height": int(p["height"]),
            "class": p["class"]
        }
        for p in raw["predictions"]
    ]

    return {"count": nb_places, "boxes": boxes, "image_path": save_path}