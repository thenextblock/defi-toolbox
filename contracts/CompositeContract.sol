//SPDX-License-Identifier: Unlicense
pragma solidity 0.7.6;
pragma abicoder v2;

import "hardhat/console.sol";
// import "@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol";
// import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./SwapRouter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-core/contracts/interfaces/IERC20Minimal.sol";
import "@openzeppelin/contracts/proxy/ProxyAdmin.sol";

import "./TokenTemplate.sol";


contract CompositeContract {
  
  // using SafeERC20 for IERC20;

  address routerAddress; 
  ISwapRouter router;

  constructor(ISwapRouter _router) {
    console.log("SM: -> Deploying FlashBot Contract:");
    router = _router;    
  } 
  
  receive() payable external {}

  function mySwap(uint256 _amountIn , IERC20 _tokenIn, IERC20 _tokenOut, address _account) public  {

    console.log("ST -> msg.sender: %s", msg.sender);
    console.log("ST -> msg.sender Balance = %s", msg.sender.balance);
    console.log("ST -> Contract Balance = %s  ", address(this).balance);
    // console.log("ST -> block.chainid = %s ", block.chainid);
    console.log("ST -> block.number = %s ", block.number);

    // console.log("TokenIn Name : %s ", _tokenIn.name());
    // console.log("msg.sender balance token in : %s ", _tokenIn.balanceOf(msg.sender));

    // _tokenIn.safeTransferFrom(msg.sender, address(this), _amountIn);
    // _tokenIn.safeIncreaseAllowance(address(router), _amountIn);


    // ISwapRouter.ExactInputSingleParams memory params = ISwapRouter.ExactInputSingleParams(
    //         address(_tokenIn), // tokenIn
    //         address(_tokenOut), // tokenOut
    //         300,
    //         msg.sender, // recipient
    //         block.timestamp + 60000, // deadline
    //         _amountIn, // amountIn
    //         100, // amountOutMinimum
    //         0 // sqrtPriceLimitX96. Ignore pool price limits
    //   );

    // // console.log("Current Block timestamp %s ", block.timestamp);  
    // // console.log("Deadline %s ", params.deadline);

    // // Swap Router 
    // router.exactInputSingle(params);

    // address factory = router.factory();
    // console.log("Factory :  %s ", factory);
    
    // // string memory name = _tokenOut.name();
    // // console.log("ERC20 name:  %s", name);

    // uint256 balance = _tokenOut.balanceOf(_account);
    // console.log("ERC20 Balance:  %s", balance);

  }

  function getNow() public view returns (uint256 _now) {
    _now = block.timestamp + 6000;
  }

  
}
