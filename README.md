# PFM Blockchain Project

This project consists of a Solidity-based blockchain application with 8 smart contracts and a React frontend. The project is part of the PFM module, implementing exercises from TP3.

## Smart Contracts

The project implements the following Solidity contracts:

1. **Exercise 1**: Simple addition functions with state variables and parameter-based calculations.
2. **Exercise 2**: Ether/Wei conversion utilities.
3. **Exercise 3**: String manipulation functions (concatenation, comparison, length).
4. **Exercise 4**: Function to check if a number is positive.
5. **Exercise 5**: Function to check if a number is even.
6. **Exercise 6**: Array manipulation with dynamic array storage and sum calculation.
7. **Exercise 7**: Object-oriented programming with shape inheritance.
8. **Exercise 8**: Payment handling with Ether transfers.

## Technology Stack

- **Smart Contracts**: Solidity 0.8.21
- **Development Framework**: Truffle
- **Local Blockchain**: Ganache
- **Frontend**: React with Web3.js
- **Styling**: CSS

## Project Setup

### Prerequisites

- Node.js and npm
- Ganache (for local blockchain)
- Truffle (for contract development and deployment)
- MetaMask (optional, for browser integration)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd PFM_Blockchain
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start Ganache:
   - Run Ganache on port 7545
   - Make sure the network ID matches the one in truffle-config.js

4. Compile and deploy contracts:
   ```
   npx truffle compile
   npx truffle migrate --reset
   ```

5. Install React client dependencies:
   ```
   cd client
   npm install
   ```

6. Start the React development server:
   ```
   npm start
   ```

7. Open the application in your browser at `http://localhost:3000`

## Project Structure

- `contracts/`: Contains all Solidity contracts
- `migrations/`: Contains Truffle migration scripts
- `client/`: Contains the React frontend
  - `src/components/`: React components for each exercise
  - `src/utils/`: Utility functions for Web3 and contract integration

## Using the Application

1. Connect to the application with MetaMask or use the default Ganache accounts
2. Navigate through the exercises using the home page
3. Each exercise page allows interaction with the corresponding smart contract
4. Blockchain information is displayed on each page, including current account and network status

## License

MIT 