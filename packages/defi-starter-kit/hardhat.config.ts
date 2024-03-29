import '@thenextblock/hardhat-uniswap-v3';
import '@thenextblock/hardhat-compound';
import '@thenextblock/hardhat-erc20';
import '@thenextblock/hardhat-weth';
import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import '@tenderly/hardhat-tenderly';
import 'hardhat-tracer';
import dotenv from 'dotenv';

dotenv.config();

const JSON_RPC_URL = process.env.JSON_RPC_URL;
const DEFAULT_BLOCK_GAS_LIMIT = 12450000;
const DEFAULT_GAS_MUL = 5;
const BUIDLEREVM_CHAINID = 31337;

module.exports = {
  allowUnlimitedContractSize: true,
  tenderly: {
    project: process.env.TENDERLY_PROJECT,
    username: process.env.TENDERLY_USERNAME,
  },
  defaultNetwork: 'hardhat',
  newPath: 'adss',
  networks: {
    local: {
      hardfork: 'berlin',
      url: 'http://127.0.0.1:8545',
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: 'auto',
      gasPrice: 'auto',
      gasMultiplier: 5,
      // chainId: BUIDLEREVM_CHAINID,
    },
    hardhat: {
      hardfork: 'berlin',
      blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      gas: 'auto',
      gasPrice: 8000000000,
      chainId: 1,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
    },
  },
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
  },
  mocha: {
    timeout: 600000,
  },
  solidity: {
    compilers: [
      {
        version: '0.7.16',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
};
