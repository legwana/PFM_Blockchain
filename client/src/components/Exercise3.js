import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice3 } from '../utils/contracts';
import web3 from '../utils/web3';
import BlockchainInfo from './BlockchainInfo';

const Exercise3 = () => {
  const [contract, setContract] = useState(null);
  const [currentMessage, setCurrentMessage] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [string1, setString1] = useState('');
  const [string2, setString2] = useState('');
  const [comparisonResult, setComparisonResult] = useState('');
  const [lengthResult, setLengthResult] = useState('');
  const [concatResult, setConcatResult] = useState('');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const initContract = async () => {
      try {
        const contractInstance = await getExercice3();
        setContract(contractInstance);
        
        if (contractInstance) {
          const message = await contractInstance.methods.message().call();
          setCurrentMessage(message);
        }
      } catch (err) {
        console.error("Error initializing contract:", err);
        setError("Failed to load contract. Please check if Ganache is running and contracts are deployed.");
      }
    };

    initContract();
  }, []);

  const handleSetMessage = async () => {
    if (!contract || !newMessage) return;
    
    try {
      setLoading(true);
      setError('');
      
      const accounts = await web3.eth.getAccounts();
      const transaction = await contract.methods.setMessage(newMessage).send({
        from: accounts[0]
      });
      
      setTransactionHash(transaction.transactionHash);
      setCurrentMessage(newMessage);
      setNewMessage('');
      setLoading(false);
    } catch (err) {
      console.error("Error setting message:", err);
      setError("Error setting message");
      setLoading(false);
    }
  };

  const handleConcatenate = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      if (!string1 || !string2) {
        setError("Both strings are required for concatenation");
        setLoading(false);
        return;
      }
      
      const result = await contract.methods.concatenate(string1, string2).call();
      setConcatResult(result);
      setLoading(false);
    } catch (err) {
      console.error("Error concatenating strings:", err);
      setError("Error concatenating strings");
      setLoading(false);
    }
  };

  const handleCompare = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      if (!string1 || !string2) {
        setError("Both strings are required for comparison");
        setLoading(false);
        return;
      }
      
      const result = await contract.methods.compare(string1, string2).call();
      setComparisonResult(result ? "Strings are equal" : "Strings are not equal");
      setLoading(false);
    } catch (err) {
      console.error("Error comparing strings:", err);
      setError("Error comparing strings");
      setLoading(false);
    }
  };

  const handleGetLength = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      if (!string1) {
        setError("First string is required to get length");
        setLoading(false);
        return;
      }
      
      const result = await contract.methods.getLength(string1).call();
      setLengthResult(result);
      setLoading(false);
    } catch (err) {
      console.error("Error getting string length:", err);
      setError("Error getting string length");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Exercise 3: String Manipulation</h1>
      
      <BlockchainInfo />
      
      {error && <div className="card" style={{ color: 'red' }}>{error}</div>}
      
      {contract ? (
        <>
          <div className="card">
            <h3>Current Message</h3>
            <p>{currentMessage || "<No message set>"}</p>
            
            <h3>Set New Message (Transaction)</h3>
            <div className="form-group">
              <label>New Message:</label>
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Enter a new message"
              />
            </div>
            <button onClick={handleSetMessage} disabled={loading}>
              {loading ? 'Setting...' : 'Set Message'}
            </button>
            
            {transactionHash && (
              <div className="result">
                <p>Transaction Hash: {transactionHash}</p>
              </div>
            )}
          </div>
          
          <div className="card">
            <h3>String Operations</h3>
            <div className="form-group">
              <label>First String:</label>
              <input
                type="text"
                value={string1}
                onChange={(e) => setString1(e.target.value)}
                placeholder="Enter first string"
              />
            </div>
            <div className="form-group">
              <label>Second String:</label>
              <input
                type="text"
                value={string2}
                onChange={(e) => setString2(e.target.value)}
                placeholder="Enter second string"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <button onClick={handleConcatenate} disabled={loading}>
                Concatenate
              </button>
              <button onClick={handleCompare} disabled={loading}>
                Compare
              </button>
              <button onClick={handleGetLength} disabled={loading}>
                Get Length (First String)
              </button>
            </div>
            
            {concatResult && (
              <div className="result">
                <h4>Concatenation Result:</h4>
                <p>{concatResult}</p>
              </div>
            )}
            
            {comparisonResult && (
              <div className="result">
                <h4>Comparison Result:</h4>
                <p>{comparisonResult}</p>
              </div>
            )}
            
            {lengthResult && (
              <div className="result">
                <h4>Length of First String:</h4>
                <p>{lengthResult} characters</p>
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

export default Exercise3; 