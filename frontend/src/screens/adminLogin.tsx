import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { adminEmails } from '../components/admin';

const AdminLogin: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      if (user && isUserAdmin(user)) {
        navigate('/pogs');
      } else {
        alert('Not an Admin Email');
      }
    }
  }, [isAuthenticated, isLoading, user, navigate]);

  const isUserAdmin = (user: any) => {
    return user.email && adminEmails.includes(user.email);
  };

  const handleReturn = () => {
    window.history.back();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner border-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    return (
      <div className="flex justify-center items-center flex-col h-screen">
        <p>You are not authorized to access the admin page.</p>
        <button onClick={handleReturn} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
          Return
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Capanas and Mallorca Pogs Center
        </h1>
        <p className="text-center">Please log in</p>
      </div>
    </div>
  );
};

export default AdminLogin;
