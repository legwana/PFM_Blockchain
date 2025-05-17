import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import web3 from '../utils/web3';
import RectangleArtifact from '../contracts/Rectangle.json';
import BlockchainInfo from './BlockchainInfo';

const InitializeExercice7 = () => {
  const [posX, setPosX] = useState('0');
  const [posY, setPosY] = useState('0');
  const [longueur, setLongueur] = useState('10');
  const [largeur, setLargeur] = useState('5');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [deployedAddress, setDeployedAddress] = useState('');
  const navigate = useNavigate();

  const handleDeploy = async () => {
    if (isNaN(parseInt(posX)) || isNaN(parseInt(posY)) || 
        isNaN(parseInt(longueur)) || isNaN(parseInt(largeur)) ||
        parseInt(longueur) <= 0 || parseInt(largeur) <= 0) {
      setError("Veuillez entrer des valeurs numériques valides. La longueur et la largeur doivent être positives.");
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      // Get accounts
      const accounts = await web3.eth.getAccounts();
      if (!accounts || accounts.length === 0) {
        throw new Error('Aucun compte trouvé. Veuillez vous connecter à MetaMask.');
      }

      const account = accounts[0];
      
      console.log('Déploiement du contrat Rectangle avec les valeurs:');
      console.log('Position X:', posX, 'Y:', posY);
      console.log('Dimensions: Longueur =', longueur, ', Largeur =', largeur);

      // Create contract instance
      const contract = new web3.eth.Contract(RectangleArtifact.abi);
      
      // Estimate gas
      const gasEstimate = await contract.deploy({
        data: RectangleArtifact.bytecode,
        arguments: [parseInt(posX), parseInt(posY), parseInt(longueur), parseInt(largeur)]
      }).estimateGas({
        from: account
      });
      
      // Deploy the contract
      const deployedContract = await contract.deploy({
        data: RectangleArtifact.bytecode,
        arguments: [parseInt(posX), parseInt(posY), parseInt(longueur), parseInt(largeur)]
      }).send({
        from: account,
        gas: Math.floor(gasEstimate * 1.2) // Add 20% buffer
      });
      
      setDeployedAddress(deployedContract.options.address);
      setSuccess(true);
      
      console.log('Contract deployed at:', deployedContract.options.address);
      
      // Store the deployed contract address in localStorage
      localStorage.setItem('exercice7Address', deployedContract.options.address);
      
    } catch (err) {
      console.error('Error deploying contract:', err);
      setError(err.message || 'Error deploying contract');
    } finally {
      setLoading(false);
    }
  };
  
  const goToExercise = () => {
    navigate('/exercise7');
  };

  return (
    <div className="container">
      <h1>Initialisation du Rectangle (Exercice 7)</h1>
      
      <BlockchainInfo />
      
      <div className="card">
        <h3>Personnaliser votre Rectangle</h3>
        <p>Vous pouvez définir la position et les dimensions de votre Rectangle.</p>
        
        <div className="row">
          <div className="col-md-6">
            <h4>Position</h4>
            <div className="form-group">
              <label>Position X:</label>
              <input 
                type="number" 
                className="form-control" 
                value={posX} 
                onChange={(e) => setPosX(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Position Y:</label>
              <input 
                type="number" 
                className="form-control" 
                value={posY} 
                onChange={(e) => setPosY(e.target.value)}
              />
            </div>
          </div>
          
          <div className="col-md-6">
            <h4>Dimensions</h4>
            <div className="form-group">
              <label>Longueur:</label>
              <input 
                type="number" 
                className="form-control" 
                value={longueur} 
                onChange={(e) => setLongueur(e.target.value)}
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label>Largeur:</label>
              <input 
                type="number" 
                className="form-control" 
                value={largeur} 
                onChange={(e) => setLargeur(e.target.value)}
                min="1"
              />
            </div>
          </div>
        </div>
        
        <button 
          className="btn btn-primary"
          onClick={handleDeploy}
          disabled={loading}
          style={{ marginTop: '20px' }}
        >
          {loading ? 'Déploiement...' : 'Déployer le Rectangle'}
        </button>
      </div>
      
      {error && (
        <div className="card" style={{ color: 'red', marginTop: '10px' }}>
          {error}
        </div>
      )}
      
      {success && (
        <div className="card" style={{ marginTop: '10px' }}>
          <h3>Rectangle déployé avec succès!</h3>
          <p>Adresse du contrat: {deployedAddress}</p>
          <button 
            className="btn btn-success" 
            onClick={goToExercise}
            style={{ marginTop: '10px' }}
          >
            Aller à l'Exercice 7
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

export default InitializeExercice7; 