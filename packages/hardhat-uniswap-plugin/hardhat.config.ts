import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';

module.exports = {
  typechain: {
    outDir: 'types',
    target: 'ethers-v5',
    externalArtifacts: [
      '../../node_modules/@uniswap/v3-core/artifacts/**/*.json',
      '../../node_modules/@uniswap/v3-periphery/artifacts/**/*.json',
    ],
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
        version: '0.5.16',
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
