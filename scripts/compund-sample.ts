import hre from 'hardhat';
import { CompoundV2Deplotyment } from '../lib/compound-v2-deployment';

async function main() {
  const compound: CompoundV2Deplotyment = await hre.run('compound:deploy-core');
  await hre.run('compound:deploy-ctokens', {
    comptroller: compound.comptroller.address,
    wpirm: compound.whitePaperInterestRateModel.address,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
