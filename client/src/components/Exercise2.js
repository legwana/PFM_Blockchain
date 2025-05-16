import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice2 } from '../utils/contracts';
import web3 from '../utils/web3';
import BlockchainInfo from './BlockchainInfo';

const Exercise2 = () => {
  const [contract, setContract] = useState(null);
  const [etherValue, setEtherValue] = useState('');
  const [weiValue, setWeiValue] = useState('');
  const [etherToWeiResult, setEtherToWeiResult] = useState('');
  const [weiToEtherResult, setWeiToEtherResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const initContract = async () => {
      try {
        const contractInstance = await getExercice2();
        setContract(contractInstance);
      } catch (err) {
        console.error("Error initializing contract:", err);
        setError("Failed to load contract. Please check if Ganache is running and contracts are deployed.");
      }
    };

    initContract();
  }, []);

  const handleEtherToWei = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      if (!etherValue || isNaN(parseFloat(etherValue))) {
        setError("Please enter a valid Ether amount");
        setLoading(false);
        return;
      }
      
      const result = await contract.methods.etherToWei(etherValue).call();
      setEtherToWeiResult(result);
      setLoading(false);
    } catch (err) {
      console.error("Error calling etherToWei:", err);
      setError("Error converting Ether to Wei");
      setLoading(false);
    }
  };

  const handleWeiToEther = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      if (!weiValue || isNaN(parseFloat(weiValue))) {
        setError("Please enter a valid Wei amount");
        setLoading(false);
        return;
      }
      
      const result = await contract.methods.weiToEther(weiValue).call();
      setWeiToEtherResult(result);
      setLoading(false);
    } catch (err) {
      console.error("Error calling weiToEther:", err);
      setError("Error converting Wei to Ether");
      setLoading(false);
    }
  };

  // Web3 utility functions for demonstration
  const directConvertEtherToWei = () => {
    if (!etherValue || isNaN(parseFloat(etherValue))) {
      setError("Please enter a valid Ether amount");
      return;
    }
    
    try {
      const result = web3.utils.toWei(etherValue, 'ether');
      setEtherToWeiResult(result);
    } catch (err) {
      console.error("Error with Web3 conversion:", err);
      setError("Error with Web3 conversion");
    }
  };

  const directConvertWeiToEther = () => {
    if (!weiValue || isNaN(parseFloat(weiValue))) {
      setError("Please enter a valid Wei amount");
      return;
    }
    
    try {
      const result = web3.utils.fromWei(weiValue, 'ether');
      setWeiToEtherResult(result);
    } catch (err) {
      console.error("Error with Web3 conversion:", err);
      setError("Error with Web3 conversion");
    }
  };

  return (
    <div className="container">
      <h1>Exercise 2: Ether/Wei Conversion</h1>
      
      <BlockchainInfo />
      
      {error && <div className="card" style={{ color: 'red' }}>{error}</div>}
      
      {contract ? (
        <>
          <div className="card">
            <h3>Convert Ether to Wei (1 Ether = 10^18 Wei)</h3>
            <div className="form-group">
              <label>Ether Amount:</label>
              <input
                type="number"
                value={etherValue}
                onChange={(e) => setEtherValue(e.target.value)}
                placeholder="Enter Ether amount"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleEtherToWei} disabled={loading}>
                {loading ? 'Converting...' : 'Convert (Smart Contract)'}
              </button>
              <button onClick={directConvertEtherToWei}>
                Convert (Web3)
              </button>
            </div>
            {etherToWeiResult && (
              <div className="result">
                <p>Result (Wei): {etherToWeiResult}</p>
              </div>
            )}
          </div>
          
          <div className="card">
            <h3>Convert Wei to Ether</h3>
            <div className="form-group">
              <label>Wei Amount:</label>
              <input
                type="number"
                value={weiValue}
                onChange={(e) => setWeiValue(e.target.value)}
                placeholder="Enter Wei amount"
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleWeiToEther} disabled={loading}>
                {loading ? 'Converting...' : 'Convert (Smart Contract)'}
              </button>
              <button onClick={directConvertWeiToEther}>
                Convert (Web3)
              </button>
            </div>
            {weiToEtherResult && (
              <div className="result">
                <p>Result (Ether): {weiToEtherResult}</p>
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

export default Exercise2; 