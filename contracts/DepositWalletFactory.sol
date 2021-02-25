// SPDX-License-Identifier: MIT
pragma solidity ^0.7.0;

import '@openzeppelin/contracts/utils/create2.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title The DepositWalletFactory allows withdrawing ERC20 tokens from a temporary DepositWallet
/// @author davy42
/// @notice The DepositWalletFactory can compute the address for deposit and withdraw funds
/// @dev The DepositWalletFactory use the bytecode of the DepositWallet contract with dynamic token and receiver addresses
contract DepositWalletFactory is Ownable {

    constructor() {
    }

    /// @notice Witdraws erc20 tokens from the deposit wallet and send to the receiver
    /// @param salt The unique salt
    /// @param token The address of the erc20 token which will be withdrawed
    /// @param receiver The address which will get tokens
    /// @return wallet the address of the wallet
    function withdraw(uint256 salt, address token, address receiver) external onlyOwner returns (address wallet) {
        return Create2.deploy(0, bytes32(salt), getByteCode(token, receiver));
    }

    /// @notice  Returns the address of the wallet
    /// @dev Compute address for depositing funds using salt, token and receivers
    /// @param salt The unique salt
    /// @param token The address of the erc20 token which will be deposited
    /// @param receiver The address which will get tokens when withdraw
    /// @return wallet the address of the wallet
    function computeAddress(uint256 salt, address token, address receiver) external view returns (address) {
        return Create2.computeAddress(bytes32(salt), keccak256(getByteCode(token, receiver)));
    }

    /// @notice Generate the bytecode of wallet contract with token and receiver
    /// @dev Explain to a developer any extra details
    /// @param token The address of the erc20 token which will be deposited
    /// @param receiver The address which will get tokens when withdraw
    /// @return bytecode the bytecode of the wallet contract
    function getByteCode(address token, address receiver) public pure returns (bytes memory bytecode) {
        bytecode = abi.encodePacked(
            hex"608060405234801561001057600080fd5b50604080516370a0823160e01b8152306004820152905173",
            token,
            hex"9173",
            receiver,
            hex"91839163a9059cbb91849184916370a0823191602480820192602092909190829003018186803b15801561008557600080fd5b505afa158015610099573d6000803e3d6000fd5b505050506040513d60208110156100af57600080fd5b5051604080516001600160e01b031960e086901b1681526001600160a01b03909316600484015260248301919091525160448083019260209291908290030181600087803b15801561010057600080fd5b505af1158015610114573d6000803e3d6000fd5b505050506040513d602081101561012a57600080fd5b505161013557600080fd5b806001600160a01b0316fffe"
        );
    }

}
