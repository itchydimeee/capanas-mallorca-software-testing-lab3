import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const UserPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const [pogs, setPogs] = useState([]);

  useEffect(() => {
    getPogs();
  }, []);

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

  return (
    <div>
      <h1>User Page</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <div>
          {pogs.length > 0 ? (
            <div>
              {pogs.map((pog: any) => (
                <div key={pog.id} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                  <h2>{pog.name}</h2>
                  <p>Ticker Symbol: {pog.ticker_symbol}</p>
                  <p>Price: {pog.price}</p>
                  <p>Color: {pog.color}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No pogs available.</p>
          )}
        </div>
      ) : (
        <p>Please log in to view pogs.</p>
      )}
    </div>
  );
};

export default UserPage;
