import { task } from 'hardhat/config';
import { UniswapV3Deployment } from '../lib/uniswap-v3-deployment';

task('uniswap:deploy', 'Deploy Uniswap V3 contracts')
  .addOptionalParam('weth', 'WETH9 contract address')
  .setAction(async (taskArgs, hre) => {
    const deployer = (await hre.ethers.getSigners())[0];
    const weth = taskArgs.weth || (await hre.run('weth:deploy')).address;
    const uniswap = new UniswapV3Deployment(hre, deployer, weth);
    await uniswap.deployAll();
    return uniswap;
  });
