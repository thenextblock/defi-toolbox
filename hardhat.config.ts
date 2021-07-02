import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';
import '@tenderly/hardhat-tenderly';
import 'hardhat-tracer';
import dotenv from 'dotenv';
import './tasks/accounts';
import './tasks/weth-deploy';
import './tasks/uniswap-deploy';
import './tasks/uniswap-create-pool';

dotenv.config();
const JSON_RPC_URL = process.env.JSON_RPC_URL;
const DEFAULT_BLOCK_GAS_LIMIT = 12450000;
const DEFAULT_GAS_MUL = 5;
const BUIDLEREVM_CHAINID = 31337;

module.exports = {
  allowUnlimitedContractSize : true,
  tenderly: {
    project: process.env.TENDERLY_PROJECT,
    username: process.env.TENDERLY_USERNAME,
  },
  defaultNetwork: 'hardhat',
  networks: {
    // local: {
    //   hardfork: 'berlin',
    //   url: 'http://127.0.0.1:8545',
    //   blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
    //   gas: 'auto',
    //   gasPrice: 'auto',
    //   gasMultiplier: 5,
    //   // chainId: BUIDLEREVM_CHAINID,
    // },
    hardhat: {
      hardfork: 'berlin',
      // blockGasLimit: DEFAULT_BLOCK_GAS_LIMIT,
      // gas: 'auto',
      // gasPrice: 8000000000,
      // chainId: 1,
      throwOnTransactionFailures: true,
      throwOnCallFailures: true,
      allowUnlimitedContractSize: true,
      // forking: {
      //   url: JSON_RPC_URL,
      // },
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
        version: '0.6.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.3',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.5',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.7.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.4.18',
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
