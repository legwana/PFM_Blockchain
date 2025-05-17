const Exercice1 = artifacts.require("Exercice1");
const Exercice2 = artifacts.require("Exercice2");
const Exercice3 = artifacts.require("Exercice3");
const Exercice4 = artifacts.require("Exercice4");
const Exercice5 = artifacts.require("Exercice5");
const Exercice6 = artifacts.require("Exercice6");
const Exercice7 = artifacts.require("Rectangle");  
const Payment = artifacts.require("Payment");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Exercice1);
  await deployer.deploy(Exercice2);
  await deployer.deploy(Exercice3);
  await deployer.deploy(Exercice4);
  await deployer.deploy(Exercice5);
  await deployer.deploy(Exercice6, []);
  await deployer.deploy(Exercice7, 0, 0, 10, 5);
  await deployer.deploy(Payment, accounts[0]);
};