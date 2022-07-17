// SPDX-License-Identifier: MIT
pragma solidity >=0.7.6;

interface IArbitrage {
    function takeArbitrage(
        address[] calldata assets, 
        uint256[] calldata amounts,
        bytes calldata params
    ) external;
}