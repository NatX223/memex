// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Pair {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    constructor(IERC20 _tokenA, IERC20 _tokenB) {
        require(address(_tokenA) != address(0) || address(_tokenB) != address(0), "At least one token must be valid");
        tokenA = _tokenA;
        tokenB = _tokenB;
    }

    function addLiquidity(uint256 amountA, uint256 amountB) public payable {
        require(amountA > 0 || amountB > 0, "At least one amount must be greater than zero");

        if (address(tokenA) == address(0)) {
            // If tokenA is ETH
            require(amountB == msg.value, "ETH amount must match the value sent");
            reserveB += amountB;
        } else if (address(tokenB) == address(0)) {
            // If tokenB is ETH
            require(amountA == msg.value, "ETH amount must match the value sent");
            reserveA += amountA;
        } else {
            // Both are ERC20 tokens
            reserveA += amountA;
            reserveB += amountB;
        }
    }

    function swap(address recipient, IERC20 inputToken, uint256 inputAmount) public payable {
        require(inputAmount > 0, "Amount must be greater than zero");

        // Determine the output token and reserves based on the input token
        (IERC20 outputToken, uint256 inputReserve, uint256 outputReserve) = inputToken == tokenA 
            ? (tokenB, reserveA, reserveB) 
            : (tokenA, reserveB, reserveA);

        // Handle ETH input
        if (address(inputToken) == address(0)) {
            require(inputAmount == msg.value, "ETH amount must match the value sent");
            reserveA += inputAmount; // Assuming tokenA is ETH
        } else {
            // Transfer the input token amount from the caller to the contract
            inputToken.transferFrom(msg.sender, address(this), inputAmount);
        }

        // Calculate the output amount using the price formula
        uint256 outputAmount = getPrice(inputAmount, inputReserve, outputReserve);
        require(outputAmount <= outputReserve, "Not enough liquidity");

        // Update reserves
        if (inputToken == tokenA) {
            reserveA += inputAmount;
            reserveB -= outputAmount;
        } else {
            reserveB += inputAmount;
            reserveA -= outputAmount;
        }

        // Transfer the output token to the recipient
        outputToken.transfer(recipient, outputAmount);
    }


    function getPrice(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) public pure returns (uint256) {
        return (inputAmount * outputReserve) / inputReserve;
    }

    function price(address inputToken) public view returns(uint256 outputAmount) {
        (IERC20 outputToken, uint256 inputReserve, uint256 _outputReserve) = IERC20(inputToken) == tokenA 
        ? (tokenB, reserveA, reserveB)
        : (tokenA, reserveB, reserveA);

        uint256 inputAmount = 1;

        uint256 outputReserve = _outputReserve / (10 ** 6);

        uint256 _outputAmount = (inputAmount * outputReserve) / (inputReserve / (10 ** 18));

        outputAmount = _outputAmount * (10 ** 18);
    }

    function getReserves() public view returns (uint256, uint256) {
        return (reserveA, reserveB);
    }
}
