function Edge(fromId, toId, exchangeId, price) {
    this.fromId = fromId;
    this.toId = toId;
    this.exchangeId = exchangeId;
    this.price = price;
}

function Path(assetId, exchangeId) {
    this.assetId = assetId;
    this.exchangeId = exchangeId;
}

class Arbitrage {
    constructor(numberOfAssets, numberOfExchanges, arrayOfEdges) {
        this.numberOfAssets = numberOfAssets;
        this.numberOfExchanges = numberOfExchanges;
        this.arrayOfEdges = arrayOfEdges;
    }

    bellmanFord() {
        const distances = {};
        const previousVertices = {};

        for (let i = 0; i < this.numberOfAssets; i++) {
            distances[i] = Infinity;
            previousVertices[i] = null;
        }
        distances[this.arrayOfEdges[0].fromId] = 0;

        // relaxes V-1 times
        for (let i = 0; i < this.numberOfAssets - 1; i++) {
            for (const edge of this.arrayOfEdges) {
                const newDist = distances[edge.fromId] + edge.weight;
                if (newDist < distances[edge.toId]) {
                    distances[edge.toId] = newDist;
                    previousVertices[edge.toId] = edge.fromId;
                }
            }
        }

        // if can still be relaxed then negative cycle
        let cycle = {};
        for (const edge of this.arrayOfEdges) {
            if (distances[edge.fromId] + edge.price < distances[edge.fromId]) {
            }
        }
    }
}
