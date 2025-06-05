"use client"
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BaseButton from '../../../components/basebutton/BaseButton';

export default function DetectPage() {
  const [imageData, setImageData] = useState(null);
  const [detections, setDetections] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);
  const router = useRouter();
  const [placesL, setPlacesL] = useState(0);
  const [message, setMessage] = useState("");


  useEffect(() => {
    // Récupérer les données du localStorage
    const storedImage = localStorage.getItem('parkIA_image');
    const storedDetections = localStorage.getItem('parkIA_detections');

    if (!storedImage || !storedDetections) {
      // Rediriger vers la page d'accueil si les données ne sont pas disponibles
      router.push('/');
      return;
    }

    setImageData(storedImage);
    setDetections(JSON.parse(storedDetections));
  }, []);

  useEffect(() => {
    if (detections && detections.boxes) {
      const boxesWithoutCars = detections.boxes.filter((box) => box.class == 'free');
      const count = boxesWithoutCars.length;
      setPlacesL(count);
  
      // Mettre à jour le message directement avec count au lieu de placesL
      if (count === 0) {
        setMessage("Il n'y a pas de place disponible");
      } else {
        setMessage(`Il y a ${count} places disponibles`);
      }
    }
  }, [detections]);


  const renderDetections = (boxes) => {
    if (!imageRef.current) return null;

    const scaleX = imageRef.current.clientWidth / imageRef.current.naturalWidth;
    const scaleY = imageRef.current.clientHeight / imageRef.current.naturalHeight;

    return boxes
      .filter((box) => box.class !== 'car')
      .map((box, index) => {
        const x = (box.x - box.width / 2) * scaleX;
        const y = (box.y - box.height / 2) * scaleY;
        const width = box.width * scaleX;
        const height = box.height * scaleY;
      
        return (
          <div
            key={index}
            className="absolute border-2 border-green-500"
            style={{
              left: `${x}px`,
              top: `${y}px`,
              width: `${width}px`,
              height: `${height}px`,
              pointerEvents: 'none',
            }}
          >
            <span className="absolute -top-6 left-0 bg-green-500 text-white px-2 py-1 text-sm rounded">
              {box.class}
            </span>
          </div>
        );
      });
  };


  return (
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50'>
      <div className='w-full max-w-4xl p-8 backdrop-blur-lg bg-white/30 rounded-2xl shadow-xl border border-white/40'>
        <h1 className='uppercase font-bold text-4xl text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          Résultats de la détection
        </h1>
        
        <div className='w-full'>
          <div className='flex flex-col items-center gap-6'>
            <div className="relative group w-full max-w-2xl">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <img
                  ref={imageRef}
                  src={imageData}
                  className="w-full h-auto object-contain"
                  onLoad={() => {
                    setImageSize({
                      width: imageRef.current.clientWidth,
                      height: imageRef.current.clientHeight
                    });
                  }}
                />
                {detections && renderDetections(detections.boxes)}
              </div>
            </div>

            <div className="flex flex-col items-center justify-center gap-6">
              <p className="text-xl font-semibold text-gray-700 bg-white/30 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/30">
                {message}
              </p>
              <Link href="/">
                <BaseButton className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                  Retour à l'accueil
                </BaseButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}