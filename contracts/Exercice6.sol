// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercice6 {
    uint[] public numbers;
    
    constructor() {
        numbers = [1, 2, 3]; // Default initialization
    }
    
    function addNumber(uint _number) public {
        numbers.push(_number);
    }
    
    function getNumber(uint _index) public view returns (uint) {
        require(_index < numbers.length, "Index out of bounds");
        return numbers[_index];
    }
    
    function getAllNumbers() public view returns (uint[] memory) {
        return numbers;
    }
    
    function calculateSum() public view returns (uint) {
        uint sum = 0;
        for(uint i = 0; i < numbers.length; i++) {
            sum += numbers[i];
        }
        return sum;
    }
} 