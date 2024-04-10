import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PogsForm from './pogs';
import PogsList from './readPogs';
import NewPage from './newPage';
import RenderPogs from './renderPogs';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PogsForm />} />
        <Route path="/readPogs" element={<PogsList />} />
        <Route path="/test-pogs" element={<NewPage />} />
        <Route path="/render-pogs" element={<RenderPogs />} />
      </Routes>
    </Router>
  );
};

export default App;