import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

// Chargement dynamique des composants react-leaflet
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import('react-leaflet').then(mod => mod.Polyline),
  { ssr: false }
);

// Configuration des icônes Leaflet côté client uniquement
function useLeafletIcons() {
  useEffect(() => {
    import('leaflet').then(L => {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: '/marker-icon-2x.png',
        iconUrl: '/marker-icon.png',
        shadowUrl: '/marker-shadow.png',
      });
    });
  }, []);
}

// Composant pour déplacer la carte dynamiquement
function FlyToPosition({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo([position.lat, position.lon], 16);
    }
  }, [position, map]);
  return null;
}

export default function Maps({ position, route }) {
  useLeafletIcons();

  // Log pour debug
  if (route && route.geometry) {
    console.log("Route geometry:", route.geometry);
  }

  // Centre la carte sur le début du trajet si dispo, sinon sur la position
  const start = route && route.geometry && route.geometry.length > 0
    ? [route.geometry[0][1], route.geometry[0][0]]
    : position
      ? [position.lat, position.lon]
      : [48.8566, 2.3522];

  return (
    <div className='flex w-full'>
      <div className='flex flex-col w-full bg-blue-100'>
        <div style={{ height: "100vh", width: "100%" }}>
          <MapContainer
            center={start}
            zoom={18}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {position && (
              <>
                <Marker position={[position.lat, position.lon]}>
                  <Popup>Votre destination</Popup>
                </Marker>
                <FlyToPosition position={position} />
              </>
            )}
            {route && route.geometry && Array.isArray(route.geometry) && route.geometry.length > 0 && (
              <Polyline
                positions={route.geometry.map(([lon, lat]) => [lat, lon])}
                pathOptions={{ color: 'red', weight: 5 }}
              />
            )}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}