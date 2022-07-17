require("dotenv").config();

require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");

task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const account of accounts) {
        console.log(account.address);
    }
});

const PRIVATE_KEY = process.env.PRIVATE_KEY || "";
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || "";
const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "";
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "";
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || "";
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || "";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";
const REPORT_GAS = true;

const AAVE_SETTING = {
    version: "0.8.10",
};
const UNISWAP_SETTING = {
    version: "0.7.6",
};

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
    defaultNetwork: "hardhat",

    networks: {
        hardhat: {
            forking: {
                url: POLYGON_RPC_URL,
                blockNumber: 15069094,
            },
            // accounts: [PRIVATE_KEY],
            chainId: 137,
            blockConfirmation: 1,
        },
        localhost: {
            url: "http://127.0.0.1:8545/",
        },
        polygon: {
            url: POLYGON_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 137,
            blockConfirmation: 6,
        },
        /*goerli: {
            url: GOERLI_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 5,
            blockConfirmation: 6,
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: [PRIVATE_KEY],
            chainId: 4,
            blockConfirmation: 6,
        },*/
    },

    solidity: {
        compilers: [AAVE_SETTING, UNISWAP_SETTING],
    },

    gasReporter: {
        enabled: REPORT_GAS,
        currency: "USD",
        outputFile: "gas-report.txt",
        noColors: true,
    },

    etherscan: {
        apiKey: ETHERSCAN_API_KEY,
    },

    namedAccounts: {
        deployer: {
            default: 0,
        },
        caller: {
            default: 1,
        },
    },
};
