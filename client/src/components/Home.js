import React from 'react';
import { Link } from 'react-router-dom';
import BlockchainInfo from './BlockchainInfo';

const Home = () => {
  const exercises = [
    { id: 1, name: 'Fonctions d\'Addition' },
    { id: 2, name: 'Conversion Ether/Wei' },
    { id: 3, name: 'Manipulation de Chaînes' },
    { id: 4, name: 'Vérification de Nombre Positif' },
    { id: 5, name: 'Vérification de Nombre Pair' },
    { id: 6, name: 'Manipulation de Tableaux' },
    { id: 7, name: 'POO avec Formes' },
    { id: 8, name: 'Gestion des Paiements' }
  ];

  return (
    <div className="container">
      <h1>PFM Blockchain - TP3 Exercices</h1>
      
      <BlockchainInfo />
      
      <div className="card">
        <h2>Sélectionnez un Exercice</h2>
        <ul className="nav-list">
          {exercises.map(exercice => (
            <li key={exercice.id}>
              <Link 
                to={`/exercise${exercice.id}`} 
                className="nav-item"
              >
                Exercice {exercice.id}: {exercice.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Home; 