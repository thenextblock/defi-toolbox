import hre from 'hardhat';
import { UniswapV3Deployment } from '../lib/uniswap-v3-deployment';
import { TokenTemplate, WETH9 } from '../types';
import {
  ADD_UNISWAP_POOL_LIQUIDITY,
  CREATE_UNISWAP_POOL,
  DEPLOY_ERC20,
  DEPLOY_UNISWAP,
  DEPLOY_WETH,
} from '../tasks';

async function main() {
  const weth: WETH9 = await hre.run(DEPLOY_WETH);

  const uniswapV3: UniswapV3Deployment = await hre.run(DEPLOY_UNISWAP, {
    weth: weth.address,
  });

  const tokenA: TokenTemplate = await hre.run(DEPLOY_ERC20, {
    symbol: 'AAA',
    name: 'Token A',
    decimals: '18',
  });
  const tokenB: TokenTemplate = await hre.run(DEPLOY_ERC20, {
    symbol: 'BBB',
    name: 'Token B',
    decimals: '18',
  });

  await hre.run(CREATE_UNISWAP_POOL, {
    contract: uniswapV3.nonfungiblePositionManager.address,
    token0: tokenA.address,
    token1: tokenB.address,
    amount0: (500).toString(),
    amount1: (100).toString(),
  });

  await hre.run(ADD_UNISWAP_POOL_LIQUIDITY, {
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
