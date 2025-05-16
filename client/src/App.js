import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Exercise1 from './components/Exercise1';
import Exercise2 from './components/Exercise2';
import Exercise3 from './components/Exercise3';
import Exercise4 from './components/Exercise4';
import Exercise5 from './components/Exercise5';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise1" element={<Exercise1 />} />
        <Route path="/exercise2" element={<Exercise2 />} />
        <Route path="/exercise3" element={<Exercise3 />} />
        <Route path="/exercise4" element={<Exercise4 />} />
        <Route path="/exercise5" element={<Exercise5 />} />
        {/* Additional routes will be added for other exercises */}
      </Routes>
    </Router>
  );
}

export default App; 