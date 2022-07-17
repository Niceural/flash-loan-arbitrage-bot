<!--
-->
<div id="top"></div>


<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]
-->


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Niceural/flash-loan-arbitrage-bot">
    <img src="image/logo.png" alt="Logo" width="380" height="">
  </a>

<h1 align="center">Flash Loan and Arbitrage Crypto Trading Bot</h1>

  <p align="center">
    <a href="https://youtube.com">View Demo Video</a>
    ·
    <a href="https://github.com/Niceural/flash-loan-arbitrage-bot/issues">Report Bug</a>
    ·
    <a href="https://github.com/Niceural/flash-loan-arbitrage-bot/fork">Fork this Repository</a>
  </p>
  <br />
</div>

<br />

<br />

<!-- ABOUT THE PROJECT -->
<h1 id="intro">About The Project</h1>
This repo contains the code for my cryptocurrency trading bot. The bot borrows some amount of some cryptocurrency from <a href="https://docs.aave.com/developers/getting-started/readme">Aave V3 protocol</a> <a href="https://docs.aave.com/developers/guides/flash-loans">flash loans</a> and executes arbitrage by swapping on <a href="https://docs.uniswap.org/">Uniswap V3</a> and <a href="https://docs.sushi.com/">Sushiswap</a> protocols.

<br />

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#gettingStarted">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
      <a href="#defi-protocols">DeFi Protocols<a>
      <ul>
        <li><a href="#aaveProtocol">Aave V3 Protocol</a></li>
        <li><a href="#uniswapProtocol">Uniswap V3 Protocol</a></li>
        <li><a href="#sushiswapProtocol">Sushiswap Protocol</a></li>
      </ul>
    </li>
    <li>
      <a href="#contracts">Smart Contracts</a>
      <ul>
        <li>
          <a href="#AaveV3FlashLoan">AaveV3FlashLoan</a>
        </li>
        <li>
          <a href="#UniswapSushiswapArbitrage">UniswapSushiswapArbitrage</a>
        </li>
      </ul>
    </li>
    <li>
      <a href="#testing">Mocking and Testing</a>
    </li>
  </ol>
</details>

<br />

<!-- GETTING STARTED -->
<h1 id="gettingStarted">Getting Started</h1>

  <h2 id="prerequisites">Prerequisites</h2>
    To use download and use this project on your machine you need the following installed:
    <ul>
      <li><a href="https://git-scm.com/doc">Git</a> version control system which you can download from <a href="https://git-scm.com/downloads">here</a>. To check git installation, run: <pre>git --version</pre></li>
      <li><a href="https://nodejs.org/en/docs/">Node.js</a> JavaScript runtime which you can download from <a href="https://nodejs.org/en/download/">here</a>. To check Node.js installation, run: <pre>node --version</pre></li>
      <li><a href="https://classic.yarnpkg.com/en/docs">Yarn</a> dependency management package which you can download from <a href="https://classic.yarnpkg.com/en/docs/install#debian-stable">here</a>. To check yarn installation, run: <pre>yarn --version</pre></li>
    </ul>
    <h2 id="installation">Installation</h2>
      Follow these steps to install the repo on your machine:
      <ol>
        <li>
          In the folder where you want to clone the repo type:
          <pre>git clone https://github.com/Niceural/flash-loan-arbitrage-bot.git</pre>
        </li>
        <li>
          Create a .env file and paste your account private key, your RPC URLs, and your Etherscan API key, following the .env.example template
        </li>
        <li>
          Install the dependencies by running: 
          <pre>yarn install</pre>
        </li>
        <li>
          Check your installation by running:
          <pre>hh compile</pre>
        </li>
      </ol>


<!-- DeFi protocols -->
<h1 id="defi-protocols"> DeFi Protocols</h1>

  <h2 id="aaveProtocol">
    <a href="https://docs.aave.com/developers/getting-started/readme">Aave V3</a> Protocol
  </h2>
    The Aave 
    <h3>Flash Loans</h3>
      A contract can call the function `flashLoan()` or `flashLoanSimple()` on the `Pool` contract. The contract calling the function can then access the liquidity of the pool (i.e. the money owned by it) and use it as long as the amount borrowed plus fee is returned to the pool in the same transaction. Contrarily to `flashLoanSimple()`, `flashLoan()` can access to liquidity of multiple reserves. The contract calling `flashLoan()` on the pool to execute an arbitrage operation should follow the procedure described below:
      <ol>
        <li>The program fetching price discrepancies running on our computer calls the function on our contract responsible for initiating the flash loan. This function is being passed the address and amount of the assets to borrow, and the parameters describing the arbitrage logic (i.e. which asset to swap first, with which protocol, etc).</li>
        <li>`flashLoan()` from the `Pool` contract is called and being passed the parameters described above.</li>
        <li>After some sanity checks the amount borrowed is transferred to our contract and the `executeOperation()` function of our contract is called. It is being passed the address and amount of each assets and the parameters describing the arbitrage logic.</li>
        <li>Our contract allows the pool to transfer the amount borrowed plus fees. If this amount is not available, this whole process reverts.</li>
      </ol>
    <h3>Flash loan contract execution flow</h3>
      On a contract level, the execution flow of an Aave flash loan for multiple assets is described below:
      <ol>
        <li>The <a href="https://github.com/aave/aave-v3-core/blob/e46341caf815edc268893f4f9398035f242375d9/contracts/protocol/pool/Pool.sol#L388">flashLoan</a>() function of the Pool contract is called by our contract</li>
        <li>The parameters passed by our contract as well as member variables of the Pool contract are converted into a variable of type <a href="https://github.com/aave/aave-v3-core/blob/e46341caf815edc268893f4f9398035f242375d9/contracts/protocol/libraries/types/DataTypes.sol#L179">FlashloanParams</a></li>
        <li>The <a href="https://github.com/aave/aave-v3-core/blob/e46341caf815edc268893f4f9398035f242375d9/contracts/protocol/libraries/logic/FlashLoanLogic.sol#L57">executeFlashLoan</a>() function is called and passed the variable created above</li>
        <li>The <a href="https://github.com/aave/aave-v3-core/blob/e46341caf815edc268893f4f9398035f242375d9/contracts/protocol/libraries/logic/ValidationLogic.sol#L458">validateFlashloan</a>() function is called. This function performs three checks:
        <ol>
          <li>it reverts with error <a href="https://github.com/aave/aave-v3-core/blob/e46341caf815edc268893f4f9398035f242375d9/contracts/protocol/libraries/helpers/Errors.sol#L58">Errors.INCONSISTENT_FLASHLOAN_PARAMS</a> if the length of the assets array is different from the length of the amounts array</li>
          <li>it reverts with error <a href="https://github.com/aave/aave-v3-core/blob/e46341caf815edc268893f4f9398035f242375d9/contracts/protocol/libraries/helpers/Errors.sol#L38">Errors.RESERVE_PAUSED</a> if the state of one of the reserves is paused</li>
          <li>it reverts with error <a href="https://github.com/aave/aave-v3-core/blob/e46341caf815edc268893f4f9398035f242375d9/contracts/protocol/libraries/helpers/Errors.sol#L36">Errors.RESERVE_INACTIVE</a> if the state of the reserve is inactive</li>
        </ol></li>
        <li>A variable of type <a href="https://github.com/aave/aave-v3-core/blob/e46341caf815edc268893f4f9398035f242375d9/contracts/protocol/libraries/logic/FlashLoanLogic.sol#L46">FlashLoanLocalVars</a> is constructed from the <a href="https://github.com/aave/aave-v3-core/blob/e46341caf815edc268893f4f9398035f242375d9/contracts/protocol/libraries/logic/FlashLoanLogic.sol#L57">executeFlashLoan</a>() function 
      </ol>



<!-- CONTRACTS -->
<h1 id="contracts">Smart Contracts</h1>


<h2 id="AaveV3FlashLoan">AaveV3FlashLoan</h2>

<h2 id="UniswapSushiswapArbitrage">UniswapSushiswapArbitrage</h2>

<h1 id="testing">Mocking and Testing</h1>