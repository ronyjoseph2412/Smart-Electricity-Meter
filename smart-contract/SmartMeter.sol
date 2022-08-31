contract SmartMeter is ChainlinkClient{
    struct User{
        uint wallet;
        uint incentives;
        uint units;
        uint amount_to_pay;
        uint[] allUnits;
        uint[] payments;
        uint[] timestamps;
    }

    function setPricePerUnit(uint _price_in_wei) public{
        price = Set price of one unit
    }

    function requestUnitsData(string memory _path) public{
        units = request units consumed by user from API
    }

    function payBill(string memory _user) public{
        // Chainlink
        requestUnitsData(_user);

        // Set User Data
        current_user = msg.sender;
        amount_to_pay = units*price_per_unit;
        if(wallet>0){
            amount_to_pay -= mapUser[msg.sender].wallet;
            wallet = 0;
        }
        if(incentives>=500){
            amount_to_pay -= incentives;
            incentives = 0;
        }
        if(amount_to_pay>=msg.value){
            amount_to_pay = amount_to_pay-msg.value;
        }
        if(amount_to_pay<msg.value){
            wallet = msg.value-amount_to_pay;
            amount_to_pay = 0;
        }
        payments.push(msg.value);
        timestamps.push(block.timestamp);
        ContractBalanceWithoutCompound += msg.value;

        // Compound
        Send ETH to Compound using mint function
    }

    function redeemCETH() private returns (bool) {
        uint balance = cToken.balanceOf(address(this));
        cToken.redeem(balance);
        return true;
    }

    function transferETH() public{
        require(msg.sender == contract_owner);
        redeemCETH();
        contract_owner.transfer(address(this).balance);
    }

    function getUserData(address _user) public{
        return Struct User;
    }
}