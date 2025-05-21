"use client"
import { useEffect, useRef, useState } from 'react';
import { fetchData, postData } from '../../lib/api';
import { useRouter } from 'next/navigation';
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

  const handleSubmitWP = async () => {
    if (!imagePreview) {
      console.error('Aucune image sélectionnée');
      return;
    }

    setIsLoading(true);
  
    try {
      const formData = new FormData();
      const base64Response = await fetch(imagePreview);
      const blob = await base64Response.blob();
      formData.append('file', blob, 'image.jpg');
  
      const result = await postData('/detect', formData);
      
      // Stocker les données dans localStorage
      localStorage.setItem('parkIA_image', imagePreview);
      localStorage.setItem('parkIA_detections', JSON.stringify(result));
      
      // Rediriger sans paramètres
      router.push('/detect');
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
    }

    // finally {
    //   setIsLoading(false);
    // }
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
            <div className='container bg-red-100 flex flex-row w-1/2 m-auto justify-center items-center rounded-lg relative'>
              <div className='flex flex-col w-full justify-center items-center gap-4'>
                <div className="h-64 flex items-center justify-center">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                </div>
              </div>
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
                    <span className="text-black font-semibold pointer-events-none bg-white/50 px-4 py-2 rounded">
                      Changer l'image
                    </span>
                  </div>
                </div>
                {!isLoading && (
                  <div className="flex justify-center">
                    <button 
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" 
                      onClick={handleSubmitWP}
                    > 
                      Détecter les places
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