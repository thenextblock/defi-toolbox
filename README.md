# Defi Toolbox

Defi Toolbox is a workspace with a few Hardhat-based packages for local DeFi development and testing.

The repository includes:

- `@thenextblock/defi-starter-kit`: example Hardhat project that wires the plugins together
- `@thenextblock/hardhat-erc20`: helper/plugin for deploying and minting ERC-20 tokens
- `@thenextblock/hardhat-weth`: helper/plugin for deploying WETH9
- `@thenextblock/hardhat-uniswap-v3`: helper/plugin for deploying and interacting with Uniswap V3

## Repository Layout

```text
packages/
  defi-starter-kit/
  hardhat-erc20/
  hardhat-uniswap-v3/
  hardhat-weth/
```

## Getting Started

Requirements:

- Node.js
- Yarn

Install workspace dependencies from the repository root:

```bash
yarn install
```

## Common Workflows

Use the example project if you want a ready-made Hardhat setup:

```bash
cd packages/defi-starter-kit
npx hardhat
```

That package imports the local plugins and exposes tasks for common actions such as:

- deploying ERC-20 tokens
- deploying WETH9
- deploying Uniswap V3 contracts
- creating pools and adding liquidity

Example scripts are available in:

- `packages/defi-starter-kit/scripts/uniswap-sample.ts`
- `packages/defi-starter-kit/scripts/compund-sample.ts`

## Package Notes

`packages/hardhat-erc20`

- TypeScript Hardhat plugin/library for ERC-20 deployment and minting
- includes `contracts/Erc20Token.sol`

`packages/hardhat-weth`

- TypeScript Hardhat plugin/library for WETH deployment
- includes `contracts/WETH.sol`

`packages/hardhat-uniswap-v3`

- TypeScript Hardhat plugin/library for local Uniswap V3 deployment and pool operations

## Useful Commands

Build a package:

```bash
yarn workspace @thenextblock/hardhat-erc20 build
yarn workspace @thenextblock/hardhat-weth build
yarn workspace @thenextblock/hardhat-uniswap-v3 build
```

Run the starter kit:

```bash
cd packages/defi-starter-kit
npx hardhat test
```

## More Detail

Some packages already include their own package-level README files:

- `packages/defi-starter-kit/README.md`
- `packages/hardhat-erc20/README.md`
- `packages/hardhat-weth/README.md`
