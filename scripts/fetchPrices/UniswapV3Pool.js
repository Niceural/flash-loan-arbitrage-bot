const {
    abi: IUniswapV3PoolABI,
} = require("@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json");
const { ethers } = require("hardhat");
const { IUniswapPairPool } = require("./IUniswapPairPool");

module.exports = class UniswapV3Pool extends IUniswapPairPool {
    constructor(poolAddr, provider, id, exchangeId, log) {
        super();
        if (poolAddr == null || poolAddr === ethers.constants.AddressZero)
            throw new Error("Invalid Pool address");
        if (provider == null) throw new Error("Invalid provider");
        this.__poolContract = new ethers.Contract(poolAddr, IUniswapV3PoolABI, provider);
        this.__id = id;
        this.__exchangeId = exchangeId;
        this.__log = log;
    }

    // =============================================================
    //                                               pool immutables
    // =============================================================
    async fetchImmutables() {
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
        if (this.__log) this.printPoolImmutables();
    }

    factoryAddr() {
        return this.__factoryAddr;
    }

    poolAddr() {
        return this.__poolContract.address;
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
        console.log("   Pool: ", this.__poolContract.address);
        console.log("   Token 0: ", this.__token0Addr);
        console.log("   Token 1: ", this.__token1Addr);
        console.log("   Fee: ", this.__fee);
        console.log("   Tick spacing: ", this.__tickSpacing);
        console.log(`   Max liquidity per tick: ${this.__maxLiquidityPerTick}.\n`);
    }

    // =============================================================
    //                                                    pool state
    // =============================================================
    async fetchState() {
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

    sqrtPriceX96() {
        return this.__poolState.sqrtPriceX96;
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

    getEdgeArbitrage(assetAddressToId) {
        const token0Id = assetAddressToId.get(this.__token0Addr);
        const token1Id = assetAddressToId.get(this.__token1Addr);
        let token0Token1Price = this.__poolState.sqrtPriceX96.mul(this.__poolState.sqrtPriceX96);
        token0Token1Price = token0Token1Price.div(ethers.BigNumber.from("2").pow(192));
        const token1Token0Price = token0Token1Price.pow(-1);

        return [
            {
                fromId: token0Id,
                toId: token1Id,
                exchangeId: this.__exchangeId,
                price: token0Token1Price,
            },
            {
                fromId: token1Id,
                toId: token0Id,
                exchangeId: this.__exchangeId,
                price: token1Token0Price,
            },
        ];
    }
};
