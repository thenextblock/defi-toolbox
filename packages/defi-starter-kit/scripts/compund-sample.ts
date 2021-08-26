import hre from 'hardhat';
import {
  COMPOUND_CORE_DEPLOY,
  COMPOUND_CTOKENS_DEPLOY,
  CompoundV2Deplotyment,
} from '@thenextblock/hardhat-compound-plugin';

async function main() {
  const compound: CompoundV2Deplotyment = await hre.run(COMPOUND_CORE_DEPLOY);
  await hre.run(COMPOUND_CTOKENS_DEPLOY, {
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
