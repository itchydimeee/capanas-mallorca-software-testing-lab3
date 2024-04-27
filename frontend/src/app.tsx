import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PogsForm from './screens/pogs';
import PogsList from './screens/readPogs';
import NewPage from './screens/newPage';
import LoginForm from './screens/login';
import UserPage from './screens/user';
import AdminLogin from './screens/adminLogin';
import CheckoutPage from './screens/checkout';
import InventoryPage from './screens/inventory';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm/>} />
        <Route path="/adminLogin" element={<AdminLogin/>} />
        <Route path="/pogs" element={<PogsForm />} />
        <Route path="/readPogs" element={<PogsList />} />
        <Route path="/test-pogs" element={<NewPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/inventory" element={<InventoryPage />} />
      </Routes>
    </Router>
  );
};

export default App;