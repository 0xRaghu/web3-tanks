// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract GameReward is ERC20Burnable {
    constructor(
        address receiver,
        uint256 amount,
        address approveFor,
        string memory _name,
        string memory _symbol
    ) ERC20(_name, _symbol) {
        _mint(receiver, amount);
        _approve(receiver, approveFor, amount);
    }
}
