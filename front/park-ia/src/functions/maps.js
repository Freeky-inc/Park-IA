import { postData } from '../../lib/api';


/**
 * Convertit une adresse en coordonnées latitude/longitude via Nominatim.
 * @param {string} address
 * @returns {Promise<{lat: number, lon: number} | null>}
 */
export async function geocodeAddress(address) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
    { headers: { 'Accept-Language': 'fr' } }
  );
  const data = await res.json();
  if (data && data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  }
  return null;
}

export async function randomizeImagePositions(lat, lon) {
  const res = await fetch('/detect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lat, lon }),
  });
  if (!res.ok) throw new Error('Erreur lors de la randomisation');
  return await res.json(); // { randomized, closest, route }
}