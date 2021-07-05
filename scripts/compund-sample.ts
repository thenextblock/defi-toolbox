import hre from 'hardhat';
import { CompoundV2Deplotyment } from '../lib/compound-v2-deployment';
import { DEPLOY_COMPUND_CORE, DEPLOY_COMPUND_CTOKENS } from '../tasks';

async function main() {
  const compound: CompoundV2Deplotyment = await hre.run(DEPLOY_COMPUND_CORE);
  await hre.run(DEPLOY_COMPUND_CTOKENS, {
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
