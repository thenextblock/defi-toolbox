import hre from 'hardhat';
import { FeeAmount } from '@uniswap/v3-sdk';

import { deployWeth9 } from '@thenextblock/hardhat-weth';
import {
  ADD_UNISWAP_POOL_LIQUIDITY,
  CREATE_UNISWAP_POOL,
  DEPLOY_UNISWAP,
  SWAP_TOKENS_ON_UNISWAP,
  UniswapV3Deployment,
} from '@thenextblock/hardhat-uniswap-v3';
import { deployErc20Token } from '@thenextblock/hardhat-erc20';

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  const weth = await deployWeth9(deployer);

  const uniswapV3: UniswapV3Deployment = await hre.run(DEPLOY_UNISWAP, {
    weth: weth.address,
  });

  const tokenA = await deployErc20Token(
    {
      symbol: 'AAA',
      name: 'Token A',
      decimals: 18,
    },
    deployer
  );
  const tokenB = await deployErc20Token(
    {
      symbol: 'BBB',
      name: 'Token B',
      decimals: 18,
    },
    deployer
  );

  await tokenA.mint(deployer.address, BigInt(5e25));
  await tokenB.mint(deployer.address, BigInt(3e24));

  const poolAddress = await hre.run(CREATE_UNISWAP_POOL, {
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

  await hre.run(SWAP_TOKENS_ON_UNISWAP, {
    contract: uniswapV3.swapRouter!.address,
    token0: tokenA.address,
    token1: tokenB.address,
    fee: FeeAmount.MEDIUM.toString(),
    amount: BigInt(5e20).toString(),
    poolAddress: poolAddress,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
