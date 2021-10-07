// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PMToken is ERC20 {
    constructor() ERC20("Paul Mack Token", "PMT") {
        _mint(msg.sender, 100000 * (10 ** 18));
    }
}