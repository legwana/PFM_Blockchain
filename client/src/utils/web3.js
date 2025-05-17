import Web3 from 'web3';

let web3;

// Check if running in browser and if MetaMask is available
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and MetaMask is running
  web3 = new Web3(window.ethereum);
  
  // Request account access if needed
  window.ethereum.request({ method: 'eth_requestAccounts' })
    .catch((error) => {
      console.error("User denied account access", error);
    });
    
  // Reload page when the network changes
  window.ethereum.on('chainChanged', () => {
    window.location.reload();
  });
  
  // Reload page when accounts change
  window.ethereum.on('accountsChanged', () => {
    window.location.reload();
  });
} else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // Legacy dapp browsers
  web3 = new Web3(window.web3.currentProvider);
  console.log('Legacy web3 detected');
} else {
  // Fallback to local provider (e.g., Ganache)
  const provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
  web3 = new Web3(provider);
  console.log('Using local web3 provider');
}

export default web3; 