const { ethers } = require("hardhat");

async function main() {
  try {
    const initBalance = 1; 

    const UniqueFrontendIntegrationContract = await ethers.getContractFactory("UniqueFrontendIntegrationContract");
    console.log("Contract factory created");

    const contract = await UniqueFrontendIntegrationContract.deploy(initBalance);
    console.log("Contract deployment initiated");

    // No need to call waitForDeployment() separately
    await contract.deployed(); // Wait for deployment to complete
    console.log("Contract deployed successfully");

    const targetAddress = contract.address; // 'address' instead of 'target'
    console.log(`Deployed to ${targetAddress}`);
  } catch (error) {
    console.error("An error occurred:", error);
    process.exitCode = 1;
  }
}

main();
