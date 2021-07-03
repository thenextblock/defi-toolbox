import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { Signer } from 'ethers';
import { NonfungiblePositionManager } from '../types';

export class CompoundV2Deplotyment {
  private readonly hre: HardhatRuntimeEnvironment;
  public readonly deployer: Signer;
  public readonly weth: string;

  constructor(hre: HardhatRuntimeEnvironment, deployer: Signer, weth: string) {
    this.hre = hre;
    this.deployer = deployer;
    this.weth = weth;
  }

  //   async deployUniswapV3Factory() {
  //     const UniswapFactory = new UniswapV3Factory__factory(this.deployer);
  //     this.uniswapV3Factory = await UniswapFactory.deploy();
  //     return this.uniswapV3Factory;
  //   }
  //   async deployAll() {
  //   }
}
