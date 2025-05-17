import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice6 } from '../utils/contracts';
import web3 from '../utils/web3';
import BlockchainInfo from './BlockchainInfo';

const Exercise6 = () => {
  // ... (keep existing state variables)

  // Effect to load numbers whenever contract or refreshTrigger changes
  useEffect(() => {
    const loadData = async () => {
      if (!contract) return;
      
      try {
        console.log("Loading numbers from blockchain...");
        // FIX 1: Use afficheTableau() instead of getAllNumbers()
        const numbersList = await contract.methods.afficheTableau().call();
        console.log("Numbers from blockchain:", numbersList);
        setNumbers(numbersList.map(num => parseInt(num)));
        
        // FIX 2: Use calcularSomme() instead of calculateSum()
        const sumResult = await contract.methods.calcularSomme().call();
        console.log("Sum from blockchain:", sumResult);
        setSum(parseInt(sumResult));
      } catch (err) {
        console.error("Error loading data from blockchain:", err);
        setError("Error loading data from the contract");
      }
    };

    loadData();
  }, [contract, refreshTrigger]);

  const handleAddNumber = async () => {
    // ... (keep existing validation)
    
    try {
      // FIX 3: Use ajouterNombre() instead of addNumber()
      const transaction = await contract.methods.ajouterNombre(numberToAdd).send({
        from: accounts[0],
        gas: 300000 // Increased gas limit for array operations
      });
      // ... (rest of the function)
    } catch (err) {
      // Improved error handling
      setError(`Transaction failed: ${err.message.split('\n')[0]}`);
      setLoading(false);
    }
  };

  const handleCalculateSum = async () => {
    if (!contract) return;
    
    try {
      // FIX 4: Use calcularSomme() instead of calculateSum()
      const result = await contract.methods.calcularSomme().call();
      setSum(parseInt(result));
    } catch (err) {
      setError("Error calculating sum: " + err.message);
    }
  };

  // ... (keep the rest of the return statement)
};

export default Exercise6;