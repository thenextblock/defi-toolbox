import '@nomiclabs/hardhat-ethers';
import '@typechain/hardhat';

module.exports = {
  typechain: {
    target: 'ethers-v5',
    externalArtifacts: [
      '../../node_modules/@uniswap/v3-core/artifacts/**/*.json',
      '../../node_modules/@uniswap/v3-periphery/artifacts/**/*.json',
    ],
  },
  solidity: {
    compilers: [
      {
        version: '0.7.3',
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
