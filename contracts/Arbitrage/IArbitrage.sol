// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12;

interface IArbitrage {
    function takeArbitrage(
        address[] calldata assets,
        uint256[] calldata amounts,
        bytes calldata params
    ) external;
}
