import hre, { ethers } from 'hardhat';
import { Signer, Contract } from 'ethers';
import { assert } from 'chai';

describe.skip('DefiToolBox', function () {
  let accounts: Signer[];

  const ONE = ethers.BigNumber.from('1000000000000000000');

  before(async function () {
    accounts = await ethers.getSigners();
  });

  it('Should Depoloy Contracts', async function () {
    assert(true);
  });
});
