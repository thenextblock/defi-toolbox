import { task } from 'hardhat/config';
import { TokenTemplate__factory } from '../types';
import { DEPLOY_ERC20, MINT_ERC20 } from './index';

task(DEPLOY_ERC20, 'Creates ERC20 Token')
  .addParam('name', 'token name')
  .addParam('symbol', 'token symbol')
  .addParam('decimals', 'decimals')
  .setAction(async (taskArgs, hre) => {
    // console.log(` Create ERC20 Token
    //     Name :  ${taskArgs.name}
    //     Symbol : ${taskArgs.symbol}
    //     Decimals : ${taskArgs.decimals}
    // `);
    const deployer = (await hre.ethers.getSigners())[0];
    const TokenTemplateFactory = new TokenTemplate__factory(deployer);
    const token = await TokenTemplateFactory.deploy(
      taskArgs.name,
      taskArgs.symbol,
      taskArgs.decimals
    );
    await token.setDecimals(taskArgs.decimals);

    console.log(
      `ERC20 Token : ', ${taskArgs.name} - ${taskArgs.symbol} Deployed at  ${token.address}`
    );

    return token;
  });

task(MINT_ERC20, 'Mint ERC20 tokens to address')
  .addParam('contract', 'token address')
  .addParam('receiver', 'receiver address')
  .addParam('amount', 'token amount')
  .setAction(async (taskArgs, hre) => {
    const [deployer] = await hre.ethers.getSigners();
    const token = TokenTemplate__factory.connect(taskArgs.contract, deployer);
    await token.mint(taskArgs.receiver, taskArgs.amount);

    console.log(`Mint ${taskArgs.amount} ${await token.symbol()} tokens for ${taskArgs.receiver}`);
  });
