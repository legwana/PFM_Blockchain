import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice8 } from '../utils/contracts';
import web3 from '../utils/web3';
import BlockchainInfo from './BlockchainInfo';

const Exercise8 = () => {
  const [contract, setContract] = useState(null);
  const [recipient, setRecipient] = useState('');
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [contractBalance, setContractBalance] = useState('0');
  const [transactionHash, setTransactionHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [accounts, setAccounts] = useState([]);
  
  useEffect(() => {
    const initContract = async () => {
      try {
        const contractInstance = await getExercice8();
        setContract(contractInstance);
        
        if (contractInstance) {
          // Get recipient address
          const recipientAddress = await contractInstance.methods.recipient().call();
          setRecipient(recipientAddress);
          
          // Get contract balance
          await updateContractBalance(contractInstance);
          
          // Get accounts
          const accts = await web3.eth.getAccounts();
          setAccounts(accts);
        }
      } catch (err) {
        console.error("Error initializing contract:", err);
        setError("Failed to load contract. Please check if Ganache is running and contracts are deployed.");
      }
    };

    initContract();
  }, []);
  
  const updateContractBalance = async (contractInstance) => {
    try {
      const balance = await contractInstance.methods.getBalance().call();
      setContractBalance(web3.utils.fromWei(balance, 'ether'));
    } catch (err) {
      console.error("Error getting contract balance:", err);
    }
  };

  const handleDeposit = async () => {
    if (!contract || depositAmount === '' || isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      setError("Please enter a valid deposit amount");
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const weiAmount = web3.utils.toWei(depositAmount, 'ether');
      
      // Send transaction to deposit ETH
      const transaction = await web3.eth.sendTransaction({
        from: accounts[0],
        to: contract.options.address,
        value: weiAmount
      });
      
      setTransactionHash(transaction.transactionHash);
      
      // Update contract balance
      await updateContractBalance(contract);
      
      setDepositAmount('');
      setLoading(false);
    } catch (err) {
      console.error("Error depositing funds:", err);
      setError("Error depositing funds");
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      // Withdraw all funds if no specific amount
      let transaction;
      if (withdrawAmount === '' || isNaN(parseFloat(withdrawAmount)) || parseFloat(withdrawAmount) <= 0) {
        transaction = await contract.methods.withdraw().send({
          from: accounts[0]
        });
      } else {
        // Withdraw specific amount
        const weiAmount = web3.utils.toWei(withdrawAmount, 'ether');
        transaction = await contract.methods.withdrawAmount(weiAmount).send({
          from: accounts[0]
        });
      }
      
      setTransactionHash(transaction.transactionHash);
      
      // Update contract balance
      await updateContractBalance(contract);
      
      setWithdrawAmount('');
      setLoading(false);
    } catch (err) {
      console.error("Error withdrawing funds:", err);
      setError("Error withdrawing funds. Make sure you are the recipient account.");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Exercise 8: Payment Handling</h1>
      
      <BlockchainInfo />
      
      {error && <div className="card" style={{ color: 'red' }}>{error}</div>}
      
      {contract ? (
        <>
          <div className="card">
            <h3>Contract Information</h3>
            <p><strong>Contract Address:</strong> {contract.options.address}</p>
            <p><strong>Recipient Address:</strong> {recipient}</p>
            <p><strong>Contract Balance:</strong> {contractBalance} ETH</p>
            
            {accounts[0] === recipient ? (
              <div className="result" style={{ backgroundColor: '#eaffea' }}>
                <p>You are the recipient of this contract and can withdraw funds.</p>
              </div>
            ) : (
              <div className="result" style={{ backgroundColor: '#ffeeee' }}>
                <p>You are not the recipient. Only the recipient can withdraw funds.</p>
              </div>
            )}
          </div>
          
          <div className="card">
            <h3>Deposit Funds</h3>
            <div className="form-group">
              <label>Amount (ETH):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Enter amount in ETH"
              />
            </div>
            <button onClick={handleDeposit} disabled={loading}>
              {loading ? 'Processing...' : 'Deposit ETH'}
            </button>
          </div>
          
          <div className="card">
            <h3>Withdraw Funds</h3>
            <div className="form-group">
              <label>Amount (ETH):</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                placeholder="Enter amount in ETH (leave empty to withdraw all)"
              />
            </div>
            <button 
              onClick={handleWithdraw} 
              disabled={loading || accounts[0] !== recipient}
              style={{ opacity: accounts[0] !== recipient ? 0.5 : 1 }}
            >
              {loading ? 'Processing...' : withdrawAmount ? 'Withdraw Specific Amount' : 'Withdraw All'}
            </button>
            
            {accounts[0] !== recipient && (
              <p style={{ color: 'red', marginTop: '10px' }}>
                Only the recipient can withdraw funds.
              </p>
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

export default Exercise8; 