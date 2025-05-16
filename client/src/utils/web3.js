import Web3 from 'web3';

let web3;

// Check if MetaMask is installed
if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  try {
    // Request account access if needed
    window.ethereum.request({ method: 'eth_requestAccounts' });
  } catch (error) {
    console.error("User denied account access");
  }
} else if (window.web3) {
  // Legacy dapp browsers
  web3 = new Web3(window.web3.currentProvider);
} else {
  // Fallback to local provider (e.g., Ganache)
  const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
  web3 = new Web3(provider);
}

export default web3; 