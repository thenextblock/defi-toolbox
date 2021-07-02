import { HardhatRuntimeEnvironment } from 'hardhat/types';
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
  SwapRouter,
  NonfungiblePositionManager,
} from '../types';

export class UniswapV3Deployment {
  private readonly hre: HardhatRuntimeEnvironment;
  public readonly deployer: Signer;
  public readonly weth: string;
  public uniswapV3Factory?: UniswapV3Factory;
  public proxyAdmin?: ProxyAdmin;
  public tikLens?: TickLens;
  public quoter?: Quoter;
  public swapRouter?: SwapRouter;
  public nftDescriptor?: NFTDescriptor;
  public nonfungibleTokenPositionDescriptor?: NonfungibleTokenPositionDescriptor;
  public declare nonfungiblePositionManager: NonfungiblePositionManager;

  constructor(hre: HardhatRuntimeEnvironment, deployer: Signer, weth: string) {
    this.hre = hre;
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
    this.quoter = await contract.deploy(this.uniswapV3Factory.address, this.weth);
    return this.quoter;
  }

  async deploySwapRouter() {
    if (!this.uniswapV3Factory) {
      throw 'UniswapV3Factory is not deployed.';
    }
    const contract = new SwapRouter__factory(this.deployer);
    this.swapRouter = await contract.deploy(this.uniswapV3Factory.address, this.weth);
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
    const contract = await this.hre.ethers.getContractFactory(
      'NonfungibleTokenPositionDescriptor',
      {
        libraries: {
          NFTDescriptor: this.nftDescriptor.address,
        },
      }
    );
    this.nonfungibleTokenPositionDescriptor = (await contract.deploy(
      this.weth
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
      this.weth,
      this.nonfungibleTokenPositionDescriptor.address
    );
    return this.nonfungiblePositionManager;
  }

  async deployAll() {
    const factory = await this.deployUniswapV3Factory();
    console.log(`UniswapV3Factory: ${factory.address}`);

    const proxyAdmin = await this.deployProxyAdmin();
    console.log(`ProxyAdmin: ${proxyAdmin.address}`);

    const tikLens = await this.deployTikLens();
    console.log(`TikLens: ${tikLens.address}`);

    const quoter = await this.deployQuoter();
    console.log(`Quoter: ${quoter.address}`);

    const swapRouter = await this.deploySwapRouter();
    console.log(`SwapRouter: ${swapRouter.address}`);

    const nftDescriptor = await this.deployNFTDescriptor();
    console.log(`NFTDescriptor: ${nftDescriptor.address}`);

    const nonfungibleTokenPositionDescriptor =
      await this.deployNonfungibleTokenPositionDescriptor();
    console.log(
      `NonfungibleTokenPositionDescriptor: ${nonfungibleTokenPositionDescriptor.address}`
    );

    const nonfungiblePositionManager = await this.deployNonfungiblePositionManager();
    console.log(`NonfungiblePositionManager: ${nonfungiblePositionManager.address}`);
  }
}
