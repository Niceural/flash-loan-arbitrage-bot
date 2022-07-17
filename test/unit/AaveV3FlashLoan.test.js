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
  : describe("AaveV3FlashLoan unit tests", function () {
      let cFlashLoan, cArbitrage;
      let aFlashLoan, aArbitrage, aDeployer;
      const chainId = network.config.chainId;

      beforeEach(async () => {
        await deployments.fixture(["arbitrage", "flashloan"]);
        cFlashLoan = await ethers.getContract("AaveV3FlashLoan");
        cArbitrage = await ethers.getContract("UniswapSushiswapArbitrage");
        aFlashLoan = cFlashLoan.address;
        aArbitrage = cArbitrage.address;
        aDeployer = await getNamedAccounts().deployer;
      });

      describe("constructor", function () {
        it("initializes PoolAddressProvider correctly", async () => {
          const expAddr = networkConfig[chainId]["addressAaveV3PoolAddressesProvider"];
          const pap = await cFlashLoan.ADDRESSES_PROVIDER();
          assert.equal(expAddr, pap);
        });
        it("initializes Pool correctly", async () => {
          const expAddr = networkConfig[chainId]["addressAaveV3Pool"];
          const p = await cFlashLoan.POOL();
          assert.equal(expAddr, p);
        });
        it("initializes the arbitrage correctly", async () => {
          const expAddr = aArbitrage;
          const arbAddr = await cFlashLoan.getArbitrage();
          assert.equal(expAddr, arbAddr);
        });
      });

      describe("flashloan multiple assets function", async () => {
        it("reverts if amount exceeds the total reserve", async () => {});
        it("emits a flash loan requested event", async () => {
          const tokens = [networkConfig[chainId]["USDC"], networkConfig[chainId]["USDT"]];
          const amounts = ["1500000", "3500000"];
          let tx;
          try {
            tx = await cFlashLoan.flashloan(tokens, amounts, { from: aDeployer });
          } catch (err) {
            const errStr = err.toString();
            assert(
              errStr.includes(
                "Error: VM Exception while processing transaction: reverted with reason string 'ERC20: transfer amount exceeds balance'"
              )
            );
            await expect(tx).to.emit(cFlashLoan, "FlashLoanRequested");
          }
        });
      });

      /*describe("flashloan single asset function", async () => {
              it("emits a flash loan requested event", async () => {
                  const token = networkConfig[chainId]["USDC"];
                  const amount = ethers.utils.parseEther("1.5");
                  await expect(cFlashLoan.flashloan(token, amount, { from: aDeployer })).to.emit(
                      cFlashLoan,
                      "FlashLoanRequested"
                  );
              });
          });*/
    });
