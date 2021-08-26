import { BigNumberish, Contract, ContractFactory, Signer } from 'ethers';

import { abi, bytecode } from '../artifacts/contracts/ERC20Template.sol/ERC20Template.json';

export class Erc20Token {
  public name: string;
  public symbol: string;
  public decimals: number;
  public declare address: string;
  public declare contract: Contract;

  constructor(name: string, symbol: string, decimals: number) {
    this.name = name;
    this.symbol = symbol;
    this.decimals = decimals;
  }

  public async mint(to: string, amount: BigNumberish) {
    await this.contract.functions.mint(to, amount);
  }

  public async approve(to: string, amount: BigNumberish) {
    await this.contract.functions.approve(to, amount);
  }

  public static async connect(address: string, signer: Signer): Promise<Erc20Token> {
    const contract = new ContractFactory(abi, bytecode, signer).attach(address);
    const name = await contract.functions.name();
    const symbolc = await contract.functions.symbol();
    const decimals = await contract.functions.decimals();
    const token = new Erc20Token(name, symbolc, decimals);
    token.address = address;
    token.contract = contract;
    return token;
  }

  public static async deploy(instance: Erc20Token, signer: Signer): Promise<Erc20Token> {
    const factory = new ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(instance.name, instance.symbol, instance.decimals);
    instance.contract = await contract.deployed();
    instance.address = contract.address;
    return instance;
  }
}
