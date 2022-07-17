module.exports = class ArbitrageGraph {
    constructor(numOfAssets, numOfExchanges) {
        if (this.constructor == Graph) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }
};
