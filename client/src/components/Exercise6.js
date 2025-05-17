import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice6 } from '../utils/contracts';
import web3 from '../utils/web3';
import BlockchainInfo from './BlockchainInfo';
import Exercice6Artifact from '../contracts/Exercice6.json';

const Exercice6 = () => {
  const [contrat, setContrat] = useState(null);
  const [nombres, setNombres] = useState([]);
  const [somme, setSomme] = useState(null);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [indexRecherche, setIndexRecherche] = useState('');
  const [elementIndex, setElementIndex] = useState('');
  const [isMockContract, setIsMockContract] = useState(false);
  const [customContract, setCustomContract] = useState(false);
  const [inputNombre, setInputNombre] = useState('');
  const [inputIndex, setInputIndex] = useState('');

  useEffect(() => {
    const chargerContrat = async () => {
      try {
        console.log('Loading Exercise6 contract...');
        
        const customContractAddress = localStorage.getItem('exercice6Address');
        let exercice6Contract;
        
        if (customContractAddress) {
          console.log('Using custom deployed contract at:', customContractAddress);
          setCustomContract(true);
          exercice6Contract = new web3.eth.Contract(
            Exercice6Artifact.abi,
            customContractAddress
          );
        } else {
          exercice6Contract = await getExercice6();
        }
        
        console.log('Contract loaded:', exercice6Contract);
        
        console.log('Contract methods:', Object.keys(exercice6Contract.methods));
        console.log('Contract options:', exercice6Contract.options);
        
        const isMock = !exercice6Contract.options || 
                      !exercice6Contract.options.address ||
                      exercice6Contract.options.address === '0x0000000000000000000000000000000000000000';
                      
        console.log('Is mock contract:', isMock);
        console.log('Contract address:', exercice6Contract.options?.address);
        setIsMockContract(isMock);
        setContrat(exercice6Contract);
        await chargerDonnees(exercice6Contract);
      } catch (erreur) {
        console.error('Erreur lors du chargement du contrat:', erreur);
        setErreur('Erreur de chargement du contrat');
      }
    };

    chargerContrat();
  }, []);

  const chargerDonnees = async (contractInstance) => {
    try {
      console.log('Loading array data...');
      const array = await contractInstance.methods.afficheTableau().call();
      console.log('Array loaded:', array);
      setNombres(array);
      
      const sum = await contractInstance.methods.calculerSomme().call();
      console.log('Sum loaded:', sum);
      setSomme(sum);
    } catch (erreur) {
      console.error('Erreur lors du chargement des données:', erreur);
      setErreur('Erreur de chargement des données');
    }
  };

  const ajouterNombre = async () => {
    if (!contrat) {
      setErreur("Contrat non disponible");
      return;
    }
    
    if (inputNombre === '' || isNaN(parseInt(inputNombre))) {
      setErreur("Veuillez entrer un nombre valide");
      return;
    }

    try {
      setChargement(true);
      setErreur('');
      console.log("Ajout du nombre:", inputNombre);
      
      const accounts = await web3.eth.getAccounts();
      console.log("Available accounts:", accounts);
      
      if (!accounts || accounts.length === 0) {
        throw new Error("Aucun compte disponible. Veuillez vous connecter à MetaMask.");
      }
      
      const account = accounts[0];
      console.log("Using account:", account);
      
      const balance = await web3.eth.getBalance(account);
      console.log("Account balance:", web3.utils.fromWei(balance, 'ether'), "ETH");
      
      const numberToAdd = parseInt(inputNombre);
      console.log(`Sending transaction to add number: ${numberToAdd}`);
      
      let gasEstimate = 300000;
      
      if (!isMockContract) {
        try {
          console.log("Estimating gas...");
          gasEstimate = await contrat.methods.ajouterNombre(numberToAdd).estimateGas({ from: account });
          console.log("Estimated gas:", gasEstimate);
          gasEstimate = Math.floor(gasEstimate * 1.2);
        } catch (gasError) {
          console.warn("Gas estimation failed, using default:", gasError);
        }
      }
      
      console.log("Sending transaction with gas:", gasEstimate);
      const transaction = await contrat.methods.ajouterNombre(numberToAdd).send({
        from: account,
        gas: gasEstimate
      });
      
      console.log("Transaction successful:", transaction);
      setInputNombre('');
      
      await chargerDonnees(contrat);
    } catch (err) {
      console.error("Erreur lors de l'ajout du nombre:", err);
      setErreur(err.message || "Erreur lors de l'ajout du nombre");
    } finally {
      setChargement(false);
    }
  };

  const rechercherElement = async () => {
    if (!contrat || inputIndex === '' || isNaN(inputIndex)) {
      setErreur("Veuillez entrer un index valide");
      return;
    }

    try {
      setChargement(true);
      setErreur('');
      console.log("Recherche de l'élément à l'index:", inputIndex);
      
      const element = await contrat.methods.getElement(parseInt(inputIndex)).call();
      console.log("Element trouvé:", element);
      setElementIndex(element);
      setIndexRecherche(inputIndex);
    } catch (erreur) {
      console.error("Erreur lors de la recherche de l'élément:", erreur);
      setErreur("Index hors limites");
    } finally {
      setChargement(false);
    }
  };

  const resetCustomContract = () => {
    localStorage.removeItem('exercice6Address');
    window.location.reload();
  };

  return (
    <div className="container">
      <h1>Exercice 6 - Liste de Nombres</h1>
      
      <BlockchainInfo />
      
      {isMockContract && (
        <div className="alert alert-warning">
          Mode simulation: Vous utilisez une version simulée du contrat. Pour utiliser le vrai contrat, assurez-vous que MetaMask est connecté au réseau Ganache (1337).
        </div>
      )}

      {customContract && (
        <div className="alert alert-info">
          Vous utilisez un contrat personnalisé avec vos valeurs initiales.
          <button 
            className="btn btn-sm btn-outline-secondary ml-2" 
            onClick={resetCustomContract}
            style={{ marginLeft: '10px' }}
          >
            Revenir au contrat par défaut
          </button>
            </div>
      )}

      {erreur && <div className="card" style={{ color: 'red' }}>{erreur}</div>}

      <div className="card">
        <h3>Ajouter un nombre</h3>
        <div className="form-group">
          <input
            type="number"
            className="form-control" 
            value={inputNombre}
            onChange={(e) => setInputNombre(e.target.value)}
            placeholder="Entrez un nombre"
          />
          <button 
            className="btn btn-primary"
            onClick={ajouterNombre}
            disabled={chargement}
            style={{ marginTop: '10px' }}
          >
            {chargement ? 'Chargement...' : 'Ajouter'}
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Liste de nombres</h3>
        {nombres.length > 0 ? (
          <ul className="list-group">
            {nombres.map((nombre, index) => (
              <li key={index} className="list-group-item">
                {nombre.toString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun nombre dans la liste</p>
        )}
      </div>

      <div className="card">
        <h3>Somme des nombres</h3>
        <p>{somme !== null ? somme.toString() : 'Calcul en cours...'}</p>
            </div>

      <div className="card">
        <h3>Rechercher un élément par index</h3>
        <div className="form-group">
          <input
            type="number"
            className="form-control" 
            value={inputIndex}
            onChange={(e) => setInputIndex(e.target.value)}
            placeholder="Entrez un index"
          />
          <button 
            className="btn btn-primary" 
            onClick={rechercherElement}
            disabled={chargement}
            style={{ marginTop: '10px' }}
          >
            Rechercher
          </button>
        </div>
        {elementIndex !== '' && (
          <div className="result">
            <p>Élément à l'index {indexRecherche}: {elementIndex}</p>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <Link to="/" className="nav-item" style={{ display: 'inline-block', marginRight: '10px' }}>
        Retour à l'accueil
      </Link>
        <Link to="/initialize-exercice6" className="nav-item" style={{ display: 'inline-block' }}>
          Initialiser un nouveau contrat
        </Link>
      </div>
    </div>
  );
};

export default Exercice6;