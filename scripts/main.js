"use strict";
const { network, ethers } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const { createPoolsAndPairs } = require("./fetchPrices/createPoolsAndPairs");

async function main() {
    // check hardhat config
    console.log("Checking hardhat config...");
    const chainId = network.config.chainId;
    if (chainId == null) throw new Error('Invalid chainId, check your "hardhat.config.js"');
    const rpc = network.name === "hardhat" ? network.config.forking.url : network.config.url;
    if (rpc == null) throw new Error('Invalid RPC provider, check ".env" and "hardhat.config.js"');
    const provider = new ethers.providers.JsonRpcProvider(rpc);
    const log = true;

    // instantiate Uniswap and Sushiswap pools and pairs
    console.log("Instantiating Uniswap and Sushiswap Pools and Pairs...");
    const pools = await createPoolsAndPairs(provider, networkConfig[chainId], log);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
