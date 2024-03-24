// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.7;

contract UniqueFrontendIntegrationContract {

    address payable public walletAddress;
    uint256 public balance;

    enum TransactionType { Deposit, Withdrawal }

    struct TransactionRecord {
        uint256 timestamp;
        address userAddress;
        uint256 amount;
        TransactionType transactionType;
    }

    TransactionRecord[] public transactionHistory;

    event AddressDisplayed(address walletAddress);
    event FundsDeposited(uint256 depositValue, uint256 updatedBalance);
    event FundsWithdrawn(uint256 withdrawalValue, uint256 updatedBalance);

    constructor(uint256 initialBalance) {
        balance = initialBalance;
        walletAddress = payable(msg.sender);
    }

    function getBalance() public view returns(uint256) {
        return balance;
    }

    function displayAddress() public payable {
        emit AddressDisplayed(walletAddress);
    }

    function depositFunds(uint256 depositValue) public payable {
        balance += depositValue;
        emit FundsDeposited(depositValue, balance);
        recordTransaction(depositValue, TransactionType.Deposit);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawalAmount);

    function withdrawFunds(uint256 withdrawalValue) public payable {
        if (balance < withdrawalValue) {
            revert InsufficientBalance({
                balance: balance,
                withdrawalAmount: withdrawalValue
            });
        }
        balance -= withdrawalValue;
        emit FundsWithdrawn(withdrawalValue, balance);
        recordTransaction(withdrawalValue, TransactionType.Withdrawal);
    }

    function recordTransaction(uint256 amount, TransactionType transactionType) private {
        TransactionRecord memory transaction;
        transaction.timestamp = block.timestamp;
        transaction.userAddress = msg.sender;
        transaction.amount = amount;
        transaction.transactionType = transactionType;
        transactionHistory.push(transaction);
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionHistory.length;
    }

    function getTransactionDetails(uint256 index) public view returns (
        uint256 timestamp,
        address userAddress,
        uint256 amount,
        string memory transactionTypeName
    ) {
        require(index < transactionHistory.length, "Invalid index");
        TransactionRecord storage transaction = transactionHistory[index];
        string memory typeName = transaction.transactionType == TransactionType.Deposit ? "Deposit" : "Withdrawal";
        return (transaction.timestamp, transaction.userAddress, transaction.amount, typeName);
    }
}
