import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice1 } from '../utils/contracts';
import BlockchainInfo from './BlockchainInfo';

const Exercise1 = () => {
  const [contract, setContract] = useState(null);
  const [stateValues, setStateValues] = useState({ a: '0', b: '0' });
  const [inputValues, setInputValues] = useState({ x: '', y: '' });
  const [result1, setResult1] = useState('');
  const [result2, setResult2] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initContract = async () => {
      try {
        const contractInstance = await getExercice1();
        setContract(contractInstance);
        
        if (contractInstance) {
          const a = await contractInstance.methods.a().call();
          const b = await contractInstance.methods.b().call();
          setStateValues({ a, b });
        }
      } catch (err) {
        console.error("Error initializing contract:", err);
        setError("Failed to load contract. Please check if Ganache is running and contracts are deployed.");
      }
    };

    initContract();
  }, []);

  const handleAddition1 = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      const result = await contract.methods.addition1().call();
      setResult1(result);
      setLoading(false);
    } catch (err) {
      console.error("Error calling addition1:", err);
      setError("Error calling addition1 function");
      setLoading(false);
    }
  };

  const handleAddition2 = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      const x = parseInt(inputValues.x);
      const y = parseInt(inputValues.y);
      
      if (isNaN(x) || isNaN(y)) {
        setError("Please enter valid numbers");
        setLoading(false);
        return;
      }
      
      const result = await contract.methods.addition2(x, y).call();
      setResult2(result);
      setLoading(false);
    } catch (err) {
      console.error("Error calling addition2:", err);
      setError("Error calling addition2 function");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h1>Exercice 1 : Fonctions d'Addition</h1>
      
      <BlockchainInfo />
      
      {error && <div className="card" style={{ color: 'red' }}>{error}</div>}
      
      {contract ? (
        <>
          <div className="card">
            <h2>Variables d'État</h2>
            <p>a = {stateValues.a}</p>
            <p>b = {stateValues.b}</p>
            
            <h3>Fonction 1 : Addition des Variables d'État (a + b)</h3>
            <button onClick={handleAddition1} disabled={loading}>
              {loading ? 'Chargement...' : 'Calculer a + b'}
            </button>
            {result1 && (
              <div className="result">
                <p>Résultat : {result1}</p>
              </div>
            )}
          </div>
          
          <div className="card">
            <h3>Fonction 2 : Addition de Deux Paramètres</h3>
            <div className="form-group">
              <label>Premier Nombre (x) :</label>
              <input
                type="number"
                name="x"
                value={inputValues.x}
                onChange={handleInputChange}
                placeholder="Entrez le premier nombre"
              />
            </div>
            <div className="form-group">
              <label>Deuxième Nombre (y) :</label>
              <input
                type="number"
                name="y"
                value={inputValues.y}
                onChange={handleInputChange}
                placeholder="Entrez le deuxième nombre"
              />
            </div>
            <button onClick={handleAddition2} disabled={loading}>
              {loading ? 'Chargement...' : 'Calculer x + y'}
            </button>
            {result2 && (
              <div className="result">
                <p>Résultat : {result2}</p>
              </div>
            )}
          </div>
        </>
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

export default Exercise1;