from roboflow import Roboflow

# Initialise Roboflow une seule fois
rf = Roboflow(api_key="NyMVhqsspNvipvttBfkQ")  # 🔑 à remplacer
project = rf.workspace("minervas-workspace-7comk").project("car-parking-occupation")
model = project.version(1).model  # adapte si version différente

def detect_parking(image_path: str, save_path: str = "static/annotated.jpg"):
    results = model.predict(image_path, confidence=40, overlap=30)
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