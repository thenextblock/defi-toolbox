import { task } from 'hardhat/config';

import { Weth } from './weth';

export const WETH_DEPLOY = 'weth:deploy';

task(WETH_DEPLOY, 'Deploy WETH9', async (args, hre) => {
  const [deployer] = await hre.ethers.getSigners();
  const weth = new Weth();
  await Weth.deploy(weth, deployer);
  console.log(`WETH9: ${weth.contract!.address}`);
  return weth;
});
