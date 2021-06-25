import hre, { ethers } from 'hardhat';
import { getDeployer } from '../lib/common';
import { WETH9__factory, TokenTemplate__factory } from '../types';
import { UniswapV3Deployment } from '../lib/uniswap-v3-deployment';

async function main() {
  const deployer = await getDeployer();
  const address = await deployer.getAddress();

  console.log('Deploy WETH');
  const WETH = new WETH9__factory(deployer);
  const weth = await WETH.deploy();
  console.log(weth.address + '\n');

  console.log('Create Sample ER20 Token');
  const USDC = new TokenTemplate__factory(deployer);
  const usdc = await USDC.deploy('USDC', 'USDC');
  await usdc.mint(address, (1e1).toString());
  console.log(address, ethers.utils.formatUnits(await usdc.balanceOf(address), 'ether'));

  const uniswap = new UniswapV3Deployment(deployer, weth);
  await uniswap.deployAll();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
