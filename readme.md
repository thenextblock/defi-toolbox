

# Defi Starter Kit – Defi (lego) builders Toolbox


The easy installation deployment scripts & plugins for different Defi platforms : Uniswap, Compound, Aave ,  UMA , Balancer, Synthetix and many other most known Defi protocols.

Protocols :
1. Uniswap V3
2. Compound V2


You can see all  tasks running command :   `npx hardhat `


**Deploy Erc20 Token**

    npx hardhat erc20:deploy --name USDC --symbol USDC --decimals 6

**Deploy WETH Contract**

    npx hardhat defi:weth:deploy

## Uniswap V3

  Uniswap Deployment tasks split in 3 parts :
1. Core Modules :  *defi:uniswap:deploy*
2. Create Pool : *defi:uniswap:create-pool*
3. Add Liquidity : *defi:uniswap:add-liquidity*


```
=== UNISWAP DEPLOYMENT SAMPLE ===

# deployer's account:
#   0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

#
# 1.
# Deploy ERC20 tokens
#
npx hardhat defi:erc20:deploy \
    --symbol AAA \
    --name "Token A" \
    --decimals 6 \
    --network localhost

npx hardhat defi:erc20:deploy \
    --symbol BBB \
    --name "Token B" \
    --decimals 6 \
    --network localhost


#
# 2.
# Mint ERC20 tokens
#
# AAA
npx hardhat defi:erc20:mint \
    --contract 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
    --receiver 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 \
    --amount 1000000000 \
    --network localhost
# BBB
npx hardhat defi:erc20:mint \
    --contract 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 \
    --receiver 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 \
    --amount 1000000000 \
    --network localhost


#
# 3.
# Deploy Uniswap V3
#
npx hardhat defi:uniswap:deploy --network localhost

#
# 4.
# Create pool
#
npx hardhat defi:uniswap:create-pool \
    --contract 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0 \
    --token0 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
    --token1 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 \
    --fee 500 \
    --amount0 1000000000 \
    --amount1 1000000000 \
    --network localhost

#
# 5.
# Add liquidity
#
npx hardhat defi:uniswap:add-liquidity \
    --contract 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0 \
    --token0 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
    --token1 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 \
    --fee 500 \
    --amount0 1000000000 \
    --amount1 1000000000 \
    --amount0min 990000000 \
    --amount1min 990000000 \
    --deadline 20 \
    --network localhost

# end
```

Yoy can combine tasks in one script als its possible import in tests:

```typescript

import hre from 'hardhat';
import { UniswapV3Deployment } from '../lib/uniswap-v3-deployment';
import { TokenTemplate, WETH9 } from '../types';
import {
  ADD_UNISWAP_POOL_LIQUIDITY,
  CREATE_UNISWAP_POOL,
  DEPLOY_ERC20,
  DEPLOY_UNISWAP,
  DEPLOY_WETH,
  GET_ACCOUNTS,
} from '../tasks';

async function main() {
  const [deployer] = await hre.run(GET_ACCOUNTS);

  const weth: WETH9 = await hre.run(DEPLOY_WETH);

  const uniswapV3: UniswapV3Deployment = await hre.run(DEPLOY_UNISWAP, {
    weth: weth.address,
  });

  const tokenA: TokenTemplate = await hre.run(DEPLOY_ERC20, {
    symbol: 'AAA',
    name: 'Token A',
    decimals: '18',
  });
  const tokenB: TokenTemplate = await hre.run(DEPLOY_ERC20, {
    symbol: 'BBB',
    name: 'Token B',
    decimals: '18',
  });

  await tokenA.mint(deployer.address, BigInt(5e25));
  await tokenB.mint(deployer.address, BigInt(3e24));

  await hre.run(CREATE_UNISWAP_POOL, {
    contract: uniswapV3.nonfungiblePositionManager.address,
    token0: tokenA.address,
    token1: tokenB.address,
    amount0: BigInt(1e22).toString(),
    amount1: BigInt(2e20).toString(),
  });

  await hre.run(ADD_UNISWAP_POOL_LIQUIDITY, {
    contract: uniswapV3.nonfungiblePositionManager.address,
    token0: tokenA.address,
    token1: tokenB.address,
    amount0: BigInt(1e22).toString(),
    amount1: BigInt(2e20).toString(),
    amount0min: BigInt(9.9e21).toString(),
    amount1min: BigInt(1.8e20).toString(),
    deadline: '5',
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


```


#Compound Protocol V2

Deploy Compound Protocol :
```
  npx hardhat defi:compound:deploy-core
```

Add Markets into Compound Protocol :

```
  npx hardhat defi:compound:deploy-ctokens \
    --comptroller 0x.. \
    --underlying 0x.. \
    --name "Compound USDC" \
    --symbol USDC \
    --interestratemodel 0x..

```




