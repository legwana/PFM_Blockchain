import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice5 } from '../utils/contracts';
import BlockchainInfo from './BlockchainInfo';

const Exercice5 = () => {
  const [contract, setContract] = useState(null);
  const [nombre, setNombre] = useState('');
  const [resultat, setResultat] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const initialiserContrat = async () => {
      try {
        const instanceContrat = await getExercice5();
        setContract(instanceContrat);
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
        setErreur("Échec du chargement du contrat");
      }
    };
    initialiserContrat();
  }, []);

  const verifierParite = async () => {
    if (!contract) return;
    
    try {
      setChargement(true);
      setErreur('');
      
      if (nombre === '' || isNaN(parseInt(nombre))) {
        setErreur("Veuillez entrer un nombre valide");
        return;
      }
      
      const nombreEntier = parseInt(nombre);
      if (nombreEntier < 0) {
        setErreur("Le nombre doit être non négatif");
        return;
      }
      
      const estPair = await contract.methods.estPair(nombreEntier).call();
      setResultat(estPair);
    } catch (err) {
      setErreur("Erreur lors de la vérification");
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="container">
      <h1>Exercice 5 : Vérification de Parité</h1>
      
      <BlockchainInfo />
      
      {erreur && <div className="card erreur">{erreur}</div>}
      
      {contract ? (
        <div className="card">
          <h3>Vérificateur de Nombre Pair</h3>
          <div className="form-group">
            <label>Entrez un nombre entier non négatif :</label>
            <input
              type="number"
              min="0"
              step="1"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ex: 0, 4, 7"
            />
          </div>
          <button onClick={verifierParite} disabled={chargement}>
            {chargement ? 'Vérification...' : 'Vérifier la Parité'}
          </button>
          
          {resultat !== null && (
            <div className="resultat">
              <p>Le nombre {nombre} est {resultat ? 'pair' : 'impair'}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="card">
          <p>Chargement du contrat...</p>
        </div>
      )}
      
      <Link to="/" className="nav-item" style={{ display: 'inline-block', marginTop: '20px' }}>
        Retour à l'accueil
      </Link>
    </div>
  );
};

export default Exercice5;