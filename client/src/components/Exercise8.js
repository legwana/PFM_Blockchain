import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice8 } from '../utils/contracts';
import web3 from '../utils/web3';
import BlockchainInfo from './BlockchainInfo';
import PaymentArtifact from '../contracts/Payment.json';

const Exercice8 = () => {
    const [contract, setContract] = useState(null);
    const [inputMontant, setInputMontant] = useState('');
    const [solde, setSolde] = useState('0');
    const [recipient, setRecipient] = useState('');
    const [inputNewRecipient, setInputNewRecipient] = useState('');
    const [isRecipient, setIsRecipient] = useState(false);
    const [chargement, setChargement] = useState(false);
    const [erreur, setErreur] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [isNewDeployment, setIsNewDeployment] = useState(false);
    const [deployed, setDeployed] = useState(false);
    const [deployedAddress, setDeployedAddress] = useState('');
    const [isMockContract, setIsMockContract] = useState(false);
    const [inputDestination, setInputDestination] = useState('');

    useEffect(() => {
        const initialiserContrat = async () => {
            try {
                const customContractAddress = localStorage.getItem('exercice8Address');
                let instance;
                
                if (customContractAddress) {
                    console.log('Using custom deployed contract at:', customContractAddress);
                    instance = new web3.eth.Contract(
                        PaymentArtifact.abi,
                        customContractAddress
                    );
                    setDeployedAddress(customContractAddress);
                    setDeployed(true);
                } else {
                    instance = await getExercice8();
                }
                
                const isMock = !instance.options || 
                              !instance.options.address ||
                              instance.options.address === '0x0000000000000000000000000000000000000000' ||
                              instance._isMock;
                              
                setIsMockContract(isMock);
                setContract(instance);
                
                if (!isMock) {
                const recipientAddress = await instance.methods.recipient().call();
                setRecipient(recipientAddress);
                
                const comptes = await web3.eth.getAccounts();
                setIsRecipient(comptes[0].toLowerCase() === recipientAddress.toLowerCase());
                
                await mettreAJourSolde(instance);
                } else {
                    setIsNewDeployment(!customContractAddress);
                }
            } catch (err) {
                console.error("Erreur d'initialisation:", err);
                setErreur("Échec du chargement du contrat");
                setIsNewDeployment(true);
            }
        };
        initialiserContrat();
    }, []);

    const mettreAJourSolde = async (instance) => {
        try {
            const balance = await web3.eth.getBalance(instance.options.address);
            setSolde(web3.utils.fromWei(balance, 'ether'));
        } catch (err) {
            console.error("Erreur de récupération du solde:", err);
        }
    };

    const deployContract = async () => {
        if (!inputNewRecipient || !web3.utils.isAddress(inputNewRecipient)) {
            setErreur("Veuillez entrer une adresse de destinataire valide");
            return;
        }

        try {
            setChargement(true);
            setErreur('');
            
            const comptes = await web3.eth.getAccounts();
            if (!comptes || comptes.length === 0) {
                throw new Error("Aucun compte disponible. Veuillez vous connecter à MetaMask.");
            }
            const account = comptes[0];
            
            const contract = new web3.eth.Contract(PaymentArtifact.abi);
            const gasEstimate = await contract.deploy({
                data: PaymentArtifact.bytecode,
                arguments: [inputNewRecipient]
            }).estimateGas({ from: account });
            
            const deployedContract = await contract.deploy({
                data: PaymentArtifact.bytecode,
                arguments: [inputNewRecipient]
            }).send({
                from: account,
                gas: Math.floor(gasEstimate * 1.2)
            });
            
            console.log('Contract deployed at:', deployedContract.options.address);
            setDeployedAddress(deployedContract.options.address);
            setDeployed(true);
            setContract(deployedContract);
            setInputNewRecipient('');
            
            localStorage.setItem('exercice8Address', deployedContract.options.address);
            
            await mettreAJourSolde(deployedContract);
            
        } catch (err) {
            console.error("Erreur lors du déploiement du contrat:", err);
            setErreur("Erreur lors du déploiement: " + err.message);
        } finally {
            setChargement(false);
        }
    };

    const envoyerPaiement = async () => {
        if (!contract || !inputMontant || isNaN(inputMontant) || parseFloat(inputMontant) <= 0) {
            setErreur("Veuillez entrer un montant valide");
            return;
        }

        try {
            setChargement(true);
            setErreur('');
            
            const comptes = await web3.eth.getAccounts();
            const montantWei = web3.utils.toWei(inputMontant, 'ether');
            
            const transaction = await contract.methods.receivePayment().send({
                from: comptes[0],
                value: montantWei,
                gas: 300000
            });
            
            setTransactionHash(transaction.transactionHash);
            setInputMontant('');
            await mettreAJourSolde(contract);
        } catch (err) {
            setErreur("Erreur lors de l'envoi du paiement: " + err.message);
        }
        setChargement(false);
    };

    const retirerFonds = async () => {
        if (!contract) return;

        try {
            setChargement(true);
            setErreur('');
            
            const comptes = await web3.eth.getAccounts();
            const transaction = await contract.methods.withdraw().send({
                from: comptes[0],
                gas: 300000
            });
            
            setTransactionHash(transaction.transactionHash);
            await mettreAJourSolde(contract);
        } catch (err) {
            setErreur("Erreur lors du retrait: " + err.message);
        }
        setChargement(false);
    };

    const envoyerADestination = async () => {
        if (!contract || !inputDestination) {
            setErreur("Veuillez entrer une adresse de destination valide");
            return;
        }

        if (!web3.utils.isAddress(inputDestination)) {
            setErreur("L'adresse de destination n'est pas valide");
            return;
        }

        try {
            setChargement(true);
            setErreur('');
            
            const comptes = await web3.eth.getAccounts();
            const transaction = await contract.methods.sendTo(inputDestination).send({
                from: comptes[0],
                gas: 300000
            });
            
            setTransactionHash(transaction.transactionHash);
            setInputDestination('');
            await mettreAJourSolde(contract);
        } catch (err) {
            setErreur("Erreur lors de l'envoi des fonds: " + err.message);
        } finally {
            setChargement(false);
        }
    };

    const resetContract = () => {
        localStorage.removeItem('exercice8Address');
        window.location.reload();
    };

    return (
        <div className="container">
            <h1>Exercice 8 : Gestion des Paiements</h1>
            
            <BlockchainInfo />
            
            {isMockContract && (
                <div className="alert alert-warning">
                    Mode simulation: Vous utilisez une version simulée du contrat. Pour utiliser le vrai contrat, assurez-vous que MetaMask est connecté au réseau Ganache (1337).
                </div>
            )}
            
            {erreur && <div className="card" style={{ color: 'red', marginBottom: '10px' }}>{erreur}</div>}
            
            {isNewDeployment && !deployed ? (
                <div className="card">
                    <h3>Déployer un nouveau contrat de paiement</h3>
                    <p>Vous devez d'abord déployer un contrat en spécifiant l'adresse qui pourra retirer les fonds.</p>
                    
                    <div className="form-group" style={{ marginBottom: '10px' }}>
                        <label>Adresse du destinataire (qui pourra retirer les fonds):</label>
                        <input
                            type="text"
                            className="form-control"
                            value={inputNewRecipient}
                            onChange={(e) => setInputNewRecipient(e.target.value)}
                            placeholder="0x..."
                            style={{ marginTop: '5px' }}
                        />
                    </div>
                    
                    <button 
                        onClick={deployContract} 
                        disabled={chargement}
                        className="btn btn-primary"
                    >
                        {chargement ? 'Déploiement...' : 'Déployer le contrat'}
                    </button>
                </div>
            ) : (
                contract && (
                <>
                        {deployed && (
                            <div className="alert alert-info">
                                Vous utilisez un contrat personnalisé.
                                <button 
                                    className="btn btn-sm btn-outline-secondary ml-2" 
                                    onClick={resetContract}
                                    style={{ marginLeft: '10px' }}
                                >
                                    Revenir au contrat par défaut
                                </button>
                            </div>
                        )}
                        
                    <div className="card">
                        <h3>Informations du Contrat</h3>
                        <div className="info-group">
                                <p><strong>Adresse du contrat:</strong> {deployedAddress || contract.options?.address}</p>
                            <p><strong>Adresse du destinataire:</strong> {recipient}</p>
                            <p><strong>Solde actuel:</strong> {solde} ETH</p>
                            <p><strong>Statut:</strong> {isRecipient ? 'Vous êtes le destinataire' : 'Vous n\'êtes pas le destinataire'}</p>
                        </div>
                    </div>

                    <div className="card">
                        <h3>Envoyer un Paiement</h3>
                        <div className="form-group">
                            <label>Montant en ETH:</label>
                            <input
                                type="number"
                                className="form-control"
                                step="0.000000000000000001"
                                value={inputMontant}
                                onChange={(e) => setInputMontant(e.target.value)}
                                placeholder="Ex: 0.1"
                                style={{ marginTop: '5px' }}
                            />
                        </div>
                        <button 
                            onClick={envoyerPaiement} 
                            disabled={chargement}
                            className="btn btn-primary"
                            style={{ marginTop: '10px' }}
                        >
                            {chargement ? 'Envoi en cours...' : 'Envoyer le paiement'}
                        </button>
                    </div>

                    {isRecipient && (
                        <>
                        <div className="card">
                            <h3>Retirer les Fonds</h3>
                            <button 
                                onClick={retirerFonds} 
                                disabled={chargement || parseFloat(solde) <= 0}
                                className="btn btn-success"
                            >
                                {chargement ? 'Retrait en cours...' : 'Retirer les fonds'}
                            </button>
                        </div>

                        <div className="card">
                            <h3>Envoyer les Fonds à une Adresse Spécifique</h3>
                            <div className="form-group">
                                <label>Adresse de destination:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={inputDestination}
                                    onChange={(e) => setInputDestination(e.target.value)}
                                    placeholder="0x..."
                                    style={{ marginTop: '5px' }}
                                />
                            </div>
                            <button 
                                onClick={envoyerADestination} 
                                disabled={chargement || parseFloat(solde) <= 0}
                                className="btn btn-primary"
                                style={{ marginTop: '10px' }}
                            >
                                {chargement ? 'Envoi en cours...' : 'Envoyer les fonds'}
                            </button>
                        </div>
                        </>
                    )}

                    {transactionHash && (
                        <div className="transaction-info">
                            <small>Transaction: {transactionHash}</small>
                        </div>
                    )}
                </>
                )
            )}
            
            <div style={{ marginTop: '20px' }}>
                <Link to="/" className="nav-item">
                Retour à l'accueil
            </Link>
            </div>
        </div>
    );
};

export default Exercice8;