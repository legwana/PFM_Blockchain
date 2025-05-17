import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice4 } from '../utils/contracts';
import BlockchainInfo from './BlockchainInfo';

const Exercice4 = () => {
  const [contract, setContract] = useState(null);
  const [nombre, setNombre] = useState('');
  const [resultat, setResultat] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const initialiserContrat = async () => {
      try {
        const instanceContrat = await getExercice4();
        setContract(instanceContrat);
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
        setErreur("Échec du chargement du contrat");
      }
    };
    initialiserContrat();
  }, []);

  const verifierPositivite = async () => {
    if (!contract) return;
    
    try {
      setChargement(true);
      setErreur('');
      
      if (nombre === '' || isNaN(parseInt(nombre))) {
        setErreur("Veuillez entrer un nombre entier valide");
        setChargement(false);
        return;
      }
      
      const estPositif = await contract.methods.estPositif(parseInt(nombre)).call();
      setResultat(estPositif);
    } catch (err) {
      console.error("Erreur de vérification:", err);
      setErreur("Erreur lors de la vérification");
    }
    setChargement(false);
  };

  return (
    <div className="container">
      <h1>Exercice 4 : Vérification de Positivité</h1>
      
      <BlockchainInfo />
      
      {erreur && <div className="card erreur">{erreur}</div>}
      
      {contract ? (
        <div className="card">
          <h3>Vérificateur de Nombre Positif</h3>
          <div className="form-group">
            <label>Entrez un nombre entier :</label>
            <input
              type="number"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ex: -5, 0, 10"
            />
          </div>
          <button onClick={verifierPositivite} disabled={chargement}>
            {chargement ? 'Vérification...' : 'Vérifier la Positivité'}
          </button>
          
          {resultat !== null && (
            <div className="resultat">
              <p>Le nombre {nombre} est {resultat ? 'positif ✅' : 'non positif ❌'}</p>
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

export default Exercice4;