import hre, { ethers } from 'hardhat';
import { Signer } from 'ethers';
import {
  WETH9,
  Comptroller__factory,
  SimplePriceOracle__factory,
  Unitroller__factory,
  ComptrollerG6__factory,
  WhitePaperInterestRateModel__factory,
  TokenTemplate,
  CErc20__factory,
  InterestRateModel,
  CErc20Delegator__factory,
  Timelock__factory,
  CEther__factory,
} from '../types';

// This is Temporrary Code, just test Compund deployment scenario
// TODO: Rewrite in class
// TODO: Create Task

async function main() {
  const accounts = await hre.ethers.getSigners();
  const deployer = accounts[0];
  console.log('Compile deployment contracts in sequence');

  console.log('1.1 deploy SimplePriceOracle，compile contract  SimplePriceOracle.sol');
  const simpleOracle = await new SimplePriceOracle__factory(deployer).deploy();
  console.log('simpleOracle : ', simpleOracle.address);

  console.log('1.2 deploy Comptroller，compile contract  Comptroller.sol');
  const comptroller = await new ComptrollerG6__factory(deployer).deploy();
  console.log('comtproller : ', comptroller.address);

  console.log('1.3 comtproller Set the price oracle address： ');
  await comptroller._setPriceOracle(simpleOracle.address);

  console.log('1.4 deploy Unitroller，compile contract：Unitroller.sol');
  const unitroller = await new Unitroller__factory(deployer).deploy();
  console.log('unitroller : ', unitroller.address);

  console.log('1.5 Bind the agent to the implementation contrac');
  //   Unitroller._setPendingImplementation(0xdd0ee3fd5fa358499257b956b733c6e25e7484ca);
  await unitroller._setPendingImplementation(comptroller.address);
  await comptroller._become(unitroller.address);

  //   console.log('The hext value', ethers.utils.hexlify('0x470de4df820000'));

  const baseRatePerYear = parseInt('0x470de4df820000').toString(); //  mean 2%
  const multiplierPerYear = parseInt('0x470de4df820000').toString(); // mean 30%

  console.log('baseratePerYear : ', baseRatePerYear);
  console.log('multiplierPerYear : ', multiplierPerYear);

  console.log(
    '1.6 deploy WhitePaperInterestRateModel， compile contract： WhitePaperInterestRateModel.sol '
  );
  const whitePaperInterestRateModel = await new WhitePaperInterestRateModel__factory(
    deployer
  ).deploy(baseRatePerYear, multiplierPerYear);
  console.log('whitePaperInterestRateModel : ', whitePaperInterestRateModel.address);

  // Deploy USDC token
  const args = {
    name: 'usdc',
    symbol: 'usdc',
    decimals: '6',
  };
  const usdc: TokenTemplate = await hre.run('erc20:deploy', args);

  // 2.7deploy  CErc20，Issue market tokens cFomA  compile contract： CErc20.sol

  // Deploy Timelock contract
  const TomeLock = new Timelock__factory(deployer);
  const tomelock = await TomeLock.deploy(deployer.address, 0);

  // Deploy Implementation
  const cErc20 = new CErc20__factory(deployer);
  const cUSDC = await cErc20.deploy();
  const _initialExchangeRateMantissa = '1000000000000000000';

  // address underlying_,
  // ComptrollerInterface comptroller_,
  // InterestRateModel interestRateModel_,
  // uint initialExchangeRateMantissa_,
  // string memory name_,
  // string memory symbol_,
  // uint8 decimals_
  await cUSDC['initialize(address,address,address,uint256,string,string,uint8)'](
    usdc.address,
    comptroller.address,
    whitePaperInterestRateModel.address,
    _initialExchangeRateMantissa,
    'Compound USDC Token',
    'cUSDC',
    8
  );

  console.log('cUSDC : ', cUSDC.address);

  // const CErc20Delegator = new CErc20Delegator__factory(deployer);
  // await CErc20Delegator.deploy(
  //   _underLying,
  //   _comptroller,
  //   _interestRateModel,
  //   _initialExchangeRateMantissa,
  //   'Compound USDC Token',
  //   'cUSDC',
  //   6,
  //   tomelock.address,
  //   cUSDC.address,
  //   '0x'
  // );

  // Deploy cEther
  const cEtherFactory = new CEther__factory(deployer);
  const cETH = await cEtherFactory.deploy(
    comptroller.address,
    whitePaperInterestRateModel.address,
    _initialExchangeRateMantissa,
    'Compound cEther',
    'cETH',
    '18',
    deployer.address
  );

  console.log('cEth : ', cETH.address);

  // 3 Configure comptroller

  await comptroller._supportMarket(cETH.address);
  await comptroller._setCollateralFactor(cETH.address, '800000000000000000');

  await comptroller._supportMarket(cUSDC.address);
  await comptroller._setCollateralFactor(cUSDC.address, '400000000000000000');

  await comptroller._setLiquidationIncentive('80000000000000000');
  await comptroller._setCloseFactor('500000000000000000');

  //
  let contract = await comptroller.connect(accounts[1]);
  let tx = await contract.enterMarkets([cETH.address]);
  let receipt = await tx.wait();
  let tx1 = await cETH.connect(accounts[1]).mint({ value: '1000000000000000000' });
  console.log('-----------------------');
  // let receipt1 = await tx1.wait();
  // console.log(receipt1);

  // Set Oracle Prices

  await simpleOracle.setDirectPrice(cETH.address, '2226324054000000000000');
  await simpleOracle.setUnderlyingPrice(cUSDC.address, '1000000000000000000000000000000');

  const tx2 = await cUSDC.connect(accounts[1]).borrow('10000000');
  let receipt2 = await tx2.wait();
  console.log('-----------------');
  // @ts-ignore
  console.log(receipt2.events[2].args);
  // @ts-ignore
  const [error, info, detail] = receipt2.events[2].args;
  console.log('Error :  ', error.toNumber());
  console.log('Info :  ', info.toNumber());
  console.log('Details :  ', detail.toNumber());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
