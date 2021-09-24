import hre from 'hardhat';

import { deployErc20Template } from '../src';

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const token = await deployErc20Template(
    {
      name: 'ABC',
      symbol: 'ABC',
      decimals: 8,
    },
    deployer
  );

  await token.mint(deployer.address, '3500000000');

  console.log(hre.ethers.utils.formatUnits(await token.balanceOf(deployer.address), 'wei'));
}

main().then();
