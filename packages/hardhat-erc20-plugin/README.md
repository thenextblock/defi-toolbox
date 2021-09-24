# Deploy ERC-20 token

Example:

```typescript
import { deployErc20Token, Erc20Token } from '@thenextblock/hardhat-erc20-plugin';
...
const args = {
  name: 'ABC Token',
  symbol: 'ABC',
  decimals: 8
};
const abcToken: Erc20Token = await deployErc20Token(args, deployer);
```
