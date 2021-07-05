export function initTasks() {
  require('./accounts');
  require('./compound-v2');
  require('./erc20');
  require('./uniswap-v3');
  require('./weth');
}
export const GET_ACCOUNTS = 'accounts';
export const DEPLOY_ERC20 = 'defi:erc20:deploy';
export const DEPLOY_WETH = 'defi:weth:deploy';
export const DEPLOY_COMPUND_CORE = 'defi:compound:deploy-core';
export const DEPLOY_COMPUND_CTOKENS = 'defi:compound:deploy-ctokens';
export const DEPLOY_UNISWAP = 'defi:uniswap:deploy';
export const CREATE_UNISWAP_POOL = 'defi:uniswap:create-pool';
export const ADD_UNISWAP_POOL_LIQUIDITY = 'defi:uniswap:add-liquidity';
