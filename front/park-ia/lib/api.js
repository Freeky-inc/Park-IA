import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:8000', // Use environment variable or fallback to localhost
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to handle FormData
apiClient.interceptors.request.use((config) => {
  if (config.data instanceof FormData) {
    // Remove Content-Type header for FormData
    delete config.headers['Content-Type'];
    // Log FormData contents for debugging
    console.log('Form data contents:', Array.from(config.data.entries()));
  }
  return config;
});

// GET request handler
export const fetchData = async (endpoint) => {
  try {
    const response = await apiClient.get(endpoint);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// POST request handler
export const postData = async (url, data) => {
  try {
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Error handler helper
const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const errorMessage = error.response.data.detail?.[0]?.msg 
      || error.response.data.message 
      || 'Une erreur est survenue';
    console.error('Error response:', errorMessage);
    throw new Error(errorMessage);
  } else if (error.request) {
    // Request made but no response
    console.error('No response received:', error.request);
    throw new Error('Aucune réponse du serveur');
  } else {
    // Error in request setup
    console.error('Request error:', error.message);
    throw new Error("Erreur lors de l'envoi de la requête");
  }
};

export default apiClient;