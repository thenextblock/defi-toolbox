import { task } from 'hardhat/config';
import { WETH9__factory } from '../types';

task('weth:deploy', 'Deploy WETH9', async (args, hre) => {
  const instance = new WETH9__factory((await hre.ethers.getSigners())[0]);
  const contract = await instance.deploy();
  console.log(`WETH9: ${contract.address}`);
  return contract;
});
