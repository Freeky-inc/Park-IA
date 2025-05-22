FROM python:3.11-slim

WORKDIR /app

# Installation des dépendances système nécessaires
RUN apt-get update && \
    apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    curl \
    iputils-ping \
    dnsutils && \
    rm -rf /var/lib/apt/lists/*

# Configuration DNS
RUN echo "nameserver 8.8.8.8\nnameserver 8.8.4.4" > /etc/resolv.conf

# Installation des dépendances Python
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copie des fichiers de l'application
COPY app ./app
COPY static ./static
COPY uploads ./uploads

# Exposition du port
EXPOSE 8000

# Commande de démarrage
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]