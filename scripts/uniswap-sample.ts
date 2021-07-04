import hre from 'hardhat';
import { UniswapV3Deployment } from '../lib/uniswap-v3-deployment';
import { TokenTemplate, WETH9 } from '../types';

async function main() {
  const weth: WETH9 = await hre.run('weth:deploy');

  const uniswapV3: UniswapV3Deployment = await hre.run('uniswap:deploy', {
    weth: weth.address,
  });

  const tokenA: TokenTemplate = await hre.run('erc20:deploy', {
    symbol: 'AAA',
    name: 'Token A',
    decimals: '18',
  });
  const tokenB: TokenTemplate = await hre.run('erc20:deploy', {
    symbol: 'BBB',
    name: 'Token B',
    decimals: '18',
  });

  await hre.run('uniswap:create-pool', {
    contract: uniswapV3.nonfungiblePositionManager.address,
    token0: tokenA.address,
    token1: tokenB.address,
    amount0: (500).toString(),
    amount1: (100).toString(),
  });

  await hre.run('uniswap:add-liquidity', {
    contract: uniswapV3.nonfungiblePositionManager.address,
    token0: tokenA.address,
    token1: tokenB.address,
    amount0: (500).toString(),
    amount1: (100).toString(),
    amount0min: (490).toString(),
    amount1min: (60).toString(),
    deadline: '5',
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
