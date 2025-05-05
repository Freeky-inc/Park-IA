// lib/api.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000', // L'URL de ton backend FastAPI
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchData = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des données :", error);
    throw error;
  }
};

export const postData = async (url, data) => {
  const response = await fetch(`http://localhost:8000${url}`, {
    method: 'POST',
    body: data instanceof FormData ? data : JSON.stringify(data),
    headers: data instanceof FormData ? {} : {
      'Content-Type': 'application/json',
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
};

// Tu peux ajouter d'autres méthodes (PUT, DELETE) selon tes besoins