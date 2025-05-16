// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercice8 {
    address public recipient;
    
    constructor(address _recipient) {
        recipient = _recipient;
    }
    
    // Function to allow receiving ether
    receive() external payable {
        // No logic needed, just receive the Ether
    }
    
    // Function to get the contract balance
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    
    // Function to withdraw the contract balance
    function withdraw() public {
        require(msg.sender == recipient, "Only the recipient can withdraw");
        payable(recipient).transfer(address(this).balance);
    }
    
    // Function to withdraw a specific amount
    function withdrawAmount(uint _amount) public {
        require(msg.sender == recipient, "Only the recipient can withdraw");
        require(_amount <= address(this).balance, "Insufficient balance");
        payable(recipient).transfer(_amount);
    }
} 