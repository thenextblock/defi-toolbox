import hre from 'hardhat';
import {
  deployCEth,
  deployCompoundV2,
  deployCToken,
  deployWhitePaperInterestRateModel,
} from '@thenextblock/hardhat-compound-plugin';
import { deployErc20Token } from '@thenextblock/hardhat-erc20-plugin';
import {
  Comptroller__factory,
  SimplePriceOracle__factory,
} from '@thenextblock/hardhat-compound-plugin/dist/typechain';

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const compound = await deployCompoundV2(deployer);
  const abcToken = await deployErc20Token(
    { name: 'ABC Token', symbol: 'ABC', decimals: 8 },
    deployer
  );
  const abcIrm = await deployWhitePaperInterestRateModel(
    {
      baseRatePerYear: '20000000000000000',
      multiplierPerYear: '300000000000000000',
    },
    deployer
  );
  const cAbcToken = await deployCToken(
    {
      underlying: abcToken.address,
      comptroller: compound.comptroller!,
      interestRateModel: abcIrm.address,
      initialExchangeRateMantissa: '200000000000000000000000000',
      name: 'Compound ABC Token',
      symbol: 'cABC',
      decimals: 8,
      admin: deployer.address,
    },
    deployer
  );

  const comptroller = await Comptroller__factory.connect(compound.comptroller!, deployer);
  const priceOracle = await SimplePriceOracle__factory.connect(compound.priceOracle!, deployer);
  comptroller._supportMarket(cAbcToken.address);
  priceOracle.setUnderlyingPrice(cAbcToken.address, '64500000000000000000');

  const cEthIrm = await deployWhitePaperInterestRateModel(
    {
      baseRatePerYear: '20000000000000000',
      multiplierPerYear: '100000000000000000',
    },
    deployer
  );

  const cEth = await deployCEth(
    {
      name: 'Compound Ether',
      symbol: 'cEth',
      decimals: 8,
      comptroller: comptroller.address,
      interestRateModel: cEthIrm.address,
      initialExchangeRateMantissa: '200000000000000000000000000',
      admin: deployer.address,
    },
    deployer
  );
  console.log('cEth', cEth.address);

  await comptroller._supportMarket(cEth.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
