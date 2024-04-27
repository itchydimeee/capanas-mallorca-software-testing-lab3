import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useNavigation from '../components/navigation';
import PogItem from '../components/pogsItem';

const PogsList: React.FC = () => {
  const { ToCreatePogs } = useNavigation();
  const [pogs, setPogs] = useState<
    {
      id: number;
      name: string;
      ticker_symbol: string;
      price: number;
      color: string;
    }[]
  >([]);

  const [editingPog, setEditingPog] = useState<
    | {
        id: number;
        name: string;
        ticker_symbol: string;
        price: number;
        color: string;
      }
    | null
  >(null);

  const [priceUpdated, setPriceUpdated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch('http://localhost:3000/pogs', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch Pogs');
        }
        const pogsData = await response.json();
        setPogs(pogsData);
      } catch (error) {
        console.error('Error fetching Pogs:', error);
      }
    })();
  }, []); //

  const getPogs = async () => {
    try {
      const response = await fetch('http://localhost:3000/pogs', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch Pogs');
      }
      const pogsData = await response.json();
      setPogs(pogsData);
    } catch (error) {
      console.error('Error fetching Pogs:', error);
    }
  };

  const handlePriceChange = async () => {
    try {
      await axios.put('http://localhost:3000/pogs-update-price');
      getPogs();
      setPriceUpdated(true);
      alert('Price Updated');
    } catch (error) {
      console.error('Error updating Pog:', error);
    }
  };

  const handleUpdatePog = async (updatedPog: {
    id: number;
    name: string;
    ticker_symbol: string;
    price: number;
    color: string;
  }) => {
    try {
      const response = await fetch(`http://localhost:3000/pogs/${updatedPog.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPog),
      });
      if (!response.ok) {
        throw new Error('Failed to update Pog');
      }
      setEditingPog(null);
      getPogs();
    } catch (error) {
      console.error('Error updating Pog:', error);
    }
  };

  const handleDeletePog = async (pogId: number) => {
    try {
      const response = await fetch(`http://localhost:3000/pogs/${pogId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete Pog');
      }
      getPogs();
    } catch (error) {
      console.error('Error deleting Pog:', error);
    }
  };

  return (
    <div className="container mx-auto p-4" data-testid="pog-container">
      {priceUpdated && <p>Price Updated</p>}
      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={ToCreatePogs}
      >
        Back
      </button>

      <button
        type="button"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        onClick={handlePriceChange}
      >
        Random Price
      </button>

      <h1 className="text-2xl font-bold mb-4">List of Pogs</h1>
      <div className="grid grid-cols-1 gap-4" role="list">
  {pogs.map((pog) => (
    <PogItem key={pog.id} pog={pog} setEditingPog={setEditingPog} handleDeletePog={handleDeletePog} />
  ))}
</div>

      {editingPog && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Edit Pog</h2>
            <input
              type="text"
              className="mb-2 mr-5 border border-gray-300 rounded px-2 py-1"
              value={editingPog.name}
              onChange={(e) => setEditingPog({ ...editingPog, name: e.target.value })}
            />
            <input
              type="text"
              className="mb-2 border border-gray-300 rounded px-2 py-1"
              value={editingPog.ticker_symbol}
              onChange={(e) => setEditingPog({ ...editingPog, ticker_symbol: e.target.value })}
            />
            <input
              type="number"
              className="mb-2 mr-5 border border-gray-300 rounded px-2 py-1"
              value={editingPog.price}
              onChange={(e) => setEditingPog({ ...editingPog, price: parseFloat(e.target.value) })}
            />
            <input
              type="text"
              className="mb-2 border border-gray-300 rounded px-2 py-1"
              value={editingPog.color}
              onChange={(e) => setEditingPog({ ...editingPog, color: e.target.value })}
            />
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={() => handleUpdatePog(editingPog)}
              >
                Save
              </button>
              <button
                type="button"
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => setEditingPog(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PogsList;