import { Signer } from 'ethers';

import { WETH9, WETH9__factory } from '../typechain';

export async function deployWeth9(deployer: Signer): Promise<WETH9> {
  const contract = await new WETH9__factory(deployer).deploy();
  return contract.deployed();
}
