import React from 'react';
import { Link } from 'react-router-dom';
import BlockchainInfo from './BlockchainInfo';

const Home = () => {
  const exercises = [
    { id: 1, name: 'Addition Functions' },
    { id: 2, name: 'Ether/Wei Conversion' },
    { id: 3, name: 'String Manipulation' },
    { id: 4, name: 'Positive Number Check' },
    { id: 5, name: 'Even Number Check' },
    { id: 6, name: 'Array Manipulation' },
    { id: 7, name: 'OOP with Shapes' },
    { id: 8, name: 'Payment Handling' }
  ];

  return (
    <div className="container">
      <h1>PFM Blockchain - TP3 Exercises</h1>
      
      <BlockchainInfo />
      
      <div className="card">
        <h2>Select an Exercise</h2>
        <ul className="nav-list">
          {exercises.map(exercise => (
            <li key={exercise.id}>
              <Link 
                to={`/exercise${exercise.id}`} 
                className="nav-item"
              >
                Exercise {exercise.id}: {exercise.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home; 