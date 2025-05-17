// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Exercice6 {
    uint[] private nombres;

    constructor(uint[] memory _valeurInitiales) {
        // If no values are provided, use defaults
        if (_valeurInitiales.length == 0) {
        nombres = [10, 20, 30]; 
        } else {
            // Copy provided values to nombres array
            for(uint i = 0; i < _valeurInitiales.length; i++) {
                nombres.push(_valeurInitiales[i]);
            }
        }
    }
    
    function ajouterNombre(uint _nombre) public {
        nombres.push(_nombre);
    }

    function getElement(uint index) public view returns (uint) {
        require(index < nombres.length, "Indice hors limites");
        return nombres[index];
    }

    function afficheTableau() public view returns (uint[] memory) {
        return nombres;
    }

    function calculerSomme() public view returns (uint) {
        uint somme = 0;
        for(uint i = 0; i < nombres.length; i++) {
            somme += nombres[i];
        }
        return somme;
    }
}