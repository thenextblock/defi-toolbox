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

  await tokenA.mint(deployer.address, BigInt(5e25));
  await tokenB.mint(deployer.address, BigInt(3e24));

  await hre.run(CREATE_UNISWAP_POOL, {
    contract: uniswapV3.nonfungiblePositionManager.address,
    token0: tokenA.address,
    token1: tokenB.address,
    amount0: BigInt(1e22).toString(),
    amount1: BigInt(2e20).toString(),
  });

  await hre.run(ADD_UNISWAP_POOL_LIQUIDITY, {
    contract: uniswapV3.nonfungiblePositionManager.address,
    token0: tokenA.address,
    token1: tokenB.address,
    amount0: BigInt(1e22).toString(),
    amount1: BigInt(2e20).toString(),
    amount0min: BigInt(9.9e21).toString(),
    amount1min: BigInt(1.8e20).toString(),
    deadline: '5',
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
