import hre, { ethers } from 'hardhat';
import { Signer, Contract } from 'ethers';
import { assert } from 'chai';

describe.skip('Flashbot', function () {
  let accounts: Signer[];

  const ONE = ethers.BigNumber.from('1000000000000000000');

  before(async function () {
    accounts = await ethers.getSigners();

    console.log('The Main balance : ', await accounts[0].getAddress());
    const mainBalance = await accounts[0].getBalance();
    console.log('-- ', mainBalance.div(ONE).toString());
  });

  it('Should Depoloy Contracts', async function () {
    assert(true);
  });
});
