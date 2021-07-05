import { task } from 'hardhat/config';
import { UniswapV3Deployment } from '../lib/uniswap-v3-deployment';
import {
  NonfungiblePositionManager__factory,
  TokenTemplate__factory,
  UniswapV3Factory__factory,
} from '../types';
import {
  encodeSqrtRatioX96,
  FeeAmount,
  nearestUsableTick,
  TICK_SPACINGS,
  TickMath,
} from '@uniswap/v3-sdk';
import {
  ADD_UNISWAP_POOL_LIQUIDITY,
  CREATE_UNISWAP_POOL,
  DEPLOY_UNISWAP,
  DEPLOY_WETH,
} from './index';

task(DEPLOY_UNISWAP, 'Deploy Uniswap V3 contracts')
  .addOptionalParam('weth', 'WETH9 contract address')
  .setAction(async (taskArgs, hre) => {
    const deployer = (await hre.ethers.getSigners())[0];
    const weth = taskArgs.weth || (await hre.run(DEPLOY_WETH)).address;
    const uniswap = new UniswapV3Deployment(hre, deployer, weth);
    await uniswap.deployAll();
    return uniswap;
  });

task(CREATE_UNISWAP_POOL, 'Create Uniswap V3 pool')
  .addParam('contract', 'NonfungiblePositionManager address')
  .addParam('token0', 'ERC2-20 token address')
  .addParam('token1', 'ERC2-20 token address')
  .addOptionalParam('fee', '(500|3000|10000)', FeeAmount.MEDIUM.toString())
  .addParam('amount0')
  .addParam('amount1')
  .setAction(async (args, hre) => {
    const fee: FeeAmount = args.fee;
    const ratio = encodeSqrtRatioX96(args.amount1, args.amount0);

    const [deployer] = await hre.ethers.getSigners();
    const nfpManager = await NonfungiblePositionManager__factory.connect(args.contract, deployer);

    console.log(nfpManager.address);
    const token0 = await TokenTemplate__factory.connect(args.token0, deployer);
    const token1 = await TokenTemplate__factory.connect(args.token1, deployer);
    const symbol0 = await token0.symbol();
    const symbol1 = await token1.symbol();

    console.log(`Create pool ${symbol0}/${symbol1}`);
    await nfpManager.createAndInitializePoolIfNecessary(
      args.token0,
      args.token1,
      fee,
      ratio.toString()
    );

    const factory = await UniswapV3Factory__factory.connect(await nfpManager.factory(), deployer);
    const poolAddress = await factory.getPool(args.token0, args.token1, fee);
    console.log(poolAddress + '\n');

    return poolAddress;
  });

task(ADD_UNISWAP_POOL_LIQUIDITY, 'Add liquidity to a pool')
  .addParam('contract', 'NonfungiblePositionManager address')
  .addParam('token0', 'ERC2-20 token address')
  .addParam('token1', 'ERC2-20 token address')
  .addOptionalParam('fee', '(500|3000|10000)', FeeAmount.MEDIUM.toString())
  .addParam('amount0')
  .addParam('amount1')
  .addParam('amount0min', 'Minimum expected amount.')
  .addParam('amount1min', 'Minimum expected amount.')
  .addOptionalParam('deadline', 'Minutes. 1 min by default', '1')
  .setAction(async (args, hre) => {
    const fee: FeeAmount = args.fee;
    const ratio = encodeSqrtRatioX96(args.amount1, args.amount0);
    const tick = TickMath.getTickAtSqrtRatio(ratio);
    const tickSpacing = TICK_SPACINGS[fee];
    const deadline = Math.ceil(Date.now() / 1000) + 60 * parseInt(args.deadline, 10);

    const [deployer] = await hre.ethers.getSigners();
    const nfpManager = await NonfungiblePositionManager__factory.connect(args.contract, deployer);
    console.log(`uniswap:add-liquidity > nfpManager: ${nfpManager.address}`);
    const token0 = await TokenTemplate__factory.connect(args.token0, deployer);
    const token1 = await TokenTemplate__factory.connect(args.token1, deployer);

    console.log('Approve spender to transfer money');
    await token0.approve(nfpManager.address, args.amount0);
    await token1.approve(nfpManager.address, args.amount1);

    console.log('Add liquidity');
    const mintParams = {
      token0: args.token0,
      token1: args.token1,
      fee: fee,
      tickLower: nearestUsableTick(tick, tickSpacing) - tickSpacing,
      tickUpper: nearestUsableTick(tick, tickSpacing) + tickSpacing,
      amount0Desired: args.amount0,
      amount1Desired: args.amount1,
      amount0Min: args.amount0min,
      amount1Min: args.amount1min,
      recipient: deployer.address,
      deadline: deadline,
    };
    console.log('params:', mintParams);
    return await nfpManager.mint(mintParams);
  });
