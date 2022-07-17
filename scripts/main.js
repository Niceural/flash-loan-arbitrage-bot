"use strict";
const { network, ethers } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const { createUniswapPools } = require("./uniswap/uniV3Pools");

async function main() {
    const pools = await createUniswapPools(true);

    for (let i = 0; i < pools.length; i++) {
        await pools[i].fetchPoolState();
    }
    console.log(pools[0].token1Token0Price());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
