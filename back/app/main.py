from fastapi import FastAPI
from app.ia.routes import router as ia_routes
from app.images.routes import router as images_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Ou remplace "*" par une liste d'origines autorisées
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ia_routes)
app.include_router(images_routes)