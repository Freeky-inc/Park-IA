"use client"
import { useEffect, useState } from 'react';
import { fetchData, postData } from '../../lib/api';

export default function Home() {
  const [imagePreview, setImagePreview] = useState(null);

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
    if (!imagePreview) {
      console.error('Aucune image sélectionnée');
      return;
    }
  
    try {
      const formData = new FormData();
      const base64Response = await fetch(imagePreview);
      const blob = await base64Response.blob();
      // Important: FastAPI expects the field name to be "file"
      formData.append('file', blob, 'image.jpg');
  
      const result = await postData('/detect', formData);
      console.log('Résultat:', result);
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
    }
  };

  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className='flex uppercase font-bold text-red-500 justify-center mt-5'>Bienvenue sur Park.IA</h1>
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
                      src={imagePreview}
                      alt="Aperçu"
                      className="max-w-full object-contain rounded transition-all duration-300 group-hover:blur-sm"
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
                  <div className="flex justify-center">
                    <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600" onClick={handleSubmit}>
                      Envoyer des données
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
  );
}
