"use client"
import { useEffect, useRef, useState } from 'react';
import Maps from '../../components/map';
// import { useRouter } from 'next/navigation';
// // import { handleImageSubmit, handleImagePreProcessing } from '../functions/images';
// // import Loader from '../../components/loader';

export default function Home() {
  // const [imagePreview, setImagePreview] = useState(null);
  // const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const imageRef = useRef(null); // Add this line
  const [isValid, setIsValid] = useState(true);
  const [address, setAddress] = useState("");


  useEffect(() => {
    if (imageRef.current) {
      setImageSize({
        width: imageRef.current.clientWidth,
        height: imageRef.current.clientHeight
      });
    }
  }, [imagePreview]);

  return (
    <div className='flex w-full'>
      <div className='flex flex-col w-full bg-blue-100'>
        <Maps/>
      </div>
      <div className='flex flex-col items-center w-3/10 h-screen bg-white px-5 py-10 place-content-between'>
        <div className='flex flex-col items-center'>
          <h1 className="text-5xl font-bold text-center mb-10">Bienvenue sur Park.IA</h1>
          <img src="/parking.svg" alt="Logo" width={100} />
        </div>
        {!isValid && (
          <div className='text-2xl font-bold'>
            <p>
              Indique ta position pour chercher une place de parking dès à présent 
              (ou sinon ton addresse de destination si tu veux chercher une place en avance)
            </p>
          </div>
        )} 
        {isValid && (
          <div className='text-2xl font-bold'>
            <p>
              Et voilà !! La place de parking la plus proche se trouve au {}. 
              N’hésite pas à réessayer notre app si jamais la place est prise 
              (ou sinon tu lui vole sa voiture 🏴‍☠️)
            </p>
          </div>
        )}

        <div className='flex flex-col w-full'>
          <input
            type="text"
            className="mt-8 p-3 rounded-lg border border-black w-full text-xl"
            placeholder="Entrez une adresse ou un lieu"
            autoComplete="on"
            value={address}
            onChange={e => setAddress(e.target.value)}
            // Pour une vraie autocomplétion, il faudrait intégrer une API comme Google Places ou Mapbox ici
          />
          <button
            className={`mt-4 w-full h-13 rounded-lg text-3xl font-bold transition 
              ${address.trim() !== "" ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer" : "bg-gray-400 text-white cursor-not-allowed"}`}
            onClick={() => {
              if (address.trim() !== "") {
                setIsValid(false);
                setAddress("");
              }
            }}
            disabled={address.trim() === ""}
          >
            C'est Parti !!
          </button>
        </div>
      </div>
    </div>
  );
  }