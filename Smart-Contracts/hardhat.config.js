require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    MODE: {
      url: "https://mainnet.mode.network",
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
