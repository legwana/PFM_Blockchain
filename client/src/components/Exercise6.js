import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice6 } from '../utils/contracts';
import web3 from '../utils/web3';
import BlockchainInfo from './BlockchainInfo';

const Exercise6 = () => {
  const [contract, setContract] = useState(null);
  const [newNumber, setNewNumber] = useState('');
  const [numbers, setNumbers] = useState([]);
  const [sum, setSum] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  
  useEffect(() => {
    const initContract = async () => {
      try {
        const contractInstance = await getExercice6();
        setContract(contractInstance);
        
        if (contractInstance) {
          await loadNumbers(contractInstance);
        }
      } catch (err) {
        console.error("Error initializing contract:", err);
        setError("Failed to load contract. Please check if Ganache is running and contracts are deployed.");
      }
    };

    initContract();
  }, []);
  
  const loadNumbers = async (contractInstance) => {
    try {
      // Use the getAllNumbers function to get the array
      const numbersList = await contractInstance.methods.getAllNumbers().call();
      setNumbers(numbersList);
    } catch (err) {
      console.error("Error loading numbers:", err);
      setError("Error loading numbers from the contract");
    }
  };

  const handleAddNumber = async () => {
    if (!contract || newNumber === '' || isNaN(parseInt(newNumber))) {
      setError("Please enter a valid number");
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const accounts = await web3.eth.getAccounts();
      const transaction = await contract.methods.addNumber(parseInt(newNumber)).send({
        from: accounts[0]
      });
      
      setTransactionHash(transaction.transactionHash);
      
      // Update the numbers list after adding
      await loadNumbers(contract);
      
      setNewNumber('');
      setLoading(false);
    } catch (err) {
      console.error("Error adding number:", err);
      setError("Error adding number to array");
      setLoading(false);
    }
  };

  const handleCalculateSum = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      const result = await contract.methods.calculateSum().call();
      setSum(result);
      setLoading(false);
    } catch (err) {
      console.error("Error calculating sum:", err);
      setError("Error calculating the sum of array elements");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Exercise 6: Array Manipulation</h1>
      
      <BlockchainInfo />
      
      {error && <div className="card" style={{ color: 'red' }}>{error}</div>}
      
      {contract ? (
        <>
          <div className="card">
            <h3>Current Array</h3>
            <div className="result">
              <p>[{numbers.join(', ')}]</p>
            </div>
            
            <h3>Add Number to Array</h3>
            <div className="form-group">
              <label>New Number:</label>
              <input
                type="number"
                value={newNumber}
                onChange={(e) => setNewNumber(e.target.value)}
                placeholder="Enter a number to add"
              />
            </div>
            <button onClick={handleAddNumber} disabled={loading}>
              {loading ? 'Adding...' : 'Add Number'}
            </button>
            
            {transactionHash && (
              <div className="result">
                <p>Transaction Hash: {transactionHash}</p>
              </div>
            )}
          </div>
          
          <div className="card">
            <h3>Calculate Sum of Array</h3>
            <button onClick={handleCalculateSum} disabled={loading}>
              {loading ? 'Calculating...' : 'Calculate Sum'}
            </button>
            
            {sum !== null && (
              <div className="result">
                <p>Sum of all elements: {sum}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="card">
          <p>Loading contract...</p>
        </div>
      )}
      
      <Link to="/" className="nav-item" style={{ display: 'inline-block', marginTop: '20px' }}>
        Back to Home
      </Link>
    </div>
  );
};

export default Exercise6; 