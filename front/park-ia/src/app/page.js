"use client"
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { handleImageSubmit, handleImagePreProcessing } from '../functions/images';
import Loader from '../../components/loader';
import BaseButton from '../../components/basebutton/BaseButton';

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
    <div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50'>
      <div className='w-full max-w-4xl p-8 backdrop-blur-lg bg-white/30 rounded-2xl shadow-xl border border-white/40'>
        <h1 className='uppercase font-bold text-4xl text-center mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
          Bienvenue sur Park.IA
        </h1>

        {!imagePreview && (
          <div className="relative group">
            <div className="border-2 border-white/40 rounded-xl p-8 bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/100">
              <label htmlFor="file-input" className="block text-center text-gray-700 font-semibold text-lg">
                Choisir un fichier
              </label>
              <input 
                id="file-input"
                type="file" 
                accept="image/*" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer " 
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}
        
        {imagePreview && (
          <div className='w-full'>
            <div className='flex flex-col items-center gap-6'>
              <div className="relative group w-full max-w-2xl">
                <div className="rounded-xl overflow-hidden shadow-2xl">
                  <img
                    ref={imageRef}
                    src={imagePreview}
                    className="w-full h-auto object-contain transition-all duration-300 group-hover:blur-[2px]"
                    onLoad={() => {
                      setImageSize({
                        width: imageRef.current.clientWidth,
                        height: imageRef.current.clientHeight
                      });
                    }}
                  />
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/30 rounded-xl">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange}
                    className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                  />
                  <span className="text-white font-semibold bg-white/20 backdrop-blur-sm px-6 py-3 rounded-lg border border-white/30">
                    Changer l'image
                  </span>
                </div>
              </div>

              {!isLoading && (
                <div className="flex justify-center gap-6 mt-4">
                  <BaseButton 
                    onClick={handleSubmit}
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Détecter les places
                  </BaseButton>
                  <BaseButton 
                    onClick={handleSubmitProcess}
                    className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    Prétraiter et détecter
                  </BaseButton>
                </div>
              )}

              {isLoading && (
                <div className='fixed inset-0 backdrop-blur-md bg-black/20 flex flex-col items-center justify-center'>
                  <div className='bg-white/30 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-white/40'>
                    <div className='flex items-center justify-center mb-4'>
                      <Loader/>
                    </div>
                    <p className="text-gray-700 font-medium">Chargement des données...</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
    );
  }