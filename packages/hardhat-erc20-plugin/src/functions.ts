import { Signer } from 'ethers';

import { Erc20Token, Erc20Token__factory } from '../typechain';

export async function deployErc20Template(
  args: { name: string; symbol: string; decimals: number },
  deployer: Signer
): Promise<Erc20Token> {
  const contract = await new Erc20Token__factory(deployer).deploy(
    args.name,
    args.symbol,
    args.decimals
  );
  return contract.deployed();
}
