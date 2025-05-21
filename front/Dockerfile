FROM node:18-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY park-ia/package*.json ./

RUN npm install

# Copier le reste du projet
COPY park-ia/ .

EXPOSE 3000

CMD ["npm", "run", "dev"]
