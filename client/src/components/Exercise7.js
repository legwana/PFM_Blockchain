import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getExercice7 } from '../utils/contracts';
import BlockchainInfo from './BlockchainInfo';
import web3 from '../utils/web3';
import RectangleArtifact from '../contracts/Rectangle.json';

const Exercice7 = () => {
  const [contrat, setContrat] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ longueur: 0, largeur: 0 });
  const [surface, setSurface] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [isMockContract, setIsMockContract] = useState(false);
  const [networkConnected, setNetworkConnected] = useState(false);
  const [customContract, setCustomContract] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const initialiserContrat = async () => {
      try {
        console.log('Loading Exercise7 contract...');
        
        // Check network connection first
        try {
          const networkId = await web3.eth.net.getId();
          const accounts = await web3.eth.getAccounts();
          setNetworkConnected(accounts.length > 0);
          console.log('Network ID:', networkId, 'Connected accounts:', accounts);
        } catch (networkErr) {
          console.error('Network connection error:', networkErr);
          setNetworkConnected(false);
        }
        
        // Check if we have a custom deployed contract address
        const customContractAddress = localStorage.getItem('exercice7Address');
        let instance;
        
        if (customContractAddress) {
          console.log('Using custom deployed contract at:', customContractAddress);
          setCustomContract(true);
          instance = new web3.eth.Contract(
            RectangleArtifact.abi,
            customContractAddress
          );
        } else {
          // Use the standard contract from utils/contracts
          instance = await getExercice7();
        }
        
        // Check if this is a mock contract
        const isMock = !instance.options || 
                      !instance.options.address ||
                      instance.options.address === '0x0000000000000000000000000000000000000000' ||
                      instance._isMock;
        
        console.log('Is mock contract:', isMock);
        setIsMockContract(isMock);
        setContrat(instance);
        
        // Charger les valeurs initiales
        try {
        const x = await instance.methods.x().call();
        const y = await instance.methods.y().call();
          
          let longueur, largeur;
          // Try different method names (English/French)
          if (instance.methods.longueur) {
            longueur = await instance.methods.longueur().call();
            largeur = await instance.methods.largeur().call();
          } else if (instance.methods.length) {
            longueur = await instance.methods.length().call();
            largeur = await instance.methods.width().call();
          } else {
            throw new Error("Méthodes de dimensions non disponibles");
          }
        
        setPosition({ x, y });
        setDimensions({ longueur, largeur });
        } catch (dataErr) {
          console.error("Error loading initial data:", dataErr);
          
          // Set default values if using mock contract
          if (isMock) {
            setPosition({ x: 0, y: 0 });
            setDimensions({ longueur: 10, largeur: 5 });
          }
        }
        
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
        setErreur("Échec du chargement du contrat");
      }
    };
    
    initialiserContrat();
  }, []);

  const calculerSurface = async () => {
    if (!contrat) {
      setErreur("Contrat non disponible");
      return;
    }
    
    try {
      setChargement(true);
      setErreur('');
      
      // Try different method names
      let resultat;
      try {
        if (contrat.methods.surface) {
          resultat = await contrat.methods.surface().call();
        } else if (contrat.methods.area) {
          resultat = await contrat.methods.area().call();
        } else {
          throw new Error('Méthode de calcul de surface non disponible');
        }
      } catch (methodErr) {
        console.error("Error calling surface method:", methodErr);
        
        // Fallback: calculate manually
        if (isMockContract) {
          resultat = (parseInt(dimensions.longueur) * parseInt(dimensions.largeur)).toString();
        } else {
          throw methodErr;
        }
      }
      
      setSurface(resultat);
    } catch (err) {
      console.error("Erreur de calcul de la surface:", err);
      setErreur("Erreur de calcul de la surface");
    }
    setChargement(false);
  };

  const goToDeployCustom = () => {
    navigate('/initialize-exercice7');
  };

  const resetCustomContract = () => {
    localStorage.removeItem('exercice7Address');
    window.location.reload();
  };

  return (
    <div className="container">
      <h1>Exercice 7 : Programmation Orientée Objet</h1>
      
      <BlockchainInfo />
      
      {isMockContract && (
        <div className="alert alert-warning">
          Mode simulation: Vous utilisez une version simulée du contrat. Pour utiliser le vrai contrat, assurez-vous que MetaMask est connecté au réseau Ganache (1337).
          <div style={{ marginTop: '10px' }}>
            <button 
              className="btn btn-sm btn-primary" 
              onClick={goToDeployCustom}
            >
              Déployer un Rectangle personnalisé
            </button>
          </div>
        </div>
      )}

      {customContract && (
        <div className="alert alert-info">
          Vous utilisez un Rectangle personnalisé avec vos dimensions.
          <button 
            className="btn btn-sm btn-outline-secondary" 
            onClick={resetCustomContract}
            style={{ marginLeft: '10px' }}
          >
            Revenir au Rectangle par défaut
          </button>
        </div>
      )}
      
      {!networkConnected && (
        <div className="alert alert-warning">
          Vous n'êtes pas connecté à un réseau Ethereum. Veuillez vous connecter via MetaMask.
        </div>
      )}
      
      {erreur && <div className="card" style={{ color: 'red' }}>{erreur}</div>}
      
      {contrat ? (
        <>
          <div className="card">
            <h3>Propriétés du Rectangle</h3>
            
            <div className="proprietes">
              <div>
                <h4>Position</h4>
                <p>X: {position.x}</p>
                <p>Y: {position.y}</p>
              </div>
              
              <div>
                <h4>Dimensions</h4>
                <p>Longueur: {dimensions.longueur}</p>
                <p>Largeur: {dimensions.largeur}</p>
              </div>
            </div>

            <button 
              onClick={calculerSurface} 
              disabled={chargement}
              className="btn btn-primary"
              style={{ marginTop: '10px' }}
            >
              {chargement ? 'Calcul...' : 'Calculer la Surface'}
            </button>

            {surface !== null && (
              <div className="result" style={{ marginTop: '10px' }}>
                <p>Surface calculée : {surface} unités²</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card">
          <p>Chargement du contrat...</p>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/" className="nav-item" style={{ marginRight: '10px' }}>
        Retour à l'accueil
      </Link>
        <Link to="/initialize-exercice7" className="nav-item">
          Initialiser un nouveau Rectangle
        </Link>
      </div>
    </div>
  );
};

export default Exercice7;