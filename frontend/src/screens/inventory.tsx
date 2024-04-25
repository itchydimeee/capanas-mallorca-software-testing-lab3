import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useNavigation from '../components/navigation';

interface InventoryItem {
  id: number;
  quantity: number;
  pog: {
    id: number;
    name: string;
    ticker_symbol: string;
    price: number;
    color: string;
  };
}

const InventoryPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedPogId, setSelectedPogId] = useState<number | null>(null);
  const [quantityToSell, setQuantityToSell] = useState<number>(0);
  const { ToUserPage } = useNavigation();

  const fetchInventory = async () => {
    if (user?.sub) {
      try {
        const response = await fetch(`http://localhost:3000/inventory/${user.sub}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch inventory');
        }
        const data = await response.json();
        setInventory(data);
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error fetching inventory:', error);
          alert(`Error fetching your inventory: ${error.message}`);
        } else {
          console.error('Unexpected error fetching inventory:', error);
          alert('An unexpected error occurred while fetching your inventory. Please try again later.');
        }
      }
    } else {
      console.log('User sub is undefined');
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchInventory();
    }
  }, [isAuthenticated, user?.sub]);

  const handleSellPogs = (pogId: number) => {
    setSelectedPogId(pogId);
  };

  const handleConfirmSell = async () => {
    if (selectedPogId && quantityToSell > 0) {
      try {
        const response = await fetch('http://localhost:3000/sell', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: user?.sub,
            pogId: selectedPogId,
            quantityToSell,
          }),
        });

        if (!response.ok) {
          const errorStatus = response.status;
          let errorMessage = 'Failed to sell pogs';

          // Check the response status and handle the error accordingly
          if (errorStatus === 404) {
            errorMessage = 'Pog or user not found';
          } else if (errorStatus === 400) {
            errorMessage = 'Insufficient quantity to sell';
          } else {
            // Try to get the error message from the response
            try {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } catch (e) {
              // If the response is not valid JSON, use the default error message
            }
          }

          throw new Error(errorMessage);
        }

        const { totalSaleAmount } = await response.json();
        alert(`You sold ${quantityToSell} pogs for $${totalSaleAmount}`);
        setQuantityToSell(0);
        setSelectedPogId(null);
        await fetchInventory();
      } catch (error) {
        if (error instanceof Error) {
          console.error('Error selling pogs:', error);
          alert(`Error selling pogs: ${error.message}`);
        } else {
          console.error('Unexpected error selling pogs:', error);
          alert('An unexpected error occurred while selling pogs. Please try again later.');
        }
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <button onClick={ToUserPage} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-6">
        Back
      </button>
      <h1 className="text-3xl font-bold mb-6">Your Inventory</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <div>
          {inventory.filter((item) => item.quantity > 0).length > 0 ? (
            <div>
              {inventory.filter((item) => item.quantity > 0).map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-bold mb-2">{item.pog.name}</h2>
                  <p className="text-gray-600 mb-2">Ticker Symbol: {item.pog.ticker_symbol}</p>
                  <p className="text-gray-600 mb-2">Price: {item.pog.price}</p>
                  <p className="text-gray-600 mb-2">Color: {item.pog.color}</p>
                  <p className="text-gray-600 mb-2">Quantity: {item.quantity}</p>
                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSellPogs(item.pog.id)}
                      className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Sell
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Your inventory is empty.</p>
          )}
        </div>
      ) : (
        <p>Please log in to view your inventory.</p>
      )}

      {selectedPogId && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-2">Confirm Sale</h2>
            <p className="text-gray-600 mb-2">You are about to sell {quantityToSell} pogs.</p>
            <label htmlFor="quantity-to-sell" className="mr-2">
              Quantity to sell:
            </label>
            <input
              type="number"
              id="quantity-to-sell"
              min="1"
              max={inventory.find((item) => item.pog.id === selectedPogId)?.quantity}
              value={quantityToSell}
              onChange={(e) => setQuantityToSell(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1"
            />
            <button
              onClick={handleConfirmSell}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Confirm Sell
            </button>
            <button
              onClick={() => setSelectedPogId(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded ml-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage