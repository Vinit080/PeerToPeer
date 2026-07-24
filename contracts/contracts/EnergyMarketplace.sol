// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./EnergyToken.sol";

/**
 * @title EnergyMarketplace
 * @dev Manages listing, purchasing, and settlement of energy trades.
 */
contract EnergyMarketplace is Ownable, ReentrancyGuard {
    EnergyToken public energyToken;

    struct Listing {
        uint256 id;
        address seller;
        uint256 amount;       // Total amount of energy for sale
        uint256 pricePerUnit; // Price per unit of energy (in wei of ETH)
        bool isActive;
    }

    uint256 private _listingIdCounter;
    mapping(uint256 => Listing) public listings;

    event EnergyListed(uint256 indexed listingId, address indexed seller, uint256 amount, uint256 pricePerUnit);
    event EnergyPurchased(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 amount, uint256 totalCost);
    event ListingCancelled(uint256 indexed listingId, address indexed seller);

    constructor(address _energyTokenAddress) Ownable(msg.sender) {
        energyToken = EnergyToken(_energyTokenAddress);
    }

    /**
     * @dev List energy for sale. Requires seller to have approved the marketplace contract to spend their tokens.
     */
    function listEnergy(uint256 amount, uint256 pricePerUnit) external nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than zero");
        require(pricePerUnit > 0, "Price must be greater than zero");
        
        // Transfer energy tokens to marketplace (Escrow)
        require(energyToken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        uint256 listingId = _listingIdCounter++;
        listings[listingId] = Listing({
            id: listingId,
            seller: msg.sender,
            amount: amount,
            pricePerUnit: pricePerUnit,
            isActive: true
        });

        emit EnergyListed(listingId, msg.sender, amount, pricePerUnit);
        
        return listingId;
    }

    /**
     * @dev Buy energy from a listing. Buyer sends ETH.
     */
    function buyEnergy(uint256 listingId, uint256 amount) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.isActive, "Listing is not active");
        require(listing.amount >= amount, "Not enough energy in listing");
        
        uint256 totalCost = amount * listing.pricePerUnit;
        require(msg.value >= totalCost, "Insufficient ETH sent");

        // Update listing
        listing.amount -= amount;
        if (listing.amount == 0) {
            listing.isActive = false;
        }

        // Send tokens to buyer
        require(energyToken.transfer(msg.sender, amount), "Token transfer failed");

        // Send ETH to seller
        (bool success, ) = payable(listing.seller).call{value: totalCost}("");
        require(success, "ETH transfer to seller failed");

        // Refund excess ETH back to buyer
        if (msg.value > totalCost) {
            (bool refundSuccess, ) = payable(msg.sender).call{value: msg.value - totalCost}("");
            require(refundSuccess, "ETH refund failed");
        }

        emit EnergyPurchased(listingId, msg.sender, listing.seller, amount, totalCost);
    }

    /**
     * @dev Cancel a listing and refund unsold tokens back to the seller.
     */
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender || msg.sender == owner(), "Not authorized");
        require(listing.isActive, "Listing is already inactive");

        listing.isActive = false;

        require(energyToken.transfer(listing.seller, listing.amount), "Token transfer failed");

        emit ListingCancelled(listingId, listing.seller);
    }
}
