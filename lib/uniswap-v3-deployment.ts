import { ethers } from 'hardhat';
import { Signer } from 'ethers';
import {
  NFTDescriptor__factory,
  NonfungiblePositionManager__factory,
  ProxyAdmin__factory,
  Quoter,
  Quoter__factory,
  SwapRouter__factory,
  ProxyAdmin,
  TickLens__factory,
  UniswapV3Factory,
  UniswapV3Factory__factory,
  TickLens,
  NFTDescriptor,
  NonfungibleTokenPositionDescriptor,
  WETH9,
  SwapRouter,
  NonfungiblePositionManager,
} from '../types';

export class UniswapV3Deployment {
  public readonly deployer: Signer;
  public readonly weth: WETH9;
  public uniswapV3Factory?: UniswapV3Factory;
  public proxyAdmin?: ProxyAdmin;
  public tikLens?: TickLens;
  public quoter?: Quoter;
  public swapRouter?: SwapRouter;
  public nftDescriptor?: NFTDescriptor;
  public nonfungibleTokenPositionDescriptor?: NonfungibleTokenPositionDescriptor;
  public nonfungiblePositionManager?: NonfungiblePositionManager;

  constructor(deployer: Signer, weth: WETH9) {
    this.deployer = deployer;
    this.weth = weth;
  }

  async deployUniswapV3Factory() {
    const UniswapFactory = new UniswapV3Factory__factory(this.deployer);
    this.uniswapV3Factory = await UniswapFactory.deploy();
    return this.uniswapV3Factory;
  }

  async deployProxyAdmin() {
    const contract = new ProxyAdmin__factory(this.deployer);
    this.proxyAdmin = await contract.deploy();
    return this.proxyAdmin;
  }

  async deployTikLens() {
    const contract = new TickLens__factory(this.deployer);
    this.tikLens = await contract.deploy();
    return this.tikLens;
  }

  async deployQuoter() {
    if (this.uniswapV3Factory == null) {
      throw 'UniswapV3Factory is not deployed';
    }
    const contract = new Quoter__factory(this.deployer);
    this.quoter = await contract.deploy(this.weth.address, this.uniswapV3Factory.address!);
    return this.quoter;
  }

  async deploySwapRouter() {
    if (!this.uniswapV3Factory) {
      throw 'UniswapV3Factory is not deployed.';
    }
    const contract = new SwapRouter__factory(this.deployer);
    this.swapRouter = await contract.deploy(this.uniswapV3Factory.address, this.weth.address);
    return this.swapRouter;
  }

  async deployNFTDescriptor() {
    if (this.uniswapV3Factory == null) {
      throw 'UniswapV3Factory is not deployed.';
    }
    const contract = new NFTDescriptor__factory(this.deployer);
    this.nftDescriptor = await contract.deploy();
    return this.nftDescriptor;
  }

  async deployNonfungibleTokenPositionDescriptor() {
    if (!this.nftDescriptor) {
      throw 'NFTDescriptor is not deployed.';
    }
    const contract = await ethers.getContractFactory('NonfungibleTokenPositionDescriptor', {
      libraries: {
        NFTDescriptor: this.nftDescriptor?.address!,
      },
    });
    this.nonfungibleTokenPositionDescriptor = (await contract.deploy(
      this.weth.address
    )) as NonfungibleTokenPositionDescriptor;
    return this.nonfungibleTokenPositionDescriptor;
  }

  async deployNonfungiblePositionManager() {
    if (this.uniswapV3Factory == null) {
      throw 'UniswapV3Factory is not deployed.';
    }
    if (!this.nonfungibleTokenPositionDescriptor) {
      throw 'NonfungibleTokenPositionDescriptor is not deployed.';
    }
    const contract = new NonfungiblePositionManager__factory(this.deployer);
    this.nonfungiblePositionManager = await contract.deploy(
      this.uniswapV3Factory.address,
      this.weth.address,
      this.nonfungibleTokenPositionDescriptor.address
    );
    return this.nonfungiblePositionManager;
  }

  async createPool(token0: string, token1: string, fee: number) {
    if (!this.uniswapV3Factory) {
      throw 'UniswapV3Factory is not deployed';
    }
    return await this.uniswapV3Factory.createPool(token0, token1, fee);
  }

  async deployAll() {
    await this.deployUniswapV3Factory();
    await this.deployProxyAdmin();
    await this.deployTikLens();
    await this.deployQuoter();
    await this.deploySwapRouter();
    await this.deployNFTDescriptor();
    await this.deployNonfungibleTokenPositionDescriptor();
    await this.deployNonfungiblePositionManager();
  }
}
