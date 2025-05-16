// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercice2 {
    function etherToWei(uint amountEther) public pure returns (uint) {
        return amountEther * 1 ether;
    }
    
    function weiToEther(uint amountWei) public pure returns (uint) {
        return amountWei / 1 ether;
    }
} 