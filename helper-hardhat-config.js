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
        // uniswap
        UniswapV3SwapRouter: "0xE592427A0AEce92De3Edee1F18E0157C05861564",
        UniswapV3Factory: "0x1F98431c8aD98523631AE4a59f267346ea31F984",
        uniswapFees: ["100", "3000"], // 0.01, 0.3 %
        // sushiswap
        UniswapV2Router02: "0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506",
        // aave addresses
        AaveV3PoolAddressesProvider: "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb",
        AaveV3Pool: "0x794a61358D6845594F94dc1DB02A252b5b4814aD",
        // assets addresses
        assetsList: [
            /*
            "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063", // DAI
            "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT
            "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // WMATIC
            "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
            */
            "0x1BFD67037B42Cf73acF2047067bd4F2C47D9BfD6", // WBTC
            "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // WETH
        ],
    },
};

// in alphabetical order
// const assetsList = ["DAI", "USDC", "USDT", "WBTC", "WETH", "WMATIC"];

const developmentChains = ["hardhat", "localhost"];

const VERIFICATION_BLOCK_CONFIRMATIONS = 6;

// for mock tokens
const INITIAL_SUPPLY = "1000000000000000000000000"; // 1M tokens
const ROUTER_BALANCE = "250000000000000000000000"; // 250k tokens
const TOKEN_IN_FOR_ONE_TOKEN_OUT = "1723943";

module.exports = {
    networkConfig,
    // assetsList,
    developmentChains,
    VERIFICATION_BLOCK_CONFIRMATIONS,
    TOKEN_IN_FOR_ONE_TOKEN_OUT,
    INITIAL_SUPPLY,
    ROUTER_BALANCE,
};
