// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title The DepositWallet sends all tokens to the receiver and destructs himself
/// @author davy42
/// @notice The DepositWalletFactory uses a version of this contract bytecode with dynamic token and receiver addresses
/// @dev The rest of ETH on the wallet will be sent to the receiver even if it's a contract without receive function
contract DepositWallet {

    /// @notice Construc
    /// @dev token and receiver addresses will be changed during deployment from DepositWalletFactory
    constructor() {
        IERC20 token = IERC20(0xdAC17F958D2ee523a2206206994597C13D831ec7);
        address payable receiver = 0xBE0eB53F46cd790Cd13851d5EFf43D12404d33E8;
        if (!token.transfer(receiver, token.balanceOf(address(this)))) {
            revert();
        }
        selfdestruct(receiver);
    }

}
