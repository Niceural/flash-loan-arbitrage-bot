// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "@aave/core-v3/contracts/flashloan/base/FlashLoanReceiverBase.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "./interface/IArbitrage.sol";
import "./interface/IERC20.sol";
import "./utils/Withdrawable.sol";

contract AaveV3FlashLoan is FlashLoanReceiverBase, Withdrawable {
    IArbitrage private s_arbitrageContract;

    constructor(
        address _poolAddressesProvider, 
        address _arbitrageAddress
    ) FlashLoanReceiverBase(IPoolAddressesProvider(_poolAddressesProvider)) {
        s_arbitrageContract = IArbitrage(_arbitrageAddress);
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        s_arbitrageContract.takeArbitrage(assets, amounts, params);

        // Approve the LendingPool contract allowance to *pull* the owed amount
        for (uint256 i = 0; i < assets.length; i++) {
            uint256 amountOwing = amounts[i] + premiums[i];
            IERC20(assets[i]).approve(address(POOL), amountOwing);
        }
        
        return true;
    }

    function flashLoan(
        address[] memory assets,
        uint256[] memory amounts,
        bytes memory params
    ) external onlyOwner {
        address receiverAddress = address(this);
        address onBehalfOf = address(this);
        uint16 referralCode = 0;
        uint256[] memory modes = new uint256[](assets.length);
        for (uint256 i = 0; i < assets.length; i++) {
            modes[i] = 0;
        }

        POOL.flashLoan(
            receiverAddress, 
            assets, 
            amounts, 
            modes, 
            onBehalfOf,
            params,
            referralCode
        );
    }

    function getArbitrage() public view returns (address) {
        return address(s_arbitrageContract);
    }

    function setArbitrage(address _arbitrageAddress) public onlyOwner {
        s_arbitrageContract = IArbitrage(_arbitrageAddress);
    }
}