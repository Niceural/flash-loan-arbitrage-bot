// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/ERC20.sol";
import "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/Ownable.sol";

/*
    Ensures that any contract that inherits from this contract is able to
    withdraw funds that are accidentally rece    "@openzeppelin3": "npm:@openzeppelin/contracts@3.4",ived or stuck.
 */

contract Withdrawable is Ownable {
    address constant ETHER = address(0);

    event LogWithdraw(address indexed _from, address indexed _assetAddress, uint256 amount);

    /**
     * @dev Withdraw asset.
     * @param _assetAddress Asset to be withdrawn.
     */
    function withdraw(address _assetAddress) public onlyOwner {
        uint256 assetBalance;
        if (_assetAddress == ETHER) {
            address self = address(this); // workaround for a possible solidity bug
            assetBalance = self.balance;
            payable(msg.sender).transfer(assetBalance);
        } else {
            assetBalance = ERC20(_assetAddress).balanceOf(address(this));
            bool success = ERC20(_assetAddress).transfer(msg.sender, assetBalance);
            require(success, "ERC20: Transfer did not succeed");
        }
        emit LogWithdraw(msg.sender, _assetAddress, assetBalance);
    }
}
