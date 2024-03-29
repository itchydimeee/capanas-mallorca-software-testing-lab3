import React, { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

interface Pog {
  id: number;
  name: string;
  ticker_symbol: string;
  price: number;
  color: string;
}

const ReadPogs: React.FC = () => {
  const history = useHistory();
  const [pogs, setPogs] = useState<Pog[]>([]);

  useEffect(() => {
    getPogs();
  }, []);

  const getPogs = async () => {
    try {
      const response = await fetch('/pogs');
      if (!response.ok) {
        throw new Error('Failed to fetch Pogs');
      }
      const pogsData = await response.json();
      setPogs(pogsData);
    } catch (error) {
      console.error('Error fetching Pogs:', error);
    }
  };

  const handleBackToHome = () => {
    history.push('/');
  };

  return (
    <div className="container mx-auto p-4">
      <button
        type="button"
        onClick={handleBackToHome}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
      >
        Back
      </button>
      <h1 className="text-2xl font-bold mb-4">List of Pogs</h1>
      <div id="pogsList">
        {pogs.map((pog) => (
          <div key={pog.id} className="mb-4 border rounded p-4">
            <p className="mb-2"><strong>Name:</strong> {pog.name}</p>
            <p className="mb-2"><strong>Ticker Symbol:</strong> {pog.ticker_symbol}</p>
            <p className="mb-2"><strong>Price:</strong> {pog.price}</p>
            <p className="mb-2"><strong>Color:</strong> {pog.color}</p>
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-blue-600 transition duration-300">Update</button>
            <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReadPogs;
