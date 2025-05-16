import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getExercice7 } from '../utils/contracts';
import BlockchainInfo from './BlockchainInfo';

const Exercise7 = () => {
  const [contract, setContract] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ length: 0, width: 0 });
  const [area, setArea] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const initContract = async () => {
      try {
        const contractInstance = await getExercice7();
        setContract(contractInstance);
        
        if (contractInstance) {
          // Load initial values from the contract
          const x = await contractInstance.methods.x().call();
          const y = await contractInstance.methods.y().call();
          const length = await contractInstance.methods.length().call();
          const width = await contractInstance.methods.width().call();
          
          setPosition({ x, y });
          setDimensions({ length, width });
        }
      } catch (err) {
        console.error("Error initializing contract:", err);
        setError("Failed to load contract. Please check if Ganache is running and contracts are deployed.");
      }
    };

    initContract();
  }, []);

  const handleCalculateArea = async () => {
    if (!contract) return;
    
    try {
      setLoading(true);
      setError('');
      
      const result = await contract.methods.area().call();
      setArea(result);
      setLoading(false);
    } catch (err) {
      console.error("Error calculating area:", err);
      setError("Error calculating the area of the rectangle");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Exercise 7: OOP with Shapes</h1>
      
      <BlockchainInfo />
      
      {error && <div className="card" style={{ color: 'red' }}>{error}</div>}
      
      {contract ? (
        <>
          <div className="card">
            <h3>Rectangle Properties</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <h4>Position</h4>
                <p>X: {position.x}</p>
                <p>Y: {position.y}</p>
              </div>
              <div>
                <h4>Dimensions</h4>
                <p>Length: {dimensions.length}</p>
                <p>Width: {dimensions.width}</p>
              </div>
            </div>
            
            <div style={{ marginTop: '20px' }}>
              <button onClick={handleCalculateArea} disabled={loading}>
                {loading ? 'Calculating...' : 'Calculate Area'}
              </button>
              
              {area !== null && (
                <div className="result">
                  <p>Area of the rectangle: {area} square units</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="card">
            <h3>Class Hierarchy</h3>
            <p>
              This exercise demonstrates object-oriented programming in Solidity using inheritance.
              The Rectangle contract inherits from the abstract Shape contract.
            </p>
            <div style={{ marginTop: '15px', fontFamily: 'monospace', background: '#f0f0f0', padding: '10px', borderRadius: '4px' }}>
              <pre>{`
abstract contract Shape {
    uint public x;
    uint public y;
    
    constructor(uint _x, uint _y) {
        x = _x;
        y = _y;
    }
    
    function area() public virtual pure returns (uint);
}

contract Rectangle is Shape {
    uint public length;
    uint public width;
    
    constructor(uint _x, uint _y, uint _length, uint _width) Shape(_x, _y) {
        length = _length;
        width = _width;
    }
    
    function area() public override pure returns (uint) {
        return length * width;
    }
}
              `}</pre>
            </div>
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

export default Exercise7; 