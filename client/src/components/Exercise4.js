import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice4 } from '../utils/contracts';
import BlockchainInfo from './BlockchainInfo';

const Exercise4 = () => {
  const [contract, setContract] = useState(null);
  const [number, setNumber] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const initContract = async () => {
      try {
        const contractInstance = await getExercice4();
        setContract(contractInstance);
      } catch (err) {
        console.error("Error initializing contract:", err);
        setError("Failed to load contract. Please check if Ganache is running and contracts are deployed.");
      }
    };

    initContract();
  }, []);

  const handleCheckPositive = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      if (number === '' || isNaN(parseInt(number))) {
        setError("Please enter a valid number");
        setLoading(false);
        return;
      }
      
      const result = await contract.methods.isPositive(number).call();
      setResult(result);
      setLoading(false);
    } catch (err) {
      console.error("Error checking if number is positive:", err);
      setError("Error checking if number is positive");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Exercise 4: Positive Number Check</h1>
      
      <BlockchainInfo />
      
      {error && <div className="card" style={{ color: 'red' }}>{error}</div>}
      
      {contract ? (
        <div className="card">
          <h3>Check if a Number is Positive</h3>
          <div className="form-group">
            <label>Enter a Number:</label>
            <input
              type="number"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="Enter an integer"
            />
          </div>
          <button onClick={handleCheckPositive} disabled={loading}>
            {loading ? 'Checking...' : 'Check if Positive'}
          </button>
          
          {result !== null && (
            <div className="result">
              <p>
                The number {number} is {result ? 'positive' : 'not positive (zero or negative)'}.
              </p>
            </div>
          )}
        </div>
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

export default Exercise4; 