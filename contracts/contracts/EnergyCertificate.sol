// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EnergyCertificate
 * @dev ERC721 NFT representing registered energy production sources (e.g. Solar Panels, Wind Turbines).
 * Each NFT is a certificate of ownership for a registered capacity.
 */
contract EnergyCertificate is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Struct to hold certificate details
    struct CertificateDetails {
        string source;       // e.g. "Solar Panel", "Wind Turbine"
        uint256 capacity;    // Capacity in kWh (represented in wei)
        string location;     // Geographic location string or hash
        bool isActive;       // Whether this source is currently active
    }

    // Mapping from token ID to details
    mapping(uint256 => CertificateDetails) public certificates;

    // Events
    event CertificateMinted(uint256 indexed tokenId, address indexed owner, string source, uint256 capacity);

    constructor(address initialOwner) ERC721("Energy Certificate", "ECERT") Ownable(initialOwner) {}

    /**
     * @dev Mint a new certificate for a producer. Only owner/admin can mint after verifying.
     * @param to The producer address.
     * @param uri The IPFS URI or metadata link.
     * @param source Type of energy source.
     * @param capacity Capacity of the source.
     * @param location Location of the source.
     */
    function mintCertificate(
        address to,
        string memory uri,
        string memory source,
        uint256 capacity,
        string memory location
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);

        certificates[tokenId] = CertificateDetails({
            source: source,
            capacity: capacity,
            location: location,
            isActive: true
        });

        emit CertificateMinted(tokenId, to, source, capacity);
        
        return tokenId;
    }

    /**
     * @dev Toggle the active status of a certificate.
     */
    function toggleStatus(uint256 tokenId) public onlyOwner {
        require(_ownerOf(tokenId) != address(0), "Certificate does not exist");
        certificates[tokenId].isActive = !certificates[tokenId].isActive;
    }
}
