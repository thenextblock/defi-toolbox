import { task } from 'hardhat/config';

import { Erc20Token } from './Erc20Token';

export const ERC20_DEPLOY = 'erc20:deploy';
export const ERC20_MINT = 'erc20:mint';

task(ERC20_DEPLOY, 'Creates ERC20 Token')
  .addParam('name', 'token name')
  .addParam('symbol', 'token symbol')
  .addParam('decimals', 'decimals')
  .setAction(async (args, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const token = await Erc20Token.deploy(
      new Erc20Token(args.name, args.symbol, args.decimals),
      deployer
    );
    console.log(`Address: ${token.address} Symbol: ${token.symbol} Name: ${token.name} `);
    return token;
  });

task(ERC20_MINT, 'Mint ERC20 tokens to address')
  .addParam('contract', 'contract address')
  .addParam('account', 'account address')
  .addParam('amount', 'token amount')
  .setAction(async (args, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const token = await Erc20Token.connect(args.contract, deployer);
    await token.contract!.functions.mint(args.account, args.amount);
    console.log(`Mint ${args.amount} ${token.symbol} for ${args.account}`);
  });
