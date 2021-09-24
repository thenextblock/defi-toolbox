import { task } from 'hardhat/config';

import { Erc20Token__factory } from '../typechain';

import { deployErc20Template } from './functions';

export const ERC20_DEPLOY = 'erc20:deploy';
export const ERC20_MINT = 'erc20:mint';

task(ERC20_DEPLOY, 'Deploy ERC20 token')
  .addParam('name', 'token name')
  .addParam('symbol', 'token symbol')
  .addParam('decimals', 'decimals')
  .setAction(async (args, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const token = await deployErc20Template(args, deployer);
    console.log(`Address: ${token.address} Symbol: ${token.symbol} Name: ${token.name} `);
    return token;
  });

task(ERC20_MINT, 'Mint tokens')
  .addParam('contract', 'contract address')
  .addParam('account', 'account address')
  .addParam('amount', 'token amount')
  .setAction(async (args, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const token = await Erc20Token__factory.connect(args.contract, deployer);
    await token.mint(args.account, args.amount);
    console.log(`Mint ${args.amount} ${token.symbol} for ${args.account}`);
  });
