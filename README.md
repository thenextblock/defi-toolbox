# Defi Starter Kit – Defi (lego) builders Toolbox

Deployment and interaction tasks for various Defi platforms like Uniswap V3, Compound V2, Aave, UMA, Balancer, Synthetix and many other well known protocols.


## Avaialble Tasks
To see avaialble tasks run `npx hardhat`.

### ERC20 token
**`defi:erc20:deploy`** – _deploy ERC20 token_
```bash
npx hardhat defi:erc20:deploy \
    --symbol AAA \
    --name "Token A" \
    --decimals 6
```

**`defi:erc20:mint`** – _mint ERC20 token_
```bash
npx hardhat defi:erc20:mint \
    --contract "0x5FbDB2315678afecb367f032d93F642f64180aa3" \
    --receiver "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266" \
    --amount 1000000000 \
    --network localhost
```

<br>

### WETH
**`defi:weth:deploy`** – _deploy WETH9_
```shell
npx hardhat defi:weth:deploy
```

<br>

### Uniswap V3
**`defi:uniswap:deploy`** – _deploy Uniswap V3 contracts_
```bash
npx hardhat defi:uniswap:deploy
```

**`defi:uniswap:create-pool`** – _Create and initialize a pool_
```bash
npx hardhat defi:uniswap:create-pool \
    --contract 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0 \
    --token0 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
    --token1 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 \
    --fee 500 \
    --amount0 1000000000 \
    --amount1 1000000000
```

**`defi:uniswap:add-liquidity`** – _Add liquidity to the pool_
```bash
npx hardhat defi:uniswap:add-liquidity \
    --contract 0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0 \
    --token0 0x5FbDB2315678afecb367f032d93F642f64180aa3 \
    --token1 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512 \
    --fee 500 \
    --amount0 1000000000 \
    --amount1 1000000000 \
    --amount0min 990000000 \
    --amount1min 990000000 \
    --deadline 20
```


A Hardhat task can be used in the script as well (see [scripts/uniswap-sample.ts](./scripts/uniswap-sample.ts)):
```typescript
...
const weth: WETH9 = await hre.run(DEPLOY_WETH);

const uniswapV3: UniswapV3Deployment = await hre.run(DEPLOY_UNISWAP, {
  weth: weth.address,
});

const tokenA: TokenTemplate = await hre.run(DEPLOY_ERC20, {
  symbol: 'AAA',
  name: 'Token A',
  decimals: '18',
});
await tokenA.mint(receiverAddress, BigInt(5e25));

await hre.run(CREATE_UNISWAP_POOL, {
  contract: uniswapV3.nonfungiblePositionManager.address,
  token0: tokenA.address,
  token1: tokenB.address,
  amount0: BigInt(1e22).toString(),
  amount1: BigInt(2e20).toString(),
});
...
```

<br>

### Compound Protocol V2
**`defi:compound:deploy-core`** – _deploy Comound V2 core contracts_
```bash
  npx hardhat defi:compound:deploy-core
```
**`defi:compound:deploy-core`** – _add markets into Compound protocol _
```bash
  npx hardhat defi:compound:deploy-ctokens \
    --comptroller 0x.. \
    --underlying 0x.. \
    --name "Compound USDC" \
    --symbol USDC \
    --interestratemodel 0x..
```
