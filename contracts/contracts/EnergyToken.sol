// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EnergyToken
 * @dev ERC20 Token representing energy units (1 Token = 1 kWh).
 * Only the owner (Marketplace contract) can mint tokens.
 */
contract EnergyToken is ERC20, ERC20Burnable, Ownable {
    constructor(address initialOwner) ERC20("Energy Token", "ENERGY") Ownable(initialOwner) {}

    /**
     * @dev Mint new energy tokens. Can only be called by the marketplace/admin.
     * @param to Address to receive the tokens.
     * @param amount Amount of tokens to mint (in wei format, 1e18 = 1 kWh).
     */
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
