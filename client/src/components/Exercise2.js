import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice2 } from '../utils/contracts';
import BlockchainInfo from './BlockchainInfo';
import web3 from '../utils/web3';

const Exercice2 = () => {
  const [contract, setContract] = useState(null);
  const [montantEther, setMontantEther] = useState('');
  const [montantWei, setMontantWei] = useState('');
  const [resultatWei, setResultatWei] = useState('');
  const [resultatEther, setResultatEther] = useState('');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    const initialiserContrat = async () => {
      try {
        const instanceContrat = await getExercice2();
        setContract(instanceContrat);
      } catch (err) {
        setErreur("Échec du chargement du contrat");
      }
    };
    initialiserContrat();
  }, []);

  const convertirEnWei = async () => {
    if (!contract || !montantEther || isNaN(montantEther)) {
      setErreur("Veuillez entrer un montant valide");
      return;
    }
    
    try {
      setChargement(true);
      setErreur('');
      const weiAmount = await contract.methods.etherEnWei(montantEther.toString()).call();
      setResultatWei(weiAmount);
    } catch (err) {
      setErreur("Erreur de conversion Ether → Wei");
    }
    setChargement(false);
  };

  const convertirEnEther = async () => {
    if (!montantWei || isNaN(montantWei)) {
      setErreur("Veuillez entrer un montant valide");
      return;
    }
    
    try {
      setChargement(true);
      setErreur('');
      
      // Use web3.utils.fromWei instead of the contract function to get full precision
      const resultatPrecis = web3.utils.fromWei(montantWei.toString(), 'ether');
      setResultatEther(resultatPrecis);
    } catch (err) {
      setErreur("Format Wei invalide");
    }
    setChargement(false);
  };

  return (
    <div className="container">
      <h1>Exercice 2 : Conversion de Devises</h1>
      
      <BlockchainInfo />
      
      {erreur && <div className="card" style={{ color: 'red' }}>{erreur}</div>}
      
      {contract ? (
        <>
          <div className="card">
            <h3>Convertir Ether en Wei</h3>
            <div className="form-group">
              <label>Montant en Ether :</label>
              <input
                type="number"
                step="0.000000000000000001"
                value={montantEther}
                onChange={(e) => setMontantEther(e.target.value)}
                placeholder="Ex: 1.5"
              />
            </div>
            <button onClick={convertirEnWei} disabled={chargement}>
              {chargement ? 'Conversion...' : 'Convertir en Wei'}
            </button>
            {resultatWei && (
              <div className="resultat">
                <p>{montantEther} Ether = {resultatWei} Wei</p>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Convertir Wei en Ether</h3>
            <div className="form-group">
              <label>Montant en Wei :</label>
              <input
                type="number"
                value={montantWei}
                onChange={(e) => setMontantWei(e.target.value)}
                placeholder="Ex: 1500000000000000000"
              />
            </div>
            <button onClick={convertirEnEther} disabled={chargement}>
              {chargement ? 'Conversion...' : 'Convertir en Ether'}
            </button>
            {resultatEther && (
              <div className="resultat">
                <p>{montantWei} Wei = {resultatEther} Ether</p>
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

export default Exercice2;