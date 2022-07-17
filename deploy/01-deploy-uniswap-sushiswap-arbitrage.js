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
    let aUniSwapRouter, aSushiSwapRouter;

    if (chainId == 31337) {
        // getting the deployed mock contracts addresses
        const uniSwapRouter = await ethers.getContract("UniswapV3SwapRouterMock");
        aUniSwapRouter = uniSwapRouter.address;
        const sushiSwapRouter = await ethers.getContract("UniswapV2Router02Mock");
        aSushiSwapRouter = sushiSwapRouter.address;
    } else {
        aUniSwapRouter = networkConfig[chainId]["addressUniswapV3SwapRouter"];
        aSushiSwapRouter = networkConfig[chainId]["addressUniswapV2Router02"];
    }
    const waitBlockConfirmations = developmentChains.includes(network.name)
        ? 1
        : VERIFICATION_BLOCK_CONFIRMATIONS;

    log("Deploying Uniswap Sushiswap Arbitrage...");
    const arguments = [aUniSwapRouter, aSushiSwapRouter];
    const arbitrage = await deploy("UniswapSushiswapArbitrage", {
        from: deployer,
        args: arguments,
        log: false,
        waitConfirmations: waitBlockConfirmations,
    });

    // if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
    //     log("Verifying on etherscan...");
    //     await verify(arbitrage.address, arguments);
    // }

    log("======================================== done");
};

module.exports.tags = ["all", "arbitrage"];
