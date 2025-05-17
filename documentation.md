# Solidity Exercises Documentation

This document explains each Solidity exercise, its functionality, and provides setup instructions.

## Setup Instructions

### Prerequisites
- Node.js and npm installed
- Truffle installed globally (`npm install -g truffle`)
- MetaMask browser extension

### Project Setup
1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start local development blockchain:
   ```
   truffle develop
   ```
4. In a new terminal, compile and deploy contracts:
   ```
   truffle compile
   truffle migrate
   ```
5. Start the frontend:
   ```
   cd client
   npm install
   npm start
   ```

### Adding a Custom Network to MetaMask
1. Open MetaMask and click on the network dropdown
2. Select "Add Network"
3. For local development:
   - Network Name: Truffle Develop
   - RPC URL: http://localhost:9545
   - Chain ID: 1337
   - Currency Symbol: ETH

### Importing Private Keys
1. In MetaMask, click on your account icon
2. Select "Import Account"
3. Enter the private key (available from `truffle develop` command output)
4. Click "Import"

## Exercise Explanations

### Exercise 1: Basic Solidity Functions
**Contract: BasicMath**

This exercise demonstrates two types of functions:
- `addition1()` - A view function that returns the sum of two state variables
- `addition2(a, b)` - A pure function that takes two parameters and returns their sum

View functions read state but don't modify it, while pure functions neither read nor modify state.

### Exercise 2: Cryptocurrency Conversion
**Contract: CryptoConverter**

This contract handles conversion between Ether and Wei:
- `etherEnWei(uint amount)` - Converts Ether to Wei (multiplies by 10^18)
- `weiEnEther(uint amount)` - Converts Wei to Ether (divides by 10^18)

### Exercise 3: String Management
**Contract: GestionChaines**

Demonstrates string handling in Solidity:
- `setMessage(string)` - Sets the message state variable
- `getMessage()` - Returns the current message
- `concatener(string a, string b)` - Concatenates two strings
- `concatenerAvec(string b)` - Concatenates message with another string
- `longueur(string s)` - Returns the length of a string
- `comparer(string a, string b)` - Compares two strings and returns a boolean

### Exercise 4: Number Verification
**Contract: PositiveCheck**

Simple contract with a function to check if a number is positive:
- `estPositif(int nombre)` - Returns true if the number is positive, false otherwise

### Exercise 5: Even-Odd Check
**Contract: ParityCheck**

Contract that verifies if a number is even or odd:
- `estPair(uint nombre)` - Returns true if the number is even, false if odd

### Exercise 6: Array Handling
**Contract: NumberArray**

Demonstrates array operations in Solidity:
- Constructor initializes the array
- `ajouterNombre(uint nombre)` - Adds a number to the array
- `getElement(uint index)` - Returns the element at the specified index with error handling
- `afficheTableau()` - Returns the entire array
- `calculerSomme()` - Returns the sum of all numbers in the array

### Exercise 7: Object-Oriented Principles
**Contract: Forme (abstract) and Rectangle**

Demonstrates inheritance and polymorphism:
- Abstract `Forme` contract with coordinates and virtual functions
- Concrete `Rectangle` contract inheriting from `Forme` with specific implementation
- Functions for moving shapes, getting information, and calculating area

### Exercise 8: Transaction Management
**Contract: Payment**

Handles payment transactions:
- `receivePayment()` - Receives Ether with validation (requires value > 0)
- `withdraw()` - Allows only the designated recipient to withdraw all contract funds 