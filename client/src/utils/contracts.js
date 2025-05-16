import web3 from './web3';

// Import contract ABIs
import Exercice1 from '../../../build/contracts/Exercice1.json';
import Exercice2 from '../../../build/contracts/Exercice2.json';
import Exercice3 from '../../../build/contracts/Exercice3.json';
import Exercice4 from '../../../build/contracts/Exercice4.json';
import Exercice5 from '../../../build/contracts/Exercice5.json';
import Exercice6 from '../../../build/contracts/Exercice6.json';
import Exercice7 from '../../../build/contracts/Exercice7.json';
import Exercice8 from '../../../build/contracts/Exercice8.json';

// Function to create a contract instance
const getContractInstance = async (contractJson) => {
  try {
    // Get the network ID
    const networkId = await web3.eth.net.getId();
    
    // Get deployed address for this network
    const deployedNetwork = contractJson.networks[networkId];
    
    if (!deployedNetwork) {
      throw new Error(`Contract not deployed on network ${networkId}`);
    }
    
    // Create and return contract instance
    return new web3.eth.Contract(
      contractJson.abi,
      deployedNetwork.address
    );
  } catch (error) {
    console.error("Error creating contract instance:", error);
    return null;
  }
};

// Export functions to get each contract instance
export const getExercice1 = () => getContractInstance(Exercice1);
export const getExercice2 = () => getContractInstance(Exercice2);
export const getExercice3 = () => getContractInstance(Exercice3);
export const getExercice4 = () => getContractInstance(Exercice4);
export const getExercice5 = () => getContractInstance(Exercice5);
export const getExercice6 = () => getContractInstance(Exercice6);
export const getExercice7 = () => getContractInstance(Exercice7);
export const getExercice8 = () => getContractInstance(Exercice8); 