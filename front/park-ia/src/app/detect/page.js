"use client"
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DetectPage() {
  const [imageData, setImageData] = useState(null);
  const [detections, setDetections] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null);
  const router = useRouter();

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
              pointerEvents: 'none'
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
    <div className='flex flex-col items-center justify-center'>
      <h1 className='uppercase font-bold text-2xl text-red-500 justify-center mt-5 mb-5'>
        Résultats de la détection
      </h1>
      
      <div className='container flex flex-row w-1/2 m-auto justify-center items-center rounded-lg relative'>
        <div className='flex flex-col w-full justify-center items-center gap-4'>
          <div>
            <div className="relative">
              <img
                ref={imageRef}
                src={imageData} // Changed from imageUrl to imageData
                alt="Image analysée"
                className="max-w-full object-contain rounded"
                onLoad={() => {
                  setImageSize({
                    width: imageRef.current.clientWidth,
                    height: imageRef.current.clientHeight
                  });
                }}
              />
              {detections && renderDetections(detections.boxes)}
            </div>
            <div className="flex justify-center mt-4">
              <Link href="/">
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  Retour à l'accueil
                </button>
              </Link>
            </div>              
          </div>
        </div>
      </div>
    </div>
  );
}