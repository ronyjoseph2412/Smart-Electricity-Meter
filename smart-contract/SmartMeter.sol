// SPDX-License-Identifier: None
pragma solidity 0.8.7;

import '@chainlink/contracts/src/v0.8/ChainlinkClient.sol';

interface cETH {
    function mint() external payable;
    function exchangeRateCurrent() external returns (uint256);
    function supplyRatePerBlock() external returns (uint256);
    function redeem(uint) external returns (uint);
    function redeemUnderlying(uint) external returns (uint);
    function exchangeRateStored() external view returns (uint); 
    function balanceOf(address owner) external view returns (uint balance);
}

contract SmartElectricity is ChainlinkClient{
    using Chainlink for Chainlink.Request;
    event RequestUnits(bytes32 indexed requestId, uint256 units);
    event MyLog(string, uint256);

    bytes32 private jobId;
    uint256 private fee;

    address payable public contract_owner;
    address payable public government;
    address current_user;

    uint ContractBalanceWithoutCompound;
    uint price_per_unit;

    cETH cToken = cETH(0x64078a6189Bf45f80091c6Ff2fCEe1B15Ac8dbde); // Goerli

    struct User{
        uint wallet;
        uint incentives;
        uint units;
        uint amount_to_pay;
        uint[] allUnits;
        uint[] payments;
        uint[] timestamps;
    }

    mapping(address=>User) mapUser;
    mapping(address=>address) mapUnitsUser;
    
    constructor(){
        contract_owner = payable(msg.sender);
        government = payable(0xbDdBd8eA4A33C3bcb7451c9a2e14DaE571cD25dA);
        setChainlinkToken(0x326C977E6efc84E512bB9C30f76E30c160eD06FB);
        setChainlinkOracle(0xCC79157eb46F5624204f47AB42b3906cAA40eaB7);
        jobId = 'ca98366cc7314957b8c012c72f05aeeb';
        fee = (1 * LINK_DIVISIBILITY) / 10;
    }

    // Set Price per Unit
    function setPricePerUnit(uint _price_in_wei) public{
        price_per_unit = _price_in_wei;
    }

    // Chainlink
    function requestUnitsData(string memory _path) public returns (bytes32 requestId) {
        current_user = msg.sender;
        Chainlink.Request memory req = buildChainlinkRequest(jobId, address(this), this.fulfill.selector);
        req.add('get', 'https://calm-garters-eel.cyclic.app/');
        req.add('path', _path);
        int256 timesAmount = 1;
        req.addInt('times', timesAmount);
        return (sendChainlinkRequest(req, fee));
    }

    function fulfill(bytes32 _requestId, uint256 _units) public recordChainlinkFulfillment(_requestId) {
        emit RequestUnits(_requestId, _units);
        mapUser[current_user].units = _units;
        mapUser[current_user].allUnits.push(_units);
        mapUser[current_user].amount_to_pay = mapUser[current_user].units*price_per_unit;
    }

    function withdrawLink() public {
        require(msg.sender == contract_owner);
        LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
        require(link.transfer(msg.sender, link.balanceOf(address(this))), 'Unable to transfer');
    }

    // Compound
    function payBill(string memory _user) public payable returns(bool){
        // Chainlink
        requestUnitsData(_user);

        // Set User Data
        current_user = msg.sender;
        mapUser[msg.sender].amount_to_pay = mapUser[msg.sender].units*price_per_unit;
        if(mapUser[msg.sender].wallet>0){
            mapUser[msg.sender].amount_to_pay -= mapUser[msg.sender].wallet;
            mapUser[msg.sender].wallet = 0;
        }
        if(mapUser[msg.sender].incentives>=500){
            mapUser[msg.sender].amount_to_pay -= mapUser[msg.sender].incentives;
            mapUser[msg.sender].incentives = 0;
        }
        if(mapUser[msg.sender].amount_to_pay>=msg.value){
            mapUser[msg.sender].amount_to_pay = mapUser[msg.sender].amount_to_pay-msg.value;
        }
        if(mapUser[msg.sender].amount_to_pay<msg.value){
            mapUser[msg.sender].wallet = msg.value-mapUser[msg.sender].amount_to_pay;
            mapUser[msg.sender].amount_to_pay = 0;
        }
        mapUser[msg.sender].payments.push(msg.value);
        mapUser[msg.sender].timestamps.push(block.timestamp);
        ContractBalanceWithoutCompound += msg.value;

        // Compound
        uint256 exchangeRateMantissa = cToken.exchangeRateCurrent();
        emit MyLog("Exchange Rate (scaled up by 1e18): ", exchangeRateMantissa);
        uint256 supplyRateMantissa = cToken.supplyRatePerBlock();
        emit MyLog("Supply Rate: (scaled up by 1e18)", supplyRateMantissa);
        cToken.mint{ value: msg.value, gas: 250000 }();
        return true;
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

    // Get User Data
    function getUserData(address _user) public view returns(uint,uint,uint,uint,uint[] memory,uint[] memory,uint[] memory){
        return (mapUser[_user].wallet,mapUser[_user].incentives,mapUser[_user].units,mapUser[_user].amount_to_pay,mapUser[_user].allUnits,mapUser[_user].payments,mapUser[_user].timestamps);
    }

    // Get Balance
    function getGovernmentBalance() public view returns(uint){
        return ContractBalanceWithoutCompound;
    }

    function getContractBalance() public view returns(uint){
        return address(this).balance;
    }

    function getUserCompoundBalance(address _userAddress) public view returns(uint) {
        return cToken.balanceOf(_userAddress) * cToken.exchangeRateStored() / 1e18;
    }

    function getCompoundBalance() public view returns(uint) {
        return cToken.balanceOf(address(this)) * cToken.exchangeRateStored() / 1e18;
    }

    receive() external payable {}
}
