// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

abstract contract Forme {
    uint public x;
    uint public y;
    
    constructor(uint _x, uint _y) {
        x = _x;
        y = _y;
    }
    
    function deplacerForme(uint dx, uint dy) public {
        x += dx;
        y += dy;
    }
    
    function afficheXY() public view returns (uint, uint) {
        return (x, y);
    }
    
    function afficheInfos() public virtual pure returns (string memory) {
        return "Je suis une forme";
    }
    
    function surface() public virtual view returns (uint);
}

contract Rectangle is Forme {
    uint public longueur;
    uint public largeur;
    
    constructor(uint _x, uint _y, uint _longueur, uint _largeur) Forme(_x, _y) {
        longueur = _longueur;
        largeur = _largeur;
    }
    
    function surface() public override view returns (uint) {
        return longueur * largeur;
    }
    
    function afficheInfos() public override pure returns (string memory) {
        return "Je suis un Rectangle";
    }
    
    function afficheDimensions() public view returns (uint, uint) {
        return (longueur, largeur);
    }
}