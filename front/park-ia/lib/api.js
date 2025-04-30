// lib/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // L'URL de ton backend FastAPI
  headers: {
    'Content-Type': 'application/json',
  },
});

// Exemple de requête GET
export const fetchData = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error;
  }
};

// Exemple de requête POST
export const postData = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoi des données :", error);
    throw error;
  }
};

// Tu peux ajouter d'autres méthodes (PUT, DELETE) selon tes besoins