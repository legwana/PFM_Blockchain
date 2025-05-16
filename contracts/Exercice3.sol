// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercice3 {
    string public message;
    
    function setMessage(string memory _message) public {
        message = _message;
    }
    
    function getMessage() public view returns (string memory) {
        return message;
    }
    
    function concatenate(string memory a, string memory b) public pure returns (string memory) {
        return string.concat(a, b);
    }
    
    function getLength(string memory str) public pure returns (uint) {
        return bytes(str).length;
    }
    
    function compare(string memory a, string memory b) public pure returns (bool) {
        return keccak256(bytes(a)) == keccak256(bytes(b));
    }
} 