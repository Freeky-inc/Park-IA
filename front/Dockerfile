FROM node:18-alpine

WORKDIR /app

COPY park-ia/package*.json ./

RUN npm install

COPY park-ia/ ./

CMD ["npm", "run", "dev"]