"use client";
import { useEffect, useState, useRef } from 'react';
import Maps from '../../components/map';
import Loader from '../../components/loader';
import { randomizeImagePositions} from '../functions/maps';

export default function Home() {
  const [isValid, setIsValid] = useState(false);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [route, setRoute] = useState(null);
  const suggestionsRef = useRef(null);
  const debounceTimeout = useRef();

  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    const query = address.trim();
    if (query.length < 3) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    debounceTimeout.current = setTimeout(() => {
      const controller = new AbortController();
      fetch(`http://localhost:8000/geocode?q=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        setSuggestions(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });

      return () => controller.abort();
    }, 1000);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [address]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAddress = async (suggestion) => {
    setAddress(suggestion.display_name);
    setSuggestions([]);
    setSelectedPosition({
      lat: parseFloat(suggestion.lat),
      lon: parseFloat(suggestion.lon)
    });
  };

  const handleRandomize = async () => {
    setLoading(true);
    try {
      console.log('selectedPosition:', selectedPosition);
      const response = await randomizeImagePositions(selectedPosition.lat, selectedPosition.lon);
      setIsValid(true);
      setRoute(response.route);
      setLoading(false);
    } catch (e) {
      setLoading(false);
      alert('Erreur lors de la randomisation');
      console.log(selectedPosition?.lat, selectedPosition?.lon);
    }
  };

  return (
    <div className='flex flex-col lg:flex-row w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 lg:p-8'>
      <div className='flex flex-col w-full h-[50vh] lg:h-[90vh] mb-4 lg:mb-0 lg:mr-4 rounded-2xl backdrop-blur-xl bg-white/30 border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] overflow-hidden'>
        <div className='h-full w-full'>
          <Maps position={selectedPosition} route={route} />
        </div>
      </div>
      <div className='flex flex-col items-center w-full lg:w-[450px] h-auto lg:h-[90vh] rounded-2xl backdrop-blur-xl bg-white/30 border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] p-4 lg:p-0'>
        <div className='flex flex-col items-center mt-4 lg:mt-8'>
          <h1 className="text-3xl lg:text-4xl font-bold text-center mb-4 lg:mb-6 bg-gradient-to-r from-blue-800 to-purple-800 bg-clip-text text-transparent">Park.AI</h1>
          <img src="/parking.svg" alt="Logo" width={60} className="drop-shadow-lg lg:w-[80px]" />
        </div>
        {!isValid && (
          <div className='text-base lg:text-lg font-medium text-gray-800 px-4 lg:px-6 text-center'>
            <p>
              Indique ta position pour chercher une place de parking dès à présent 
              (ou sinon ton addresse de destination si tu veux chercher une place en avance)
            </p>
          </div>
        )} 
        {isValid && selectedPosition && (
          <div className='text-base lg:text-lg font-medium text-gray-800 px-4 lg:px-6 text-center'>
            <p>
              Et voilà !! La place de parking la plus proche se trouve à la latitude {selectedPosition.lat}, longitude {selectedPosition.lon}. 
              N'hésite pas à réessayer notre app si jamais la place est prise 
              (ou sinon tu lui vole sa voiture 🏴‍☠️)
            </p>
          </div>
        )}

        <div className='flex flex-col w-full px-4 lg:px-6 relative' ref={suggestionsRef}>
          
          <input
            type="text"
            className="mt-4 lg:mt-8 p-3 rounded-xl border border-white/50 w-full text-base lg:text-lg backdrop-blur-xl bg-white/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600/50 transition-all text-gray-800 placeholder-gray-600"
            placeholder="Entrez une adresse ou un lieu"
            autoComplete="off"
            value={address}
            onChange={e => setAddress(e.target.value)}
          />
          {suggestions.length > 0 && !loading && (
            <ul className=" z-10 backdrop-blur-xl bg-white/40 border border-white/50 w-full max-h-60 rounded-xl overflow-y-auto bottom-full mb-2 shadow-lg">
              {suggestions.map((s) => (
                <li
                  key={s.place_id}
                  className="p-2 hover:bg-white/50 cursor-pointer transition-colors text-gray-800"
                  onClick={() => handleSelectAddress(s)}
                >
                  {s.display_name}
                </li>
              ))}
            </ul>
          )}
          {loading && (
            <div className="absolute left-1/2 -translate-x-1/2 top-2 z-20">
              <Loader/>
            </div>
          )}
          <button
            className={`mt-4 w-full h-10 lg:h-12 rounded-xl text-lg lg:text-xl font-bold transition-all duration-300 shadow-lg
              ${selectedPosition 
                ? "bg-gradient-to-r from-blue-800/80 to-purple-800/80 hover:from-blue-900 hover:to-purple-900 text-white cursor-pointer transform hover:scale-105" 
                : "bg-gray-300/50 text-gray-600 cursor-not-allowed"}`}
            onClick={() => {
              if (selectedPosition) {
                handleRandomize();
              }
            }}
            disabled={!selectedPosition}
          >
            C'est Parti !!
          </button>
        </div>
      </div>
    </div>
  );
}