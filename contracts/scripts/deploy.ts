import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy EnergyToken
  const energyTokenFactory = await ethers.getContractFactory("EnergyToken");
  const energyToken = await energyTokenFactory.deploy(deployer.address);
  await energyToken.waitForDeployment();
  const tokenAddress = await energyToken.getAddress();
  console.log("EnergyToken deployed to:", tokenAddress);

  // Deploy EnergyCertificate
  const energyCertificateFactory = await ethers.getContractFactory("EnergyCertificate");
  const energyCertificate = await energyCertificateFactory.deploy(deployer.address);
  await energyCertificate.waitForDeployment();
  const certAddress = await energyCertificate.getAddress();
  console.log("EnergyCertificate deployed to:", certAddress);

  // Deploy EnergyMarketplace
  const energyMarketplaceFactory = await ethers.getContractFactory("EnergyMarketplace");
  const energyMarketplace = await energyMarketplaceFactory.deploy(tokenAddress);
  await energyMarketplace.waitForDeployment();
  const marketAddress = await energyMarketplace.getAddress();
  console.log("EnergyMarketplace deployed to:", marketAddress);

  // Transfer ownership of EnergyToken to Marketplace (so it can mint/manage, or we just let Admin do it. For now, admin does it)
  // Or the marketplace is just an escrow. 

  // Save the contract addresses
  const addresses = {
    EnergyToken: tokenAddress,
    EnergyCertificate: certAddress,
    EnergyMarketplace: marketAddress
  };

  const dir = path.join(__dirname, "../../backend");
  if (!fs.existsSync(dir)){
      fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(
    path.join(__dirname, "../../backend/contract-addresses.json"),
    JSON.stringify(addresses, null, 2)
  );

  console.log("Contract addresses saved to backend/contract-addresses.json");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
