// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./Token.sol";

contract TokenFactory {
    uint256 public initialSupply;
    address public latestTokenAddress;

    constructor(uint256 _initialSupply) {
        initialSupply = _initialSupply;
    }
 
    function deployToken(string memory name, string memory symbol) public returns(address) {
        Token newToken = new Token(name, symbol, initialSupply, msg.sender);
        latestTokenAddress = address(newToken);
        return address(newToken);
    }
}