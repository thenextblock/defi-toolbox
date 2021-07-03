//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenTemplate is ERC20, Ownable {

    constructor(string memory name_, string memory symbol_) public ERC20(name_, symbol_)  {
        mint(msg.sender, 1*10**18);
    }
    
    function mint(address _to, uint256 _amount) onlyOwner public {
        _mint(_to, _amount);
    }

    function setDecimals(uint8 _decimals) onlyOwner public  {
        _setupDecimals(_decimals);
    }
}