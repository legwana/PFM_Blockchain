import web3 from './web3';

// Import contract JSON files
import Exercice1Artifact from '../contracts/Exercice1.json';
import Exercice2Artifact from '../contracts/Exercice2.json';
import Exercice3Artifact from '../contracts/Exercice3.json';
import Exercice4Artifact from '../contracts/Exercice4.json';
import Exercice5Artifact from '../contracts/Exercice5.json';
import Exercice6Artifact from '../contracts/Exercice6.json';
import RectangleArtifact from '../contracts/Rectangle.json';
import Exercice8Artifact from '../contracts/Exercice8.json';

// Function to create a contract instance
const getContractInstance = async (contractArtifact) => {
  try {
    // Get the network ID
    const networkId = await web3.eth.net.getId();
    
    // Get the deployed contract address for this network
    const deployedNetwork = contractArtifact.networks[networkId];
    
    if (!deployedNetwork || !deployedNetwork.address) {
      console.error(`Contract not deployed on network ${networkId}`);
      return createMockContract(contractArtifact.contractName);
    }
    
    // Create a new contract instance
    const instance = new web3.eth.Contract(
      contractArtifact.abi,
      deployedNetwork.address
    );
    
    return instance;
  } catch (error) {
    console.error(`Error creating contract instance:`, error);
    return createMockContract(contractArtifact.contractName);
  }
};

// Create a mock contract as fallback
const createMockContract = (contractName) => {
  console.warn(`Using mock implementation for ${contractName}`);
  return {
    methods: createMockMethods(contractName),
    options: {
      address: '0x0000000000000000000000000000000000000000'
    }
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
      etherToWei: (amount) => ({ call: async () => web3.utils.toWei(amount, 'ether') }),
      weiToEther: (amount) => ({ call: async () => web3.utils.fromWei(amount, 'ether') })
    },
    // Exercise 3
    'Exercice3': {
      message: () => ({ call: async () => 'Default message' }),
      setMessage: (msg) => ({ 
        call: async () => {},
        send: async () => ({ transactionHash: '0x123456789...' }) 
      }),
      concatenate: (a, b) => ({ call: async () => a + b }),
      getLength: (str) => ({ call: async () => str.length.toString() }),
      compare: (a, b) => ({ call: async () => a === b })
    },
    // Exercise 4
    'Exercice4': {
      isPositive: (num) => ({ call: async () => parseInt(num) > 0 })
    },
    // Exercise 5
    'Exercice5': {
      isEven: (num) => ({ call: async () => parseInt(num) % 2 === 0 })
    },
    // Exercise 6
    'Exercice6': {
      getAllNumbers: () => ({ call: async () => ['1', '2', '3'] }),
      addNumber: (num) => ({ 
        call: async () => {},
        send: async () => ({ transactionHash: '0x123456789...' }) 
      }),
      calculateSum: () => ({ call: async () => '6' })
    },
    // Exercise 7
    'Rectangle': {
      x: () => ({ call: async () => '0' }),
      y: () => ({ call: async () => '0' }),
      length: () => ({ call: async () => '10' }),
      width: () => ({ call: async () => '5' }),
      area: () => ({ call: async () => '50' })
    },
    // Exercise 8
    'Exercice8': {
      recipient: () => ({ call: async () => '0x0000000000000000000000000000000000000000' }),
      getBalance: () => ({ call: async () => '0' }),
      withdraw: () => ({ 
        call: async () => {},
        send: async () => ({ transactionHash: '0x123456789...' }) 
      }),
      withdrawAmount: (amount) => ({ 
        call: async () => {},
        send: async () => ({ transactionHash: '0x123456789...' }) 
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
export const getExercice8 = () => getContractInstance(Exercice8Artifact); 