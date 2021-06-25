import { ethers } from 'hardhat';

export async function getDeployer() {
  const accounts = await ethers.getSigners();
  return accounts[0];
}
