"use client"
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleImageSubmit, handleImagePreProcessing } from '../functions/images';
import Loader from '../../components/loader';

export default function Home() {
  const [imagePreview, setImagePreview] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null); // Add this line
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

const handleSubmit = async () => {
    if (!imagePreview) return;

    setIsLoading(true);
    try {
      const result = await handleImageSubmit(imagePreview);
      localStorage.setItem('parkIA_image', imagePreview);
      localStorage.setItem('parkIA_detections', JSON.stringify(result));
      await router.push('/detect');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitProcess = async () => {
    if (!imagePreview) return;

    setIsLoading(true);
    try {
      const result = await handleImagePreProcessing(imagePreview);
      localStorage.setItem('parkIA_image', imagePreview);
      localStorage.setItem('parkIA_detections', JSON.stringify(result));
      
      await router.push('/detect');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight
      });
    }
  }, [imagePreview]);

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='uppercase font-bold text-2xl text-red-500 justify-center mt-5 mb-5'>Bienvenue sur Park.IA</h1>
          {!imagePreview && (
                    <div className="border-2 border-black rounded-lg px-4 py-4 relative">
                    <label htmlFor="file-input" className="text-black font-semibold pointer-events-none bg-white/50 px-4 py-2 rounded">Choisir un fichier</label>
                    <input 
                      id="file-input"
                      type="file" 
                      accept="image/*" 
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                      onChange={handleFileChange}
                    />
                  </div>
          )}
          
          {imagePreview && (
            <div className='container flex flex-row w-1/2 m-auto justify-center items-center rounded-lg relative'>
              <div className='flex flex-col w-full justify-center items-center gap-4'>
                <div>
                  <div className="relative group">
                    <img
                      ref={imageRef}
                      src={imagePreview}
                      className="max-w-full object-contain rounded transition-all duration-300 group-hover:blur-sm"
                      onLoad={() => {
                        setImageSize({
                          width: imageRef.current.clientWidth,
                          height: imageRef.current.clientHeight
                        });
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                      />
                    <span className="text-white font-semibold pointer-events-none bg-white/50 px-4 py-2 rounded">
                      Changer l'image
                    </span>
                  </div>
                </div>
                {!isLoading && (
                  <div className="flex justify-center gap-4">
                    <button 
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
                      onClick={handleSubmit}
                    > 
                      Détecter les places
                    </button>
                    <button 
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
                      onClick={handleSubmitProcess}
                    > 
                      Prétraiter et détecter
                    </button>
                  </div>
                )}
                {isLoading && (
                  <div className='h-svh w-screen backdrop-blur-md fixed top-0 left-0 flex-col items-center justify-center place-content-center'>
                    <div className='flex items-center justify-center'>
                      <Loader/>
                    </div>
                    <div className=" flex items-center justify-center">
                      <p>Chargement des données...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }