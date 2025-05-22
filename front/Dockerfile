FROM node:18-alpine

WORKDIR /app

# Optimisation des couches et utilisation du cache
COPY package*.json ./

# Copier uniquement les fichiers nécessaires
COPY next.config.js ./
COPY public ./public
COPY src ./src

# Build en mode production
RUN npm run build

EXPOSE 3000

# Utiliser la commande start au lieu de dev
CMD ["npm", "start"]