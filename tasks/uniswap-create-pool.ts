import { task } from 'hardhat/config';
import '@nomiclabs/hardhat-ethers/internal/type-extensions';
import { NonfungiblePositionManager__factory, UniswapV3Factory__factory } from '../types';
import { TickMath } from '@uniswap/v3-sdk';

task('uniswap:create-pool', 'Create Uniswap V3 pool')
  .addParam('contract', 'NonfungiblePositionManager address')
  .addParam('token0', 'ERC2-20 token address')
  .addParam('token1', 'ERC2-20 token address')
  .addParam('fee', '(300|500|3000)')
  .addParam('price', 'token1/token0')
  .setAction(async (args, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const nonfungiblePositionManager = await NonfungiblePositionManager__factory.connect(
      args.contract,
      deployer
    );
    await nonfungiblePositionManager.createAndInitializePoolIfNecessary(
      args.token0,
      args.token1,
      args.fee,
      TickMath.getSqrtRatioAtTick(parseFloat(args.price)).toString()
    );
    const uniswapV3Factory = await UniswapV3Factory__factory.connect(
      await nonfungiblePositionManager.factory(),
      deployer
    );

    return await uniswapV3Factory!.getPool(args.token0, args.token1, args.fee);
  });
