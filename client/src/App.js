import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Exercise1 from './components/Exercise1';
import Exercise2 from './components/Exercise2';
import Exercise3 from './components/Exercise3';
import Exercise4 from './components/Exercise4';
import Exercise5 from './components/Exercise5';
import Exercise6 from './components/Exercise6';
import Exercise7 from './components/Exercise7';
import Exercise8 from './components/Exercise8';
import InitializeExercice6 from './components/InitializeExercice6';
import InitializeExercice7 from './components/InitializeExercice7';

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
        <Route path="/exercise6" element={<Exercise6 />} />
        <Route path="/initialize-exercice6" element={<InitializeExercice6 />} />
        <Route path="/exercise7" element={<Exercise7 />} />
        <Route path="/initialize-exercice7" element={<InitializeExercice7 />} />
        <Route path="/exercise8" element={<Exercise8 />} />
      </Routes>
    </Router>
  );
}

export default App; 