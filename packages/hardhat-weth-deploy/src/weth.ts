import { Contract, ContractFactory, Signer } from 'ethers';

import { abi, bytecode } from '../artifacts/contracts/WETH.sol/WETH9.json';

export class Weth {
  public readonly name: string = 'Wrapped Ether';
  public readonly symbol: string = 'WETH';
  public readonly decimals: number = 18;
  public declare contract: Contract;

  constructor() {}

  public static async attach(address: string, signer: Signer): Promise<Weth> {
    const contract = new ContractFactory(abi, bytecode, signer).attach(address);
    const token = new Weth();
    token.contract = contract;
    return token;
  }

  public static async deploy(instance: Weth, signer: Signer): Promise<Weth> {
    const factory = new ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy();
    instance.contract = await contract.deployed();
    return instance;
  }
}
