const Exercice1 = artifacts.require("Exercice1");
const Exercice2 = artifacts.require("Exercice2");
const Exercice3 = artifacts.require("Exercice3");
const Exercice4 = artifacts.require("Exercice4");
const Exercice5 = artifacts.require("Exercice5");
const Exercice6 = artifacts.require("Exercice6");
const Exercice7 = artifacts.require("Exercice7");
const Exercice8 = artifacts.require("Exercice8");

module.exports = async function (deployer, network, accounts) {
  // Deploy Exercises 1-6
  await deployer.deploy(Exercice1);
  await deployer.deploy(Exercice2);
  await deployer.deploy(Exercice3);
  await deployer.deploy(Exercice4);
  await deployer.deploy(Exercice5);
  await deployer.deploy(Exercice6);
  
  // Deploy Exercise 7 with constructor parameters (x, y, length, width)
  await deployer.deploy(Exercice7, 0, 0, 10, 5);
  
  // Deploy Exercise 8 with the first account as recipient
  await deployer.deploy(Exercice8, accounts[0]);
}; 