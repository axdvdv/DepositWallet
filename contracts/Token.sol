// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {

    constructor() ERC20('Test','TST') {

    }

    function mint(address receiver, uint256 amount) external {
        _mint(receiver, amount);
    }

}
