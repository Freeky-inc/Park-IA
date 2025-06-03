import { postData, fetchData } from '../../lib/api';

/**
 * Convertit une adresse en coordonnées latitude/longitude via le proxy backend.
 * @param {string} address
 * @returns {Promise<{lat: number, lon: number} | null>}
 */
export async function geocodeAddress(address) {
  const data = await fetchData(`/geocode?q=${encodeURIComponent(address)}`);
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  }
  return null;
}

/**
 * Envoie les coordonnées au backend pour randomiser les positions des images
 * et récupérer la route et le point le plus proche.
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<{randomized: Array, closest: Object, route: Array}>}
 */
export async function randomizeImagePositions(lat, lon) {
  return await postData('/trajet', { lat, lon });
}