const {
    abi: IUniswapV3FactoryABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");
const { ethers } = require("hardhat");
const { UniswapV3Pool } = require("./UniswapV3Pool");

async function createPoolsAndPairs(provider, config, log) {
    const pools = [];

    const uniswapV3Pools = await createUniswapV3Pools(provider, config, log);
    const sushiswapPairs = await createSushiswapPairs(provider, config, log);
    const uniswapV2Pairs = await createUniswapV2Pairs(provider, config, log);

    pools.concat(uniswapV3Pools);
    pools.concat(sushiswapPairs);
    pools.concat(uniswapV2Pairs);

    console.log(`================================== ${pools.length} pools created.`);
    return pools;
}

async function createUniswapV3Pools(provider, config, log) {
    // This function creates the UniswapV3Pool js objects
    // from the addresses in helper-hardhat-config.js

    // creating js Factory contract
    const factoryAddr = config.UniswapV3Factory;
    if (factoryAddr == null) {
        throw new Error(
            'Invalid UniswapV3Factory address, check your "helper-hardhat-config" file.'
        );
    }
    const factoryContract = new ethers.Contract(factoryAddr, IUniswapV3FactoryABI, provider);

    // getting pool assets addresses and pool fees from helper config
    const assetsList = config.idToAssetAddress;
    const fees = config.uniswapV3Fees;
    const exchangeId = 0;
    let id = 0; // js Pool id
    const pools = [];

    // create js Pool if the pool exists
    for (let t0 = 0; t0 < assetsList.length; t0++) {
        for (let t1 = t0 + 1; t1 < assetsList.length; t1++) {
            for (let fee = 0; fee < fees.length; fee++) {
                const poolAddr = await factoryContract.getPool(
                    assetsList[t0],
                    assetsList[t1],
                    fees[fee]
                );
                if (poolAddr !== ethers.constants.AddressZero) {
                    const poolObject = new UniswapV3Pool(poolAddr, provider, id, exchangeId, log);
                    await poolObject.fetchImmutables(provider);
                    pools.push(poolObject);
                    id++;
                }
            }
        }
    }

    if (pools.length === 0) throw new Error("No js UniswapV3Pools created.");
    console.log("====================================== done");
    return pools;
}

async function createSushiswapPairs(provider, config, log) {}

async function createUniswapV2Pairs(provider, config, log) {}

module.exports = {
    createPoolsAndPairs,
};
