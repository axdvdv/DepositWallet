const Migrations = artifacts.require("Migrations");
const Token = artifacts.require("Token");
const DepositWalletFactory = artifacts.require("DepositWalletFactory");

module.exports = function (deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(DepositWalletFactory);
  deployer.deploy(Token);
};
