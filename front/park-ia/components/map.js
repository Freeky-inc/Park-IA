import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Chargement dynamique pour éviter les erreurs SSR avec Next.js
const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);

export default function Maps() {
  return (
    <div className='flex w-full'>
      <div className='flex flex-col w-full bg-blue-100'>
        <div style={{ height: "100vh", width: "100%" }}>
          <MapContainer center={[48.8566, 2.3522]} zoom={13} style={{ height: "100%", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
}