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
  try {
    // For debugging
    if (data instanceof FormData) {
      console.log('Form data contents:', Array.from(data.entries()));
    }

    const response = await fetch(`http://localhost:8000${url}`, {
      method: 'POST',
      body: data,
      headers: data instanceof FormData ? {
        'accept': 'application/json',
      } : {
        'Content-Type': 'application/json',
        'accept': 'application/json'
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
        throw new Error(`Erreur de validation: ${errorData.detail[0].msg}`);
      } catch (e) {
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Erreur lors de l'envoi des données:", error);
    throw error;
  }
};

// Tu peux ajouter d'autres méthodes (PUT, DELETE) selon tes besoins