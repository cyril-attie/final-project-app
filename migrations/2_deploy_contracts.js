const Withdrawal = artifacts.require("Withdrawal.sol");
const EthMov = artifacts.require("EthMov.sol");

module.exports = (deployer) => {
  deployer.deploy(Withdrawal);
  deployer.deploy(EthMov);

};