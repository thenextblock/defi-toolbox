import hre from 'hardhat';
import { UniswapV3Deployment } from '../lib/uniswap-v3-deployment';
import { WETH9 } from '../types';

async function main() {
  const weth: WETH9 = await hre.run('weth:deploy');
  const uniswapV3: UniswapV3Deployment = 
    await hre.run('uniswap:deploy', { weth: weth.address });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
