import hre from 'hardhat';
import { UniswapV3Deployment } from '../lib/uniswap-v3-deployment';
import { TokenTemplate, WETH9 } from '../types';
import {
  ADD_UNISWAP_POOL_LIQUIDITY,
  CREATE_UNISWAP_POOL,
  DEPLOY_ERC20,
  DEPLOY_UNISWAP,
  DEPLOY_WETH,
  GET_ACCOUNTS,
} from '../tasks';

async function main() {
  const [deployer] = await hre.run(GET_ACCOUNTS);

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

  await tokenA.mint(deployer.address, '50000000000000000000000000');
  await tokenB.mint(deployer.address, '30000000000000000000000000');

  await hre.run(CREATE_UNISWAP_POOL, {
    contract: uniswapV3.nonfungiblePositionManager.address,
    token0: tokenA.address,
    token1: tokenB.address,
    amount0: '10000000000000000000000',
    amount1: '200000000000000000000',
  });

  await hre.run(ADD_UNISWAP_POOL_LIQUIDITY, {
    contract: uniswapV3.nonfungiblePositionManager.address,
    token0: tokenA.address,
    token1: tokenB.address,
    amount0: '10000000000000000000000',
    amount1: '200000000000000000000',
    amount0min: '9000000000000000000000',
    amount1min: '180000000000000000000',
    deadline: '5',
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
