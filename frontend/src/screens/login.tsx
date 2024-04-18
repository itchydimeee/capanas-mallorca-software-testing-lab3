import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginForm: React.FC = () => {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginWithRedirect({
      authorizationParams: {
        redirect_uri: window.location.origin,
      },
      appState: {
        returnTo: '/pogs',
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="spinner border-4 border-blue-500 rounded-full w-12 h-12 animate-spin"></div>
      </div>
    );
  }

  if (isAuthenticated) {
    window.location.replace('/pogs');
    return null;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Capanas and Mallorca Pogs Center
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4 text-center">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;