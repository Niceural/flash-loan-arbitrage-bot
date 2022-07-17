const { ArbitrageGraph } = require("./ArbitrageGraph");

class ExchangesNode {
    constructor(numOfExchanges) {
        this.__prices = new Array(numOfExchanges);
    }

    [Symbol.iterator]() {
        let counter = 0;

        const iterator = {
            next() {
                counter++;
                if (counter <= this.__prices.length) {
                    return { value: this.__prices[counter - 1], done: false };
                }
                return { value: undefined, done: true };
            }
        };
   return iterator;
    }
}

module.exports = class AdjacencyMatrix extends ArbitrageGraph {
    constructor(numOfAssets, numOfExchanges) {
        super();
        this.__numOfAssets = numOfAssets;
        this.__numOfExchanges = numOfExchanges;
        this.__matrix = new Array(numOfAssets * numOfAssets);
    }

    __2Dto1DIndex(row, col) {
        return row * this.__numOfAssets + col;
    }
};
