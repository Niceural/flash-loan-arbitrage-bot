const networkConfig = {
    31337: {
        name: "localhost",
    },
    4: {
        name: "rinkeby",
        addressUniswapV3SwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        addressUniswapV2Router02: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
    },
    1: {
        name: "mainnet",
        addressUniswapV3SwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        addressUniswapV2Router02: "0xd9e1cE17f2641f24aE83637ab66a2cca9C378B9F",
    },
    137: {
        name: "polygon",
        // Uniswap V3
        UniswapV3SwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        UniswapV3Factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
        uniswapV3Fees: ["100", "3000"], // 0.01, 0.3 %
        // sushiswap
        UniswapV2Router02: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        // aave addresses
        AaveV3PoolAddressesProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
        AaveV3Pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        // assets addresses, https://docs.aave.com/developers/deployed-contracts/v3-mainnet/polygon, same for AAVE V2 and V3
        idToAssetAddress: [
            "0xD6DF932A45C0f255f85145f286eA0b292B21C90B", // AAVE
            "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // DAI
            "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT
            "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39", // LINK
            "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
            "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
            "0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4", // agEUR
            "0xE111178A87A3BFf0c8d18DECBa5798827539Ae99", // EURS
            "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // WBTC
            "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // WETH
            "0x172370d5Cd63279eFa6d502DAB29171933a610AF", // CRV
            "0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a", // SUSHI
            "0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7", // GHST
            "0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c", // jEUR
            "0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369", // DPI
            "0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3", // BAL
        ],
        assetAddressToId: new Map([
            ["0xD6DF932A45C0f255f85145f286eA0b292B21C90B", 0], // AAVE
            ["0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", 1], // DAI
            ["0xc2132D05D31c914a87C6611C10748AEb04B58e8F", 2], // USDT
            ["0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39", 3], // LINK
            ["0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", 4], // WMATIC
            ["0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", 5], // USDC
            ["0xE0B52e49357Fd4DAf2c15e02058DCE6BC0057db4", 6], // agEUR
            ["0xE111178A87A3BFf0c8d18DECBa5798827539Ae99", 7], // EURS
            ["0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", 8], // WBTC
            ["0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", 9], // WETH
            ["0x172370d5Cd63279eFa6d502DAB29171933a610AF", 10], // CRV
            ["0x0b3F868E0BE5597D5DB7fEB59E1CADBb0fdDa50a", 11], // SUSHI
            ["0x385Eeac5cB85A38A9a07A70c73e0a3271CfB54A7", 12], // GHST
            ["0x4e3Decbb3645551B8A19f0eA1678079FCB33fB4c", 13], // jEUR
            ["0x85955046DF4668e1DD369D2DE9f3AEB98DD2A369", 14], // DPI
            ["0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3", 15], // BAL
        ]),
    },
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
    networkConfig,
    developmentChains,
};
