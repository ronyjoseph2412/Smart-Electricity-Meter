// SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

interface Erc20 {
    function approve(address, uint256) external returns (bool);
    function transfer(address, uint256) external returns (bool);
}

interface CErc20 {
    function mint(uint256) external returns (uint256);
    function exchangeRateCurrent() external returns (uint256);
    function supplyRatePerBlock() external returns (uint256);
    function redeem(uint) external returns (uint);
    function redeemUnderlying(uint) external returns (uint);
    function balanceOf(address owner) external view returns (uint balance);
}

interface CEth {
    function mint() external payable;
    function exchangeRateCurrent() external returns (uint256);
    function supplyRatePerBlock() external returns (uint256);
    function redeem(uint) external returns (uint);
    function redeemUnderlying(uint) external returns (uint);
    function exchangeRateStored() external view returns (uint); 
    function balanceOf(address owner) external view returns (uint balance);
}


contract MyContract {
    event MyLog(string, uint256);

    function supplyEthToCompound()
        public
        payable
        returns (bool)
    {
        // Create a reference to the corresponding cToken contract
        CEth cToken = CEth(0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e);

        // Amount of current exchange rate from cToken to underlying
        uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();
        emit MyLog("Exchange Rate (scaled up by 1e18): ", exchangeRateMantissa);

        // Amount added to you supply balance this block
        uint256 supplyRateMantissa = cToken.supplyRatePerBlock();
        emit MyLog("Supply Rate: (scaled up by 1e18)", supplyRateMantissa);

        cToken.mint{ value: msg.value, gas: 250000 }();
        return true;
    }

    function supplyErc20ToCompound(
        uint256 _numTokensToSupply
    ) public returns (uint) {
        // Create a reference to the underlying asset contract, like DAI.
        Erc20 underlying = Erc20(0xc7AD46e0b8a400Bb3C915120d284AafbA8fc4735);

        // Create a reference to the corresponding cToken contract, like cDAI
        CErc20 cToken = CErc20(0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e);

        // Amount of current exchange rate from cToken to underlying
        uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();
        emit MyLog("Exchange Rate (scaled up): ", exchangeRateMantissa);

        // Amount added to you supply balance this block
        uint256 supplyRateMantissa = cToken.supplyRatePerBlock();
        emit MyLog("Supply Rate: (scaled up)", supplyRateMantissa);

        // Approve transfer on the ERC20 contract
        underlying.approve(0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e, _numTokensToSupply);

        // Mint cTokens
        uint mintResult = cToken.mint(_numTokensToSupply);
        return mintResult;
    }

    function redeemCErc20Tokens(
        uint256 amount,
        bool redeemType,
        address _cErc20Contract
    ) public returns (bool) {
        // Create a reference to the corresponding cToken contract, like cDAI
        CErc20 cToken = CErc20(_cErc20Contract);

        // `amount` is scaled up, see decimal table here:
        // https://compound.finance/docs#protocol-math

        uint256 redeemResult;

        if (redeemType == true) {
            // Retrieve your asset based on a cToken amount
            redeemResult = cToken.redeem(amount);
        } else {
            // Retrieve your asset based on an amount of the asset
            redeemResult = cToken.redeemUnderlying(amount);
        }

        // Error codes are listed here:
        // https://compound.finance/docs/ctokens#error-codes
        emit MyLog("If this is not 0, there was an error", redeemResult);

        return true;
    }

    function redeemCEth(
        address _cEtherContract
    ) public returns (bool) {
        // Create a reference to the corresponding cToken contract
        CEth cToken = CEth(_cEtherContract);

        // `amount` is scaled up by 1e18 to avoid decimals

        uint balance = cToken.balanceOf(address(this));
        cToken.redeem(balance);

        // uint256 redeemResult;

        // if (redeemType == true) {
        //     // Retrieve your asset based on a cToken amount
        //     redeemResult = cToken.redeem(amount);
        // } else {
        //     // Retrieve your asset based on an amount of the asset
        //     redeemResult = cToken.redeemUnderlying(amount);
        // }

        // // Error codes are listed here:
        // // https://compound.finance/docs/ctokens#error-codes
        // emit MyLog("If this is not 0, there was an error", redeemResult);

        return true;
    }

    function getUserCompoundBalance(address _userAddress) public view returns(uint) {
        CEth cToken = CEth(0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e);
        return cToken.balanceOf(_userAddress) * cToken.exchangeRateStored() / 1e18;
    }

    function getCompoundBalance() public view returns(uint) {
        CEth cToken = CEth(0xd6801a1DfFCd0a410336Ef88DeF4320D6DF1883e);
        return cToken.balanceOf(address(this)) * cToken.exchangeRateStored() / 1e18;
    }

    function getContractBalance() public view returns(uint){
        return(address(this).balance);
    }

    // This is needed to receive ETH when calling `redeemCEth`
    receive() external payable {}
}
