// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Payment {
    address public recipient;
    
    constructor(address _recipient) {
        recipient = _recipient;
    }

    function receivePayment() public payable {
        require(msg.value > 0, "Montant invalide");
    }

    function withdraw() public {
        require(msg.sender == recipient, "Non autorise");
        payable(recipient).transfer(address(this).balance);
    }
    
    // New function to send funds to a specific address
    function sendTo(address payable _destination) public {
        require(msg.sender == recipient, "Non autorise");
        require(_destination != address(0), "Adresse de destination invalide");
        require(address(this).balance > 0, "Pas de fonds a envoyer");
        
        _destination.transfer(address(this).balance);
    }
}