// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./factory.sol";

contract Router {
    Factory public factory;
    address public purchaseToken;

    constructor(Factory _factory, address _purchaseToken) {
        factory = _factory;
        purchaseToken = _purchaseToken;
    }

    function swapExactTokens(address receiver, uint256 amountIn, IERC20 tokenIn, IERC20 tokenOut) external payable {
        address pairAddress = factory.getPair(address(tokenIn), address(tokenOut));
        require(pairAddress != address(0), "PAIR_NOT_FOUND");

        Pair dexpair = Pair(pairAddress);
        if (address(tokenIn) == address(0)) {
            // If tokenIn is ETH
            require(msg.value == amountIn, "ETH amount must match the value sent");
        } else {
            tokenIn.transferFrom(msg.sender, address(this), amountIn);
            tokenIn.approve(pairAddress, amountIn);
        }
        dexpair.swap(receiver, tokenIn, amountIn);
    }

    function addLiquidity(uint256 amountA, uint256 amountB, IERC20 tokenA, IERC20 tokenB) external payable {
        address pairAddress = factory.getPair(address(tokenA), address(tokenB));
        require(pairAddress != address(0), "PAIR_NOT_FOUND");

        Pair dexpair = Pair(pairAddress);
        if (address(tokenA) == address(0)) {
            // If tokenA is ETH
            require(amountB == msg.value, "ETH amount must match the value sent");
            dexpair.addLiquidity(0, amountB); // amountA is 0 for ETH
        } else if (address(tokenB) == address(0)) {
            // If tokenB is ETH
            require(amountA == msg.value, "ETH amount must match the value sent");
            dexpair.addLiquidity(amountA, 0); // amountB is 0 for ETH
        } else {
            tokenA.transferFrom(msg.sender, address(dexpair), amountA);
            tokenB.transferFrom(msg.sender, address(dexpair), amountB);
            dexpair.addLiquidity(amountA, amountB);
        }
    }

    function getPoolPrice(address tokenIn) public view returns(uint256 price) {
        address pairAddress = factory.getPair(tokenIn, purchaseToken);
        Pair dexpair = Pair(pairAddress);
        price = dexpair.price(tokenIn);
    }
}