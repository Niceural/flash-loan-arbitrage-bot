// SPDX-License-Identifier: MIT
pragma solidity =0.8.10;

import "./interface/IArbitrage.sol";

contract Arbitrage is IArbitrage {
    address[] s_assets;

    constructor(address[] _assets) {
        s_assets = _assets;
    }

    function takeArbitrage(
        address[] calldata assets,
        uint256[] calldata amounts,
        bytes calldata params
    ) external override {

    }

    function _uniV3SwapSingle(
        address tokenIn, 
        address tokenOut, 
        uint256 amountIn, 
        uint24 poolFee
    ) internal returns (uint256 amountOut) {
        // transfer the specified amount of tokenIn to this contract
        TransferHelper.safeTransferFrom(tokenIn, msg.sender, address(this), amountIn);

        // approve router to spend tokenIn
        TransferHelper.safeApprove(tokenIn, address(swapRouter), amountIn);

        // swap input params
        ISwapRouter.ExactInputSingleParams memory params = 
            ISwapRouter.ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: msg.sender,
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });

        // execute the swap
        amountOut = swapRouter.exactInputSingle(params);
    }

    function _uniV3SwapMultihop(
        address[] assets,
        address[] amounts
    ) internal {}
}