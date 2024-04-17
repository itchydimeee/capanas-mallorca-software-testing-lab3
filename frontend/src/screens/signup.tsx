// SignupForm.tsx
import React, { useState } from 'react';

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission (e.g., send data to server)
    console.log(formData);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="username" className="text-sm font-bold">
            Username:
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="rounded-md border border-gray-300 px-3 py-2"
          />
        </div>
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
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignupForm;