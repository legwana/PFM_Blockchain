// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

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