// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./pair.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Factory {
    // Event to emit when a new pair is created
    event PairCreated(address indexed tokenA, address indexed tokenB, address pair, uint);

    // Mapping to store pairs
    mapping(address => mapping(address => address)) public getPair;
    address[] public allPairs;

    // Function to create a new trading pair
    function createPair(address tokenA, address tokenB) external returns (address pair) {
        require(tokenA != tokenB, "Identical addresses");
        require(getPair[tokenA][tokenB] == address(0), "Pair already exists");

        // Ensure at least one token is valid (either an ERC20 token or ETH)
        require(tokenA != address(0) || tokenB != address(0), "At least one token must be valid");

        pair = address(new Pair(IERC20(tokenA), IERC20(tokenB)));
        getPair[tokenA][tokenB] = pair;
        getPair[tokenB][tokenA] = pair; // Ensure both directions are mapped
        allPairs.push(pair);

        emit PairCreated(tokenA, tokenB, pair, allPairs.length);
    }

    // Function to get all pairs
    function allPairsLength() external view returns (uint) {
        return allPairs.length;
    }
}