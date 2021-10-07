import hre from 'hardhat';
import { deployErc20Token } from '@thenextblock/hardhat-erc20';
import { deployCompoundV2 } from '@thenextblock/hardhat-compound';

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const abcToken = await deployErc20Token(
    { name: 'ABC Token', symbol: 'ABC', decimals: 8 },
    deployer
  );
  const { comptroller } = await deployCompoundV2([], deployer);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
