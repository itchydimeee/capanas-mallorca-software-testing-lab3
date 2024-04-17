import React, { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import useNavigation from '../components/navigation';

interface FormData {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: '', password: '' });
  const { loginWithRedirect } = useAuth0();
  const { ToSignUp } = useNavigation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-semibold">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-semibold">
            Password:
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Log In
        </button>
      </form>
      <button
        type="submit"
        className="text-blue hover-underline"
        onClick={ToSignUp}
      >
        Don't have an account??
      </button>
    </div>
  );
};

export default LoginForm;