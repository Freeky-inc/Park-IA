"use client"
import { useEffect, useState } from 'react';
import { fetchData, postData } from '../../lib/api';

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchData('/example-endpoint');
        setData(result);
      } catch (error) {
        console.error('Erreur lors du chargement des données :', error);
      }
    };

    loadData();
  }, []);

  const handleSubmit = async () => {
    try {
      const postDataResult = await postData('/detect', { key: 'value' });
      console.log(postDataResult);
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
    }
  };

  return (
    <div>
      <h1>Bienvenue sur Park.IA</h1>
      <div>
        <h2>Données récupérées :</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      <input type="file" accept="image/*" onChange={(e) => console.log(e.target.files[0])}/>
      <button onClick={handleSubmit}>Envoyer des données</button>
    </div>
  );
}