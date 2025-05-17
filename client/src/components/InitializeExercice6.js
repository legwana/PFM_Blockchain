import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import web3 from '../utils/web3';
import Exercice6Artifact from '../contracts/Exercice6.json';
import BlockchainInfo from './BlockchainInfo';

const InitializeExercice6 = () => {
  const [initialValues, setInitialValues] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState('');
  const navigate = useNavigate();

  const handleDeploy = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Parse the initial values
      let parsedValues = [];
      if (initialValues.trim() !== '') {
        try {
          // Split by comma and convert to integers
          parsedValues = initialValues.split(',')
            .map(value => value.trim())
            .filter(value => value !== '')
            .map(value => {
              const num = parseInt(value);
              if (isNaN(num)) {
                throw new Error(`Invalid value: ${value}`);
              }
              return num;
            });
        } catch (err) {
          throw new Error(`Failed to parse initial values: ${err.message}`);
        }
      }

      // Get accounts
      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please connect to MetaMask.');
      }

      const account = accounts[0];
      
      // Create contract instance
      const contract = new web3.eth.Contract(Exercice6Artifact.abi);
      
      // Estimate gas
      const gas = await web3.eth.getGasPrice();
      
      // Deploy the contract
      console.log('Deploying contract with initial values:', parsedValues);
      const deployTransaction = contract.deploy({
        data: Exercice6Artifact.bytecode,
        arguments: [parsedValues]
      });
      
      const gasEstimate = await deployTransaction.estimateGas();
      
      const deployedContract = await deployTransaction.send({
        from: account,
        gas: Math.floor(gasEstimate * 1.2) // Add 20% buffer
      });
      
      setDeployedAddress(deployedContract.options.address);
      setSuccess(true);
      
      console.log('Contract deployed at:', deployedContract.options.address);
      
      // Store the deployed contract address in localStorage
      localStorage.setItem('exercice6Address', deployedContract.options.address);
      
    } catch (err) {
      console.error('Error deploying contract:', err);
      setError(err.message || 'Error deploying contract');
    } finally {
      setLoading(false);
    }
  };
  
  const goToExercise = () => {
    navigate('/exercise6');
  };

  return (
    <div className="container">
      <h1>Initialisation du contrat Exercice 6</h1>
      
      <BlockchainInfo />
      
      <div className="card">
        <h3>Valeurs initiales pour le tableau</h3>
        <p>Entrez les valeurs initiales séparées par des virgules (ex: 5,10,15). Laissez vide pour utiliser les valeurs par défaut [10, 20, 30].</p>
        
        <div className="form-group">
          <input 
            type="text" 
            className="form-control" 
            value={initialValues} 
            onChange={(e) => setInitialValues(e.target.value)}
            placeholder="Ex: 5,10,15,20"
          />
          
          <button 
            className="btn btn-primary"
            onClick={handleDeploy}
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            {loading ? 'Déploiement...' : 'Déployer le contrat'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="card" style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="card" style={{ marginTop: '10px' }}>
          <h3>Contrat déployé avec succès!</h3>
          <p>Adresse du contrat: {deployedAddress}</p>
          <button 
            className="btn btn-success" 
            onClick={goToExercise}
            style={{ marginTop: '10px' }}
          >
            Aller à l'Exercice 6
          </button>
        </div>
      )}
      
      <button 
        className="btn btn-secondary" 
        onClick={() => navigate('/')}
        style={{ marginTop: '20px' }}
      >
        Retour à l'accueil
      </button>
    </div>
  );
};

export default InitializeExercice6; 