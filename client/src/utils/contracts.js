import web3 from './web3';

// Import contract JSON files
import Exercice1Artifact from '../contracts/Exercice1.json';
import Exercice2Artifact from '../contracts/Exercice2.json';
import Exercice3Artifact from '../contracts/Exercice3.json';
import Exercice4Artifact from '../contracts/Exercice4.json';
import Exercice5Artifact from '../contracts/Exercice5.json';
import Exercice6Artifact from '../contracts/Exercice6.json';
import RectangleArtifact from '../contracts/Rectangle.json';
import PaymentArtifact from '../contracts/Payment.json';

// Function to create a contract instance
const getContractInstance = async (contractArtifact) => {
  try {
    // Get the network ID
    const networkId = await web3.eth.net.getId();
    console.log(`Current network ID: ${networkId}`);
    
    // Check if there's a custom address for exercise 7 or 8
    const contractName = contractArtifact.contractName;
    let customAddress = null;
    if (contractName === 'Rectangle') {
      customAddress = localStorage.getItem('exercice7Address');
    } else if (contractName === 'Payment') {
      customAddress = localStorage.getItem('exercice8Address');
    }
    
    // Use custom address if available
    if (customAddress) {
      console.log(`Using custom address for ${contractName}: ${customAddress}`);
      const instance = new web3.eth.Contract(
        contractArtifact.abi,
        customAddress
      );
      return instance;
    }
    
    // Get the deployed contract address for this network
    const deployedNetwork = contractArtifact.networks[networkId];
    
    // Log more info for debugging
    if (contractArtifact.contractName === 'Exercice6' || 
        contractArtifact.contractName === 'Rectangle' || 
        contractArtifact.contractName === 'Payment') {
      console.log(`${contractArtifact.contractName} contract initialization:`);
      console.log('- Network ID:', networkId);
      console.log('- Contract artifact:', contractArtifact.contractName);
      console.log('- Networks available:', Object.keys(contractArtifact.networks));
      console.log('- Deployed network exists:', !!deployedNetwork);
      if (deployedNetwork) {
        console.log('- Contract address:', deployedNetwork.address);
      }
    }
    
    if (!deployedNetwork || !deployedNetwork.address) {
      console.error(`Contract ${contractArtifact.contractName} not deployed on network ${networkId}`);
      console.error('Available networks:', Object.keys(contractArtifact.networks));
      return createMockContract(contractArtifact.contractName);
    }
    
    console.log(`Contract ${contractArtifact.contractName} found at ${deployedNetwork.address}`);
    
    // Create a new contract instance
    const instance = new web3.eth.Contract(
      contractArtifact.abi,
      deployedNetwork.address
    );
    
    return instance;
  } catch (error) {
    console.error(`Error creating contract instance for ${contractArtifact.contractName}:`, error);
    return createMockContract(contractArtifact.contractName);
  }
};

// Create mock contract for fallback
const createMockContract = (contractName) => {
  console.log(`Creating mock contract for ${contractName}`);
  const mockMethods = createMockMethods(contractName);
  
  return {
    options: {
      address: '0x0000000000000000000000000000000000000000'
    },
    methods: mockMethods,
    _isMock: true
  };
};

// Create mock methods based on the contract type
const createMockMethods = (contractName) => {
  const mockMethods = {
    // Exercise 1
    'Exercice1': {
      a: () => ({ call: async () => '5' }),
      b: () => ({ call: async () => '10' }),
      addition1: () => ({ call: async () => '15' }),
      addition2: (x, y) => ({ call: async () => (parseInt(x) + parseInt(y)).toString() })
    },
    // Exercise 2
    'Exercice2': {
      etherEnWei: (amount) => ({ call: async () => web3.utils.toWei(amount, 'ether') }),
      weiEnEther: (amount) => ({ call: async () => web3.utils.fromWei(amount, 'ether') })
    },
    // Exercise 3
    'Exercice3': {
      message: () => ({ call: async () => 'Default message' }),
      setMessage: (msg) => ({ 
        call: async () => {},
        send: async () => ({ transactionHash: '0x123456789...' }) 
      }),
      concatener: (a, b) => ({ call: async () => a + b }),
      longueur: (str) => ({ call: async () => str.length.toString() }),
      comparer: (a, b) => ({ call: async () => a === b })
    },
    // Exercise 4
    'Exercice4': {
      estPositif: (num) => ({ call: async () => parseInt(num) > 0 })
    },
    // Exercise 5
    'Exercice5': {
      estPair: (num) => ({ call: async () => parseInt(num) % 2 === 0 })
    },
    // Exercise 6
    'Exercice6': {
      afficheTableau: () => ({ call: async () => ['10', '20', '30'] }),
      ajouterNombre: (num) => ({ 
        call: async () => {},
        send: async () => ({ transactionHash: '0x123456789...' }) 
      }),
      calculerSomme: () => ({ call: async () => '60' }),
      getElement: (index) => ({ call: async () => index < 3 ? ['10', '20', '30'][index] : '0' })
    },
    // Exercise 7
    'Rectangle': {
      x: () => ({ call: async () => '0' }),
      y: () => ({ call: async () => '0' }),
      longueur: () => ({ call: async () => '10' }),
      largeur: () => ({ call: async () => '5' }),
      length: () => ({ call: async () => '10' }),  // En anglais aussi
      width: () => ({ call: async () => '5' }),    // En anglais aussi
      surface: () => ({ call: async () => '50' }),
      area: () => ({ call: async () => '50' }),    // En anglais aussi
      afficheInfos: () => ({ call: async () => 'Je suis un Rectangle' }),
      afficheXY: () => ({ call: async () => ['0', '0'] }),
      afficheDimensions: () => ({ call: async () => ['10', '5'] }),
      deplacerForme: (dx, dy) => ({ 
        call: async () => {},
        send: async () => ({ transactionHash: '0x123456789...' }) 
      })
    },
    // Exercise 8
    'Payment': {
      recipient: () => ({ call: async () => '0x0000000000000000000000000000000000000000' }),
      receivePayment: () => ({ 
        call: async () => {},
        send: async (options) => ({ transactionHash: '0x123456789...' }) 
      }),
      withdraw: () => ({ 
        call: async () => {},
        send: async () => ({ transactionHash: '0x987654321...' }) 
      })
    }
  };

  return mockMethods[contractName] || {};
};

// Export functions to get each contract instance
export const getExercice1 = () => getContractInstance(Exercice1Artifact);
export const getExercice2 = () => getContractInstance(Exercice2Artifact);
export const getExercice3 = () => getContractInstance(Exercice3Artifact);
export const getExercice4 = () => getContractInstance(Exercice4Artifact);
export const getExercice5 = () => getContractInstance(Exercice5Artifact);
export const getExercice6 = () => getContractInstance(Exercice6Artifact);
export const getExercice7 = () => getContractInstance(RectangleArtifact);
export const getExercice8 = () => getContractInstance(PaymentArtifact); 