import React from 'react';

const PogItem: React.FC<{
  pog: {
    id: number;
    name: string;
    ticker_symbol: string;
    price: number;
    color: string;
  };
  setEditingPog: (pog: {
    id: number;
    name: string;
    ticker_symbol: string;
    price: number;
    color: string;
  } | null) => void;
  handleDeletePog: (pogId: number) => void;
}> = ({ pog, setEditingPog, handleDeletePog }) => {
  return (
    <div key={pog.id} className="bg-white shadow-md rounded-lg p-4" role="listitem" data-testid="pog-item">
      {pog && <p data-testid="poglist"></p>}
      <p data-testid="pog-name">
        <strong>Name:</strong> {pog.name}
      </p>
      <p data-testid="pog-ticker-symbol">
        <strong>Ticker Symbol:</strong> {pog.ticker_symbol}
      </p>
      <p data-testid="pog-price">
        <strong>Price:</strong> {pog.price}
      </p>
      <p data-testid="pog-color">
        <strong>Color:</strong> {pog.color}
      </p>
      <div className="flex justify-end">
        <button
          data-testid={`update-button-${pog.id}`}
          type="button"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={() => setEditingPog(pog)}
        >
          Update
        </button>
        <button
          type="button"
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => handleDeletePog(pog.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default PogItem;