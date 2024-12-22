const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DEX Contracts", function () {
    let Factory, factory, Pair, pair, Router, router, tokenA, tokenB, owner, addr1;

    beforeEach(async function () {
        [owner, addr1] = await ethers.getSigners();

        // Deploy Mock ERC20 Token
        const MockToken = await ethers.getContractFactory("MockToken");
        tokenA = await MockToken.deploy("Token A", "TKA", 1000);
        tokenB = await MockToken.deploy("Token B", "TKB", 1000);

        // Deploy Factory
        Factory = await ethers.getContractFactory("Factory");
        factory = await Factory.deploy();

        // Deploy Pair
        Pair = await ethers.getContractFactory("Pair");
        pair = await Pair.deploy(tokenA.address, tokenB.address);
        await factory.createPair(tokenA.address, tokenB.address);

        // Deploy Router
        Router = await ethers.getContractFactory("Router");
        router = await Router.deploy(factory.address, tokenB.address);
    });

    describe("Factory Contract", function () {
        it("Should create a new pair", async function () {
            const pairAddress = await factory.getPair(tokenA.address, tokenB.address);
            expect(pairAddress).to.not.equal(ethers.constants.AddressZero);
        });

        it("Should not create a pair with identical addresses", async function () {
            await expect(factory.createPair(tokenA.address, tokenA.address)).to.be.revertedWith("Identical addresses");
        });

        it("Should not create a pair that already exists", async function () {
            await expect(factory.createPair(tokenA.address, tokenB.address)).to.be.revertedWith("Pair already exists");
        });
    });

    describe("Pair Contract", function () {
        beforeEach(async function () {
            await tokenA.approve(pair.address, 100);
            await tokenB.approve(pair.address, 100);
            await pair.addLiquidity(100, 100);
        });

        it("Should add liquidity", async function () {
            const [reserveA, reserveB] = await pair.getReserves();
            expect(reserveA).to.equal(100);
            expect(reserveB).to.equal(100);
        });

        it("Should swap tokens", async function () {
            await tokenA.approve(pair.address, 50);
            await pair.swap(addr1.address, tokenA.address, 50);
            const [reserveA, reserveB] = await pair.getReserves();
            expect(reserveA).to.equal(50);
            expect(reserveB).to.be.greaterThan(100); // Assuming price calculation
        });

        it("Should revert on insufficient liquidity", async function () {
            await expect(pair.swap(addr1.address, tokenA.address, 100)).to.be.revertedWith("Not enough liquidity");
        });
    });

    describe("Router Contract", function () {
        beforeEach(async function () {
            await tokenA.approve(router.address, 100);
            await tokenB.approve(router.address, 100);
        });

        it("Should swap tokens", async function () {
            await pair.addLiquidity(100, 100);
            await router.swapExactTokens(addr1.address, 50, tokenA.address, tokenB.address);
            const balance = await tokenB.balanceOf(addr1.address);
            expect(balance).to.be.greaterThan(0);
        });

        it("Should add liquidity", async function () {
            await router.addLiquidity(100, 100, tokenA.address, tokenB.address);
            const [reserveA, reserveB] = await pair.getReserves();
            expect(reserveA).to.equal(100);
            expect(reserveB).to.equal(100);
        });
    });
});
