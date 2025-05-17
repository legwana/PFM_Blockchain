import Web3 from 'web3';

let web3;

// Check if running in browser and if MetaMask is available
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and MetaMask is running
  console.log('Using MetaMask/browser provider');
  web3 = new Web3(window.ethereum);
  
  // Request account access if needed
  window.ethereum.request({ method: 'eth_requestAccounts' })
    .then(accounts => {
      console.log('Connected accounts:', accounts);
    })
    .catch((error) => {
      console.error("User denied account access", error);
    });
  
  // Get current chain ID
  window.ethereum.request({ method: 'eth_chainId' })
    .then(chainId => {
      const decimalChainId = parseInt(chainId, 16);
      console.log('Current chain ID:', decimalChainId);
      
      // If not on Ganache (chain ID 1337), attempt to switch
      if (decimalChainId !== 1337) {
        console.log('Not on Ganache network, attempting to switch...');
        
        // Request to switch to network 1337 (Ganache)
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x539' }], // 1337 in hex
        }).catch(async (switchError) => {
          console.error("Failed to switch network:", switchError);
          
          // If network doesn't exist, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: '0x539', // 1337 in hex
                    chainName: 'Ganache Local',
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18
                    },
                    rpcUrls: ['http://127.0.0.1:7545'],
                    blockExplorerUrls: []
                  }
                ]
              });
              console.log('Added Ganache network to MetaMask');
            } catch (addError) {
              console.error('Error adding Ganache network:', addError);
            }
          }
          
          // Fall back to local provider if we can't switch
          const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
          console.log('Falling back to local provider at http://127.0.0.1:7545');
          web3 = new Web3(provider);
        });
      } else {
        console.log('Already on Ganache network (1337)');
      }
    });
    
  // Reload page when the network changes
  window.ethereum.on('chainChanged', (chainId) => {
    console.log('Network changed to chain ID:', parseInt(chainId, 16));
    window.location.reload();
  });
  
  // Reload page when accounts change
  window.ethereum.on('accountsChanged', (accounts) => {
    console.log('Accounts changed:', accounts);
    window.location.reload();
  });
} else if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {
  // Legacy dapp browsers
  console.log('Using legacy web3 from browser');
  web3 = new Web3(window.web3.currentProvider);
} else {
  // Fallback to local provider (e.g., Ganache)
  const provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
  console.log('Using local provider at http://127.0.0.1:7545');
  web3 = new Web3(provider);
  
  // Test connection to provider
  web3.eth.net.isListening()
    .then(() => console.log('Successfully connected to Ganache'))
    .catch(err => console.error('Failed to connect to Ganache:', err));
}

// Log the web3 version
console.log('Web3 version:', web3.version);

// Try to get the current network ID
web3.eth.net.getId()
  .then(id => console.log('Connected to network ID:', id))
  .catch(err => console.error('Error getting network ID:', err));

export default web3; 