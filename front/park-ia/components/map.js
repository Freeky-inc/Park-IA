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

// Configuration des icônes Leaflet côté client uniquement
function useLeafletIcons() {
  useEffect(() => {
    // Dynamically import leaflet only on client
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

export default function Maps({ position }) {
  useLeafletIcons();

  return (
    <div className='flex w-full'>
      <div className='flex flex-col w-full bg-blue-100'>
        <div style={{ height: "100vh", width: "100%" }}>
          <MapContainer
            center={position ? [position.lat, position.lon] : [48.8566, 2.3522]}
            zoom={13}
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
          </MapContainer>
        </div>
      </div>
    </div>
  );
}