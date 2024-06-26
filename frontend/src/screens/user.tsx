import React, { useState, useEffect } from 'react';
import { User, useAuth0 } from '@auth0/auth0-react';
import useNavigation from '../components/navigation';
import { useNavigate } from 'react-router-dom';
import PogMarquee from '../components/marquee';
import { Pog } from '../components/types';
import {
  fetchUserFromDatabase,
  createUserInDatabase,
  updateUserInDatabase
} from '../components/utils';




const UserPage: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth0();
  const [pogs, setPogs] = useState<Pog[]>([]);
  const [selectedPogs, setSelectedPogs] = useState<Pog[]>([]);
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const { ToAdminLogin, ToCheckout, ToInventory } = useNavigation(
    (selectedPogs: Pog[]) => {
      navigate('/checkout', { state: { selectedPogs } });
    }
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBalance = async () => {
      try {
        if (user?.sub) {
          const balance = await fetchUserBalanceFromDatabase(user.sub);
          setUserBalance(balance);
        }
      } catch (error) {
        console.error('Error fetching user balance:', error);
      }
    };
    getPogs();
    fetchUserBalance();
    if (user) {
      handleUserData(user);
    }
  }, [user]);

  const fetchUserBalanceFromDatabase = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:3000/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const userData = await response.json();
      return userData.balance;
    } catch (error) {
      console.error('Error fetching user balance:', error);
      throw error;
    }
  };

  const getPogs = async () => {
    try {
      const response = await fetch('http://localhost:3000/pogs', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
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

  const handleCheckout = (pog: Pog) => {
    const updatedSelectedPogs = [...selectedPogs, pog];
    setSelectedPogs(updatedSelectedPogs);
    ToCheckout(updatedSelectedPogs);
  };
  const handleLogout = async () => {
    await logout({ logoutParams: { returnTo: window.location.origin } });
  };

  const handleUserData = async (user: User) => {
    try {
      const auth0Id = user?.sub;
      if (typeof auth0Id === 'string') {
        const existingUser = await fetchUserFromDatabase(auth0Id);

        if (existingUser) {
          const updatedUser = await updateUserInDatabase(auth0Id, {
            name: user.name || '',
            email: user.email || '',
            balance: existingUser.balance
          });
          console.log('User updated:', updatedUser);
        } else {
          const newUser = await createUserInDatabase(auth0Id, user);
          console.log('New user created:', newUser);
        }
      } else {
        console.error('Invalid auth0Id:', auth0Id);
      }
    } catch (error) {
      console.error('Error handling user data:', error);
    }
  };

  return (
    <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
      <h1 className='text-3xl font-bold mb-6'>User Page</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : isAuthenticated ? (
        <div>
          <PogMarquee pogs={pogs} />
          <button
            className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-6'
            onClick={handleLogout}
          >
            Logout
          </button>
          <button
            type='button'
            onClick={ToAdminLogin}
            className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300'
          >
            Admin Login
          </button>
          <button
            onClick={ToInventory}
            className='bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300'
          >
            Inventory
          </button>
          {userBalance !== null && <p>Money Balance: {userBalance}</p>}
          {pogs.length > 0 ? (
            <div>
              <div className='bg-gray-100 rounded-lg p-6 mb-6'>
                {user?.picture && (
                  <img
                    src={user.picture}
                    alt={user?.name}
                    className='w-20 h-20 rounded-full mb-4'
                  />
                )}
                <h2 className='text-2xl font-bold mb-2'>{user?.name}</h2>
                <p className='text-gray-600'>{user?.email}</p>
              </div>
              {pogs.map(pog => (
                <div
                  key={pog.id}
                  className='bg-white rounded-lg shadow-md p-6 mb-6'
                >
                  <h2 className='text-xl font-bold mb-2'>{pog.name}</h2>
                  <p className='text-gray-600 mb-2'>
                    Ticker Symbol: {pog.ticker_symbol}
                  </p>
                  <p className='text-gray-600 mb-2'>Price: {pog.price}</p>
                  <p className='text-gray-600 mb-2'>Color: {pog.color}</p>
                  <button
                    type='button'
                    className='bg-green-600 hover:bg-green-500 px-4 py-2 text-white rounded-md mb-5'
                    onClick={() => handleCheckout(pog)}
                  >
                    Checkout
                  </button>
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
