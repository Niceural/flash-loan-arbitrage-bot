const { abi: IUniswapV2PairABI } = require("@uniswap/v2-core/build/IUniswapV2Pair.json");
const { abi: IUniswapV2FactoryABI } = require("@uniswap/v2-core/build/IUniswapV2Factory.json");
const { network, ethers } = require("hardhat");
const { networkConfig } = require("../../helper-hardhat-config");

class UniswapV2Pair {
    constructor(pairAddr, id, log) {
        if (pairAddr == null) throw new TypeError("Expected pair address but got zero address.");
        this.__pairAddr = pairAddr;
        this.__id = id;
        this.log = log;
    }

    // =============================================================
    //                                               pair immutables
    // =============================================================
    async fetchPairImmutables(provider) {
        if (provider == null) {
            throw new TypeError("Provider is undefiner.");
        }

        this.__pairContract = new ethers.Contract(this.__pairAddr, IUniswapV2PairABI, provider);

        [this.__factoryAddr, this.__token0Addr, this.__token1Addr] = await Promise.all([
            this.__pairContract.factory(),
            this.__pairContract.token0(),
            this.__pairContract.token1(),
        ]);

        if (this.log) {
            this.printPairImmutables();
        }
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

    printPairImmutables() {
        console.log(`Printing pair immutables of pair ${this.__id}:`);
        console.log("   Factory: ", this.__factoryAddr);
        console.log("   Pool: ", this.__poolAddr);
        console.log("   Token 0: ", this.__token0Addr);
        console.log(`   Token 1: ${this.__token1Addr}.\n`);
    }

    // =============================================================
    //                                                    pair state
    // =============================================================
    async fetchPairState() {
        const [reserve, price0CumulativeLast, price1CumulativeLast, klast] = await Promise.all([
            this.__poolContract.getReserves(),
            this.__poolContract.price0CumulativeLast(),
            this.__poolContract.price1CumulativeLast(),
            this.__poolContract.klast(),
        ]);

        this.__pairState = {
            reserve0: reserve[0],
            reserve1: reserve[1],
            blockTimestampLast: reserve[2],
            price0CumulativeLast: price0CumulativeLast,
            price1CumulativeLast: price1CumulativeLast,
            klast: klast,
        };

        if (this.log) {
            this.printPairState();
        }
    }

    reserve0() {
        return this.__pairState.reserve0;
    }

    reserve1() {
        return this.__pairState.reserve1;
    }

    blockTimestampLast() {
        return this.__pairState.blockTimestampLast;
    }

    price0CumulativeLast() {
        return this.__pairState.price0CumulativeLast;
    }

    price1CumulativeLast() {
        return this.__pairState.price1CumulativeLast;
    }

    klast() {
        return this.__pairState.klast;
    }

    printPairState() {
        console.log(`Printing pair state of pair ${this.__id}:`);
        console.log("   Reserve0: ", this.__pairState.reserve0);
        console.log("   Reserve1: ", this.__pairState.reserve1);
        console.log("   BlockTimestampLast: ", this.__pairState.blockTimestampLast);
        console.log("   Price0CumulativeLast: ", this.__pairState.price0CumulativeLast);
        console.log("   Price1CumulativeLast: ", this.__pairState.price1CumulativeLast);
        console.log(`   klast: ${this.__pairState.klast}.\n`);
    }
}

async function createSushiPairs(log) {
    console.log("Creating js sushiswap pairs...");
}
