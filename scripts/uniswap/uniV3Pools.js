const {
    abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const {
    abi: IUniswapV3FactoryABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json");
const { network, ethers } = require("hardhat");
const { networkConfig } = require("../../helper-hardhat-config");

class UniswapV3Pool {
    constructor(poolAddr, id, log) {
        if (poolAddr == null) throw new TypeError("Expected Pool address and got Zero address.");
        this.__poolAddr = poolAddr;
        this.__id = id;
        this.log = log;
    }

    // =============================================================
    //                                               pool immutables
    // =============================================================
    async fetchPoolImmutables(provider) {
        if (provider == null) throw new TypeError("Provider is undefined");
        this.__poolContract = new ethers.Contract(this.__poolAddr, IUniswapV3PoolABI, provider);
        [
            this.__factoryAddr,
            this.__token0Addr,
            this.__token1Addr,
            this.__fee,
            this.__tickSpacing,
            this.__maxLiquidityPerTick,
        ] = await Promise.all([
            this.__poolContract.factory(),
            this.__poolContract.token0(),
            this.__poolContract.token1(),
            this.__poolContract.fee(),
            this.__poolContract.tickSpacing(),
            this.__poolContract.maxLiquidityPerTick(),
        ]);
        if (this.log) this.printPoolImmutables();
    }

    factoryAddr() {
        return this.__factoryAddr;
    }

    token0Addr() {
        return this.__token0Addr;
    }

    token1Addr() {
        return this.__token1Addr;
    }

    fee() {
        return this.__fee;
    }

    printPoolImmutables() {
        console.log(`Printing pool immutables of pool ${this.__id}:`);
        console.log("   Factory: ", this.__factoryAddr);
        console.log("   Pool: ", this.__poolAddr);
        console.log("   Token 0: ", this.__token0Addr);
        console.log("   Token 1: ", this.__token1Addr);
        console.log("   Fee: ", this.__fee);
        console.log("   Tick spacing: ", this.__tickSpacing);
        console.log(`   Max liquidity per tick: ${this.__maxLiquidityPerTick}.\n`);
    }

    // =============================================================
    //                                                    pool state
    // =============================================================
    async fetchPoolState() {
        const [liquidity, slot] = await Promise.all([
            this.__poolContract.liquidity(),
            this.__poolContract.slot0(),
        ]);

        this.__poolState = {
            liquidity: liquidity,
            sqrtPriceX96: slot[0], // sqrt(token1 / token0)
            tick: slot[1],
            observationIndex: slot[2],
            observationCardinality: slot[3],
            observationCardinalityNext: slot[4],
            feeProtocol: slot[5],
            unlocked: slot[6],
        };

        if (this.log) this.printPoolState();
    }

    liquidity() {
        return this.__poolState.liquidity;
    }

    sqrtToken1Token0Price() {
        return this.__poolState.sqrtPriceX96;
    }

    token1Token0Price() {
        const num = this.__poolState.sqrtPriceX96;
        num.mul(num);
        num.mul(ethers.BigNumber.from("10").pow(ethers.BigNumber.from("18")));
        const denom = ethers.BigNumber.from("2").pow("192");
        return num.div(denom);
    }

    tick() {
        return this.__poolState.tick;
    }

    feeProtocol() {
        return this.__poolState.feeProtocol;
    }

    printPoolState() {
        console.log(`Printing pool state of pool ${this.__id}:`);
        console.log("   Liquidity: ", this.__poolState.liquidity);
        console.log("   SqrtPriceX96: ", this.__poolState.sqrtPriceX96);
        console.log("   Tick: ", this.__poolState.tick);
        console.log("   ObservationIndex: ", this.__poolState.observationIndex);
        console.log("   ObservationCardinality: ", this.__poolState.observationCardinality);
        console.log("   ObservationCardinalityNext: ", this.__poolState.observationCardinalityNext);
        console.log("   FeeProtocol: ", this.__poolState.feeProtocol);
        console.log(`   Unlocked: ${this.__poolState.unlocked}.\n`);
    }
}

async function createUniswapPools(log) {
    // This function creates the UniswapV3Pool js objects
    // from the addresses in helper-hardhat-config.js
    console.log('Creating js "UniswapV3Pool"s...');

    // getting chainId and provider
    const chainId = network.config.chainId;
    if (chainId == null) throw new TypeError("Invalid chainId, check your hardhat config file.");
    const rpc = network.name === "hardhat" ? network.config.forking.url : network.config.url;
    if (rpc == null) throw new TypeError("Invalid provider, check your .env file.");
    const provider = new ethers.providers.JsonRpcProvider(rpc);

    // creating js Factory contract
    const factoryAddr = networkConfig[chainId].UniswapV3Factory;
    if (factoryAddr == null) {
        throw new TypeError(
            "Invalid UniswapV3Factory address, check your helper-hardhat-config file."
        );
    }
    const factoryContract = new ethers.Contract(factoryAddr, IUniswapV3FactoryABI, provider);

    // getting pool assets addresses and pool fees from helper config
    const assetsList = networkConfig[chainId].assetsList;
    const fees = networkConfig[chainId].uniswapFees;
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
                    const poolObject = new UniswapV3Pool(poolAddr, id, log);
                    await poolObject.fetchPoolImmutables(provider);
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

module.exports = {
    createUniswapPools,
};
