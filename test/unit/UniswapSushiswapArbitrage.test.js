const { assert, expect } = require("chai");
const { network, deployments, ethers, getNamedAccounts } = require("hardhat");
const {
    developmentChains,
    networkConfig,
    INITIAL_SUPPLY,
    ROUTER_BALANCE,
} = require("../../helper-hardhat-config");

!developmentChains.includes(network.name)
    ? describe.skip
    : describe("UniswapSushiswapArbitrage unit tests", function () {
          let cArbitrage, cUniRouter, cSushiRouter, cToken1, cToken2;
          let aToken1, aToken2, aDeployer, aCaller;

          beforeEach(async () => {
              // contracts
              await deployments.fixture(["mocks", "arbitrage"]);
              cToken1 = await ethers.getContract("Token1Mock");
              cToken2 = await ethers.getContract("Token2Mock");
              cUniRouter = await ethers.getContract("UniswapV3SwapRouterMock");
              cSushiRouter = await ethers.getContract("UniswapV2Router02Mock");
              cArbitrage = await ethers.getContract("UniswapSushiswapArbitrage");
              // accounts/addresses
              aDeployer = await getNamedAccounts().deployer;
              aCaller = await getNamedAccounts().caller;
              aToken1 = cToken1.address;
              aToken2 = cToken2.address;
              // transfer some tokens to aCaller
              const amount = ethers.utils.parseEther("1000");
              cToken1.transfer(aCaller, amount, { from: aDeployer });
              cToken2.transfer(aCaller, amount, { from: aDeployer });
          });

          describe("constructor", function () {
              it("initializes the arbitrage correctly", async () => {
                  const aUniRouter = await cArbitrage.getUniSwapRouterAddress();
                  assert.equal(aUniRouter, cUniRouter.address);
              });
              it("router's balances are correct", async () => {
                  const t1UniBalance = await cToken1.balanceOf(cUniRouter.address);
                  const t2UniBalance = await cToken2.balanceOf(cUniRouter.address);
                  const t1SushiBalance = await cToken1.balanceOf(cSushiRouter.address);
                  const t2SushiBalance = await cToken2.balanceOf(cSushiRouter.address);
                  assert.equal(t1UniBalance, ROUTER_BALANCE);
                  assert.equal(t2UniBalance, ROUTER_BALANCE);
                  assert.equal(t1SushiBalance, ROUTER_BALANCE);
                  assert.equal(t2SushiBalance, ROUTER_BALANCE);
              });
          });

          describe("uniSwapExactInputSingle()", async () => {
              it("reverts if the caller has not allowed the arbitrage to transfer amountIn", async () => {
                  await expect(
                      cArbitrage.uniSwapExactInputSingle(aToken1, aToken2, "1", "3000", {
                          from: aDeployer,
                      })
                  ).to.be.revertedWith("UniswapSushiswapArbitrage__ArbitrageNotAllowedBySender");
              });
              it("performs swap correctly", async () => {
                  const balanceT1Before = await cToken1.balanceOf(aCaller);
                  const balanceT2Before = await cToken2.balanceOf(aCaller);
                  const amountIn = balanceT1Before / 87;
                  const expectedBalanceT1After = balanceT1Before - amountIn;
                  console.log(amountIn);
              });
          });
      });
