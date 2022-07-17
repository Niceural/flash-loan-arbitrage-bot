// SPDX-License-Identifier: MIT
pragma solidity ^0.6.6;

import "@aave/protocol-v2/contracts/flashloan/base/FlashLoanReceiverBase.sol";
import "./Withdrawable.sol";
import "../Arbitrage/IArbitrage.sol";

/// @title AAVE V2 Flash Loans Requests
/// @author Nicolas Bayle
/// @notice This contract requests a flash loan on AAVE V2 lending pool.
/// It implements the executeOperation() callback function.
contract AaveV2FlashLoan is FlashLoanReceiverBase, Withdrawable {
    IArbitrage private s_arbitrageContract;

    /// @param _addressesProvider Address of LendingPoolAddressesProvider
    /// @param _arbitrageAddress Address of the arbitrage contract
    constructor(address _addressesProvider, address _arbitrageAddress)
        public
        FlashLoanReceiverBase(ILendingPoolAddressesProvider(_addressesProvider))
    {
        s_arbitrageContract = IArbitrage(_arbitrageAddress);
    }

    receive() external payable {}

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        // execute arbitrage logic
        s_arbitrageContract.takeArbitrage(assets, amounts, params);

        // approve the LendingPool contract allowance to "pull" the owed amount
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i].add(premiums[i]);
            IERC20(assets[i]).approve(address(LENDING_POOL), amountOwing);
        }

        return true;
    }

    function flashLoan(
        address[] memory assets,
        uint256[] memory amounts,
        bytes calldata params
    ) public onlyOwner {
        address receiverAddress = address(this);
        address onBehalfOf = address(this);
        uint16 referralCode = 0;
        uint256[] memory modes = new uint256[](assets.length);

        for (uint256 i = 0; i < assets.length; i++) {
            modes[i] = 0;
        }

        LENDING_POOL.flashLoan(
            receiverAddress,
            assets,
            amounts,
            modes,
            onBehalfOf,
            params,
            referralCode
        );
    }

    function setArbitrage(address _arbitrageAddress) public {
        s_arbitrageContract = IArbitrage(_arbitrageAddress);
    }
}
