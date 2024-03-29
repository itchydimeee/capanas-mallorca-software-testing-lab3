import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PogsForm from './pogs';
import ReadPogs from './readPogs';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PogsForm />} />
        <Route path="/readPogs" element={<ReadPogs />} />
      </Routes>
    </Router>
  );
};

export default App;