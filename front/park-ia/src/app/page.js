"use client";
import { useEffect, useState, useRef } from 'react';
import Maps from '../../components/map';
import Loader from '../../components/loader';

export default function Home() {
  const [isValid, setIsValid] = useState(false);
  const [address, setAddress] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
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
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`, {
        signal: controller.signal,
        headers: { 'Accept-Language': 'fr' }
      })
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

  return (
    <div className='flex w-full'>
      <div className='flex flex-col w-full bg-blue-100'>
        <Maps />
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

        <div className='flex flex-col w-full relative' ref={suggestionsRef}>
          {suggestions.length > 0 && !loading && (
            <ul className="absolute z-10 bg-white border border-gray-300 w-full max-h-18 rounded overflow-y-auto bottom-32">
              {suggestions.map((s) => (
                <li
                  key={s.place_id}
                  className="p-2 hover:bg-blue-100 cursor-pointer"
                  onClick={() => {
                    setAddress(s.display_name);
                    setSuggestions([]);
                    }}
                  >
                    {s.display_name}
                  </li>
                  ))}
                </ul>
                )}
                <input
                  type="text"
                  className="mt-8 p-3 rounded-lg border border-black w-full text-xl"
                  placeholder="Entrez une adresse ou un lieu"
                  autoComplete="off"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                />
                {loading && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-15">
                  <Loader/>
                </div>
                )}
                <button
                  className={`mt-4 w-full h-13 rounded-lg text-3xl font-bold transition 
                  ${address.trim() !== "" ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer" : "bg-gray-400 text-white cursor-not-allowed"}`}
                  onClick={() => {
                    if (address.trim() !== "") {
                      setIsValid(false);
                      setAddress("");
                      setSuggestions([]);
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