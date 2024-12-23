const fs = require('fs'); // Import the file system module
const { ethers } = require('hardhat');

async function main() {
    const [signer] = await ethers.getSigners();

    const Factory = await ethers.getContractFactory('TokenFactory', signer);

    const initialSupply = ethers.parseEther("1000000");
    const factory = await Factory.deploy(initialSupply);
    const factoryAddress = await factory.getAddress();

    console.log(`factoryAddress: ${factoryAddress}`);

    console.log('Addresses saved to deployedAddresses.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
