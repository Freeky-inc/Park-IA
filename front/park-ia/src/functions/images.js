import { postData } from '../../lib/api';

/**
 * Gère la soumission des images pour la détection
 * @param {string} imagePreview - L'image en base64
 * @returns {Promise<Object>} - Résultat de la détection
 */
export const handleImageSubmit = async (imagePreview) => {
  if (!imagePreview) {
    throw new Error('Aucune image sélectionnée');
  }

  const formData = new FormData();
  
  // Convert base64 to blob
  const base64Data = imagePreview.split(',')[1];
  const byteCharacters = atob(base64Data);
  const byteArray = new Uint8Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteArray[i] = byteCharacters.charCodeAt(i);
  }
  
  const blob = new Blob([byteArray], { type: 'image/jpeg' });
  formData.append('file', blob, 'image.jpg');

  return await postData('/detect', formData);
};

export const handleImagePreProcessing = async (imagePreview) => {

};