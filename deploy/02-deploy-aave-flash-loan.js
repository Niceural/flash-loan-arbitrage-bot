const { getNamedAccounts, deployments, network, ethers } = require("hardhat");
const {
    networkConfig,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    developmentChains,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;
    let aAavePoolAddressProvider, aArbitrage;

    if (chainId == 31337) {
        log("There are no contracts available for this network.");
        return;
    } else {
        const cArbitrage = await ethers.getContract("UniswapSushiswapArbitrage");
        aArbitrage = cArbitrage.address;
        aAavePoolAddressProvider = networkConfig[chainId]["addressAaveV3PoolAddressesProvider"];
    }
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    log("Deploying Aave V3 flash loan...");
    const arguments = [aAavePoolAddressProvider, aArbitrage];
    const cAaveFlashloan = await deploy("AaveV3FlashLoan", {
        from: deployer,
        args: arguments,
        logs: false,
        waitBlockConfirmations: waitBlockConfirmations,
    });

    // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    //     log("Verifying on etherscan...");
    //     await verify(arbitrage.address, arguments);
    // }

    log("======================================== done");
};

module.exports.tags = ["all", "flashloan"];
