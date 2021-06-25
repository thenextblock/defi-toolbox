//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TokenTemplate is ERC20  {

    constructor(string memory name_, string memory symbol_) public ERC20(name_, symbol_)  {
        mint(msg.sender, 1*10**18);
    }
    
    function mint(address _to, uint256 _amount) public {
        _mint(_to, _amount);
    }
}