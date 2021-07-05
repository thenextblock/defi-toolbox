import { task } from 'hardhat/config';
import { GET_ACCOUNTS } from './index';

task(GET_ACCOUNTS, 'Prints the list of accounts', async (args, hre) => {
  const accounts = await hre.ethers.getSigners();
  for (const account of accounts) {
    console.log(account.address);
  }
  return accounts;
});
