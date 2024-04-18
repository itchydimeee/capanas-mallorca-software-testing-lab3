import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PogsForm from './screens/pogs';
import PogsList from './screens/readPogs';
import NewPage from './screens/newPage';
import RenderPogs from './screens/renderPogs';
import LoginForm from './screens/login';
import SignupForm from './screens/signup';
import UserPage from './screens/user';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm/>} />
        <Route path="/signup" element={<SignupForm/>} />
        <Route path="/pogs" element={<PogsForm />} />
        <Route path="/readPogs" element={<PogsList />} />
        <Route path="/test-pogs" element={<NewPage />} />
        <Route path="/render-pogs" element={<RenderPogs />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </Router>
  );
};

export default App;