import { expect } from "chai";
import { ethers } from "hardhat";
import { EnergyToken, EnergyMarketplace } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("EnergyMarketplace", function () {
  let energyToken: EnergyToken;
  let marketplace: EnergyMarketplace;
  let owner: HardhatEthersSigner;
  let seller: HardhatEthersSigner;
  let buyer: HardhatEthersSigner;

  beforeEach(async function () {
    [owner, seller, buyer] = await ethers.getSigners();

    const Token = await ethers.getContractFactory("EnergyToken");
    energyToken = await Token.deploy(owner.address);
    await energyToken.waitForDeployment();

    const Marketplace = await ethers.getContractFactory("EnergyMarketplace");
    marketplace = await Marketplace.deploy(await energyToken.getAddress());
    await marketplace.waitForDeployment();

    // Mint tokens to seller
    await energyToken.mint(seller.address, ethers.parseEther("100"));
  });

  it("Should list energy for sale", async function () {
    await energyToken.connect(seller).approve(await marketplace.getAddress(), ethers.parseEther("50"));
    
    await expect(marketplace.connect(seller).listEnergy(ethers.parseEther("50"), ethers.parseEther("0.01")))
      .to.emit(marketplace, "EnergyListed")
      .withArgs(0, seller.address, ethers.parseEther("50"), ethers.parseEther("0.01"));
    
    const listing = await marketplace.listings(0);
    expect(listing.amount).to.equal(ethers.parseEther("50"));
    expect(listing.isActive).to.be.true;
  });

  it("Should allow buying energy", async function () {
    await energyToken.connect(seller).approve(await marketplace.getAddress(), ethers.parseEther("50"));
    await marketplace.connect(seller).listEnergy(ethers.parseEther("50"), ethers.parseEther("0.01"));

    const totalCost = ethers.parseEther("0.1"); // 10 tokens * 0.01 ETH
    
    await expect(marketplace.connect(buyer).buyEnergy(0, ethers.parseEther("10"), { value: totalCost }))
      .to.emit(marketplace, "EnergyPurchased")
      .withArgs(0, buyer.address, seller.address, ethers.parseEther("10"), totalCost);
    
    expect(await energyToken.balanceOf(buyer.address)).to.equal(ethers.parseEther("10"));
  });

  it("Should allow canceling a listing", async function () {
    await energyToken.connect(seller).approve(await marketplace.getAddress(), ethers.parseEther("50"));
    await marketplace.connect(seller).listEnergy(ethers.parseEther("50"), ethers.parseEther("0.01"));

    await expect(marketplace.connect(seller).cancelListing(0))
      .to.emit(marketplace, "ListingCancelled")
      .withArgs(0, seller.address);
    
    const listing = await marketplace.listings(0);
    expect(listing.isActive).to.be.false;
    expect(await energyToken.balanceOf(seller.address)).to.equal(ethers.parseEther("100")); // Refunded
  });
});
