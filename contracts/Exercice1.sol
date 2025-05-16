// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercice1 {
    uint public a = 5;  // Default value
    uint public b = 10; // Default value
    
    function addition1() public view returns (uint) {
        return a + b;
    }
    
    function addition2(uint _x, uint _y) public pure returns (uint) {
        return _x + _y;
    }
} 