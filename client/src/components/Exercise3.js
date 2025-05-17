import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice3 } from '../utils/contracts';
import web3 from '../utils/web3';
import BlockchainInfo from './BlockchainInfo';

const Exercice3 = () => {
  const [contract, setContract] = useState(null);
  const [messageActuel, setMessageActuel] = useState('');
  const [nouveauMessage, setNouveauMessage] = useState('');
  const [chaine1, setChaine1] = useState('');
  const [chaine2, setChaine2] = useState('');
  const [resultatConcat, setResultatConcat] = useState('');
  const [resultatComparaison, setResultatComparaison] = useState('');
  const [longueurChaine, setLongueurChaine] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [operationEnCours, setOperationEnCours] = useState('');

  useEffect(() => {
    const initialiserContrat = async () => {
      try {
        const instanceContrat = await getExercice3();
        setContract(instanceContrat);
        const message = await instanceContrat.methods.getMessage().call();
        setMessageActuel(message);
      } catch (err) {
        console.error("Erreur d'initialisation:", err);
        setErreur("Échec du chargement du contrat");
      }
    };
    initialiserContrat();
  }, []);

  const definirMessage = async () => {
    if (!contract || !nouveauMessage.trim()) {
      setErreur("Veuillez entrer un message valide");
      return;
    }
    
    try {
      setChargement(true);
      setErreur('');
      const comptes = await web3.eth.getAccounts();
      const transaction = await contract.methods.setMessage(nouveauMessage).send({
        from: comptes[0]
      });
      setTransactionHash(transaction.transactionHash);
      setMessageActuel(nouveauMessage);
      setNouveauMessage('');
    } catch (err) {
      setErreur("Erreur lors de la mise à jour du message");
    } finally {
      setChargement(false);
    }
  };

  const gererConcatener = async () => {
    if (!chaine1.trim() || !chaine2.trim()) {
      setErreur("Les deux chaînes sont requises");
      return;
    }
    
    try {
      setOperationEnCours('concat');
      setErreur('');
      const resultat = await contract.methods.concatener(chaine1, chaine2).call();
      setResultatConcat(resultat);
    } catch (err) {
      console.error("Erreur de concaténation:", err);
      setErreur("Erreur de concaténation: " + err.message);
    } finally {
      setOperationEnCours('');
    }
  };

  const gererComparaison = async () => {
    if (!chaine1.trim() || !chaine2.trim()) {
      setErreur("Les deux chaînes sont requises");
      return;
    }

    try {
      setOperationEnCours('compare');
      setErreur('');
      const identiques = await contract.methods.comparer(chaine1, chaine2).call();
      setResultatComparaison(identiques ? "Chaînes identiques" : "Chaînes différentes");
    } catch (err) {
      console.error("Erreur de comparaison:", err);
      setErreur("Erreur de comparaison: " + err.message);
    } finally {
      setOperationEnCours('');
    }
  };

  const calculerLongueur = async () => {
    if (!chaine1.trim()) {
      setErreur("Une chaîne est requise");
      return;
    }

    try {
      setOperationEnCours('length');
      setErreur('');
      const longueur = await contract.methods.longueur(chaine1).call();
      setLongueurChaine(longueur.toString());
    } catch (err) {
      console.error("Erreur de calcul de longueur:", err);
      setErreur("Erreur de calcul de longueur: " + err.message);
    } finally {
      setOperationEnCours('');
    }
  };

  return (
    <div className="container">
      <h1>Exercice 3 : Gestion des Chaînes de Caractères</h1>
      
      <BlockchainInfo />
      
      {erreur && <div className="card" style={{ color: 'red' }}>{erreur}</div>}
      
      {contract ? (
        <>
          <div className="card">
            <h3>Message Actuel</h3>
            <div>
              {messageActuel || "<Aucun message>"}
            </div>
            
            <h3>Définir Nouveau Message</h3>
            <div className="form-group">
              <input
                type="text"
                className="form-control"
                value={nouveauMessage}
                onChange={(e) => setNouveauMessage(e.target.value)}
                placeholder="Entrez un nouveau message"
              />
            </div>
            <button 
              className="btn btn-primary"
              onClick={definirMessage} 
              disabled={chargement}
            >
              {chargement ? 'En cours...' : 'Définir le message'}
            </button>
            
            {transactionHash && (
              <div className="transaction-info">
                <small>Transaction: {transactionHash}</small>
              </div>
            )}
          </div>

          <div className="card">
            <h3>Opérations sur Chaînes</h3>
            <div className="form-group">
              <label>Première chaîne</label>
              <input
                type="text"
                className="form-control"
                value={chaine1}
                onChange={(e) => setChaine1(e.target.value)}
                placeholder="Entrez la première chaîne"
              />
            </div>
            <div className="form-group">
              <label>Deuxième chaîne</label>
              <input
                type="text"
                className="form-control"
                value={chaine2}
                onChange={(e) => setChaine2(e.target.value)}
                placeholder="Entrez la deuxième chaîne"
              />
            </div>
            
            <button 
              className="btn btn-primary"
              onClick={gererConcatener}
              disabled={operationEnCours === 'concat'}
              style={{ marginRight: '5px' }}
            >
              {operationEnCours === 'concat' ? 'Concaténation...' : 'Concaténer'}
            </button>
            <button 
              className="btn btn-primary"
              onClick={gererComparaison}
              disabled={operationEnCours === 'compare'}
              style={{ marginRight: '5px' }}
            >
              {operationEnCours === 'compare' ? 'Comparaison...' : 'Comparer'}
            </button>
            <button 
              className="btn btn-primary"
              onClick={calculerLongueur}
              disabled={operationEnCours === 'length'}
            >
              {operationEnCours === 'length' ? 'Calcul...' : 'Calculer la longueur'}
            </button>

            {resultatConcat && (
              <div className="resultat">
                <p>Résultat de la concaténation: {resultatConcat}</p>
              </div>
            )}
            {resultatComparaison && (
              <div className="resultat">
                <p>Résultat de la comparaison: {resultatComparaison}</p>
              </div>
            )}
            {longueurChaine && (
              <div className="resultat">
                <p>Longueur de la chaîne: {longueurChaine} caractères</p>
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

export default Exercice3;