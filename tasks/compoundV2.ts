import { task } from 'hardhat/config';
import {
  CErc20__factory,
  CEther__factory,
  ComptrollerG6__factory,
  SimplePriceOracle__factory,
  Timelock__factory,
  TokenTemplate,
  Unitroller__factory,
  WhitePaperInterestRateModel__factory,
} from '../types';
import { CompoundV2Deplotyment } from '../lib/compound-v2-deployment';

task('compound:deploy-core', 'Deploy Compund V2 contracts').setAction(async (args, hre) => {
  const [deployer] = await hre.ethers.getSigners();

  const simpleOracle = await new SimplePriceOracle__factory(deployer).deploy();
  console.log(`simpleOracle: ${simpleOracle.address}`);

  const comptroller = await new ComptrollerG6__factory(deployer).deploy();
  console.log(`comtproller: ${comptroller.address}`);

  await comptroller._setPriceOracle(simpleOracle.address);

  const unitroller = await new Unitroller__factory(deployer).deploy();
  console.log(`unitroller: ${unitroller.address}`);

  await unitroller._setPendingImplementation(comptroller.address);
  await comptroller._become(unitroller.address);

  const baseRatePerYear = parseInt('0x470de4df820000').toString(); // mean 2%
  const multiplierPerYear = parseInt('0x470de4df820000').toString(); // mean 30%

  const whitePaperInterestRateModel = await new WhitePaperInterestRateModel__factory(
    deployer
  ).deploy(baseRatePerYear, multiplierPerYear);
  console.log(`whitePaperInterestRateModel: ${whitePaperInterestRateModel.address}`);

  const compundV2Deployment = new CompoundV2Deplotyment(deployer);
  compundV2Deployment.simpleOracle = simpleOracle;
  compundV2Deployment.comptroller = comptroller;
  compundV2Deployment.unitroller = unitroller;
  compundV2Deployment.whitePaperInterestRateModel = whitePaperInterestRateModel;

  return compundV2Deployment;
});

task('compound:deploy-ctokens', 'Deploy cTokens')
  .addParam('comptroller', 'Comptroller address')
  .addParam('wpirm', 'WhitePaperInterestRateModel address')
  .setAction(async (args, hre) => {
    const [deployer] = await hre.ethers.getSigners();

    const timelock = await new Timelock__factory(deployer).deploy(deployer.address, 0);

    const usdc: TokenTemplate = await hre.run('erc20:deploy', {
      name: 'usdc',
      symbol: 'usdc',
      decimals: '6',
    });

    const comptroller = ComptrollerG6__factory.connect(args.comptroller, deployer);
    const whitePaperInterestRateModel = WhitePaperInterestRateModel__factory.connect(
      args.comptroller,
      deployer
    );

    const _initialExchangeRateMantissa = '1000000000000000000';
    const cUSDC = await new CErc20__factory(deployer).deploy();
    await cUSDC['initialize(address,address,address,uint256,string,string,uint8)'](
      usdc.address,
      comptroller.address,
      whitePaperInterestRateModel.address,
      _initialExchangeRateMantissa,
      'Compound USDC Token',
      'cUSDC',
      8
    );
    console.log(`cUSDC: ${cUSDC.address}`);

    const cEtherFactory = new CEther__factory(deployer);
    const cEth = await cEtherFactory.deploy(
      comptroller.address,
      whitePaperInterestRateModel.address,
      _initialExchangeRateMantissa,
      'Compound cEther',
      'cETH',
      '18',
      deployer.address
    );
    console.log(`cEth: ${cEth.address}`);

    return {
      timelock,
      usdc,
      cUsdc: cUSDC,
      cEth,
    };
  });
