import React, { useState, useEffect } from 'react';
import web3 from '../utils/web3';

const BlockchainInfo = () => {
  const [blockNumber, setBlockNumber] = useState(0);
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [networkId, setNetworkId] = useState('');

  useEffect(() => {
    const loadBlockchainData = async () => {
      try {
        // Get latest block number
        const latestBlock = await web3.eth.getBlockNumber();
        setBlockNumber(latestBlock);

        // Get connected accounts
        const accounts = await web3.eth.getAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          
          // Get account balance
          const weiBalance = await web3.eth.getBalance(accounts[0]);
          setBalance(web3.utils.fromWei(weiBalance, 'ether'));
        }

        // Get network ID
        const network = await web3.eth.net.getId();
        setNetworkId(network);

        // Set up event listener for account changes
        if (window.ethereum) {
          window.ethereum.on('accountsChanged', (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
            } else {
              setAccount('');
              setBalance('0');
            }
          });
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données blockchain:", error);
      }
    };

    loadBlockchainData();
    
    // Refresh data every 10 seconds
    const interval = setInterval(() => {
      loadBlockchainData();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h3>Informations Blockchain</h3>
      <p><strong>Bloc Actuel:</strong> {blockNumber}</p>
      <p><strong>Compte Connecté:</strong> {account || 'Non connecté'}</p>
      <p><strong>Solde:</strong> {balance} ETH</p>
      <p><strong>ID Réseau:</strong> {networkId}</p>
    </div>
  );
};

export default BlockchainInfo; 