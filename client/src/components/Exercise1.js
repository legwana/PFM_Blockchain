import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice1 } from '../utils/contracts';
import web3 from '../utils/web3';
import BlockchainInfo from './BlockchainInfo';

const Exercise1 = () => {
  const [contract, setContract] = useState(null);
  const [stateValues, setStateValues] = useState({ a: '0', b: '0' });
  const [inputValues, setInputValues] = useState({ x: '', y: '' });
  const [result1, setResult1] = useState('');
  const [result2, setResult2] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const initContract = async () => {
      try {
        const contractInstance = await getExercice1();
        setContract(contractInstance);
        
        // Get initial state values
        if (contractInstance) {
          const a = await contractInstance.methods.a().call();
          const b = await contractInstance.methods.b().call();
          setStateValues({ a, b });
        }
      } catch (err) {
        console.error("Error initializing contract:", err);
        setError("Failed to load contract. Please check if Ganache is running and contracts are deployed.");
      }
    };

    initContract();
  }, []);

  const handleAddition1 = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      const result = await contract.methods.addition1().call();
      setResult1(result);
      setLoading(false);
    } catch (err) {
      console.error("Error calling addition1:", err);
      setError("Error calling addition1 function");
      setLoading(false);
    }
  };

  const handleAddition2 = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Convert string inputs to numbers
      const x = parseInt(inputValues.x);
      const y = parseInt(inputValues.y);
      
      // Check if inputs are valid numbers
      if (isNaN(x) || isNaN(y)) {
        setError("Please enter valid numbers");
        setLoading(false);
        return;
      }
      
      const result = await contract.methods.addition2(x, y).call();
      setResult2(result);
      setLoading(false);
    } catch (err) {
      console.error("Error calling addition2:", err);
      setError("Error calling addition2 function");
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputValues(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h1>Exercise 1: Addition Functions</h1>
      
      <BlockchainInfo />
      
      {error && <div className="card" style={{ color: 'red' }}>{error}</div>}
      
      {contract ? (
        <>
          <div className="card">
            <h2>State Variables</h2>
            <p>a = {stateValues.a}</p>
            <p>b = {stateValues.b}</p>
            
            <h3>Function 1: Add State Variables (a + b)</h3>
            <button onClick={handleAddition1} disabled={loading}>
              {loading ? 'Loading...' : 'Calculate a + b'}
            </button>
            {result1 && (
              <div className="result">
                <p>Result: {result1}</p>
              </div>
            )}
          </div>
          
          <div className="card">
            <h3>Function 2: Add Two Parameters</h3>
            <div className="form-group">
              <label>First Number (x):</label>
              <input
                type="number"
                name="x"
                value={inputValues.x}
                onChange={handleInputChange}
                placeholder="Enter first number"
              />
            </div>
            <div className="form-group">
              <label>Second Number (y):</label>
              <input
                type="number"
                name="y"
                value={inputValues.y}
                onChange={handleInputChange}
                placeholder="Enter second number"
              />
            </div>
            <button onClick={handleAddition2} disabled={loading}>
              {loading ? 'Loading...' : 'Calculate x + y'}
            </button>
            {result2 && (
              <div className="result">
                <p>Result: {result2}</p>
              </div>
            )}
          </div>
          
          {transactionHash && (
            <div className="card">
              <h3>Transaction Information</h3>
              <p>Transaction Hash: {transactionHash}</p>
            </div>
          )}
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

export default Exercise1; 