module.exports = class IUniswapV3PairPool {
    constructor() {
        if (this.constructor === IUniswapV3PairPool) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    async fetchImmutables() {
        throw new Error("Method 'fetchImmutables()' must be implemented.");
    }

    async fetchState() {
        throw new Error("Method 'fetchState()' must be implemented.");
    }

    getEdgeArbitrage() {
        throw new Error("Method 'getEdgeArbitrage()' must be implemented.");
    }
};
