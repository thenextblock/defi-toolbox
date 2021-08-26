import '@nomiclabs/hardhat-ethers';
import { Erc20Token } from '@thenextblock/hardhat-erc20-plugin';
import { CurrencyAmount, Percent, Token, TradeType } from '@uniswap/sdk-core';
import {
  encodeSqrtRatioX96,
  FeeAmount,
  nearestUsableTick,
  Pool,
  Route,
  SwapRouter,
  TickMath,
  TICK_SPACINGS,
  Trade,
} from '@uniswap/v3-sdk';
import { task } from 'hardhat/config';

import {
  IERC20Metadata__factory,
  NonfungiblePositionManager__factory,
  SwapRouter__factory,
  UniswapV3Factory__factory,
  UniswapV3Pool__factory,
} from '../types';

import { UniswapV3Deployment } from './uniswap-v3-deployment';

export const DEPLOY_UNISWAP = 'defi:uniswap:deploy';
export const CREATE_UNISWAP_POOL = 'defi:uniswap:create-pool';
export const ADD_UNISWAP_POOL_LIQUIDITY = 'defi:uniswap:add-liquidity';
export const SWAP_TOKENS_ON_UNISWAP = 'defi:uniswap:swap-tokens';

task(DEPLOY_UNISWAP, 'Deploy Uniswap V3 contracts')
  .addOptionalParam('weth', 'WETH9 contract address')
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const weth = taskArgs.weth;
    const uniswap = new UniswapV3Deployment(weth, deployer);
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
    const token0 = await Erc20Token.connect(args.token0, deployer);
    const token1 = await Erc20Token.connect(args.token1, deployer);
    const symbol0 = token0.symbol;
    const symbol1 = token1.symbol;

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
  .addParam('token0', 'ERC-20 token address')
  .addParam('token1', 'ERC-20 token address')
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
    const token0 = await Erc20Token.connect(args.token0, deployer);
    const token1 = await Erc20Token.connect(args.token1, deployer);

    console.log('Approve spender to transfer money');
    await token0.approve(nfpManager.address, args.amount0);
    await token1.approve(nfpManager.address, args.amount1);

    console.log('Add liquidity');
    const mintParams = {
      token0: args.token0,
      token1: args.token1,
      fee,
      tickLower: nearestUsableTick(tick, tickSpacing) - tickSpacing,
      tickUpper: nearestUsableTick(tick, tickSpacing) + tickSpacing,
      amount0Desired: args.amount0,
      amount1Desired: args.amount1,
      amount0Min: args.amount0min,
      amount1Min: args.amount1min,
      recipient: deployer.address,
      deadline,
    };
    console.log('params:', mintParams);
    return nfpManager.mint(mintParams);
  });

task(SWAP_TOKENS_ON_UNISWAP, 'Swap')
  .addOptionalParam('account', 'Account to use [0..19]. Deafult is 0', '0')
  .addOptionalParam('poolAddress', '[Deprecated]', '0x0')
  .addParam('contract', 'SwapRouter address')
  .addParam('token0', 'ERC-20 token address')
  .addParam('token1', 'ERC-20 token address')
  .addParam('fee', '(500|3000|10000)')
  .addOptionalParam('slippage', '0.1% by default', '0.1')
  .addParam('amount', 'amount In')
  .addOptionalParam('deadline', 'Minutes. 1 min by default', '1')
  .setAction(async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    const account = accounts[parseInt(args.account, 10)];
    const swapRouter = SwapRouter__factory.connect(args.contract, account);
    const token0 = IERC20Metadata__factory.connect(args.token0, account);
    const token1 = IERC20Metadata__factory.connect(args.token1, account);
    const tokenA = new Token(hre.network.config.chainId!, token0.address, await token0.decimals());
    const tokenB = new Token(hre.network.config.chainId!, token1.address, await token1.decimals());
    const fee: FeeAmount = feeNumberToFeeAmount(parseFloat(args.fee));
    const amount = args.amount;
    const slippage = new Percent(1, 1000);
    const deadline = Math.ceil(Date.now() / 1000) + 60 * parseInt(args.deadline, 10);
    const poolAddress =
      args.poolAddress === '0x0'
        ? Pool.getAddress(tokenA, tokenB, parseInt(args.fee, 10))
        : args.poolAddress;
    const pool = UniswapV3Pool__factory.connect(poolAddress, account);
    const slot0 = await pool.slot0();
    const { liquidityNet, liquidityGross } = await pool.ticks(slot0.tick);
    const poolAB = new Pool(
      tokenA,
      tokenB,
      fee,
      slot0.sqrtPriceX96.toString(),
      (await pool.liquidity()).toString(),
      slot0.tick,
      [
        {
          index: nearestUsableTick(slot0.tick, TICK_SPACINGS[fee]),
          liquidityNet: liquidityNet.toString(),
          liquidityGross: liquidityGross.toString(),
        },
      ]
    );
    const route = new Route([poolAB], tokenA, tokenB);
    const trade = await Trade.fromRoute(
      route,
      CurrencyAmount.fromRawAmount(tokenA, amount),
      TradeType.EXACT_INPUT
    );
    await token0.approve(swapRouter.address, amount);
    const { calldata } = SwapRouter.swapCallParameters(trade, {
      slippageTolerance: slippage,
      recipient: account.address,
      deadline,
    });
    await account.sendTransaction({
      from: account.address,
      to: swapRouter.address,
      data: calldata,
    });

    function feeNumberToFeeAmount(feeAmount: number): FeeAmount {
      if (feeAmount === FeeAmount.LOW) return FeeAmount.LOW;
      if (feeAmount === FeeAmount.MEDIUM) return FeeAmount.MEDIUM;
      return FeeAmount.HIGH;
    }
  });
