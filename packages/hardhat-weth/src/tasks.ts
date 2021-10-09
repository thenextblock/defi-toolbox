import { task } from 'hardhat/config';

import { deployWeth } from './functions';

export const WETH_DEPLOY = 'weth:deploy';

task(WETH_DEPLOY, 'Deploy WETH9', async (args, hre) => {
  const [deployer] = await hre.ethers.getSigners();
  const weth = await deployWeth(deployer);
  console.log(`WETH9: ${weth.address}`);
  return weth;
});
