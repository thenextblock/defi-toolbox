import { task } from 'hardhat/config';
import { GET_ACCOUNTS } from './index';

task(GET_ACCOUNTS, 'Prints the list of accounts')
  .addOptionalParam('print', 'Print accounts', '1')
  .setAction(async (args, hre) => {
    const accounts = await hre.ethers.getSigners();
    if (args.print === '1') {
      for (const account of accounts) {
        console.log(account.address);
      }
    }
    return accounts;
  });
