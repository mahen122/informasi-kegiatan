import React from 'react';
import { Routes, Route } from 'react-router-dom';
import InfoDisplay from './components/InfoDisplay/InfoDisplay';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<InfoDisplay />} />
      </Routes>
    </div>
  );
}

export default App;

