// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercice5 {
    function estPair(uint _nombre) public pure returns (bool) {
        return _nombre % 2 == 0;
    }
}