import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css"


function App() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  const contractAddress = "0x5Bed726e150Be27784e219cdE4A6A8F940D45d9e"; 
  const contractABI = [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "initialBalance",
          "type": "uint256"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "balance",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "withdrawalAmount",
          "type": "uint256"
        }
      ],
      "name": "InsufficientBalance",
      "type": "error"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "address",
          "name": "walletAddress",
          "type": "address"
        }
      ],
      "name": "AddressDisplayed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "depositValue",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "updatedBalance",
          "type": "uint256"
        }
      ],
      "name": "FundsDeposited",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "withdrawalValue",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "updatedBalance",
          "type": "uint256"
        }
      ],
      "name": "FundsWithdrawn",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "balance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "depositValue",
          "type": "uint256"
        }
      ],
      "name": "depositFunds",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "displayAddress",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getBalance",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTransactionCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "index",
          "type": "uint256"
        }
      ],
      "name": "getTransactionDetails",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "transactionTypeName",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "transactionHistory",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "timestamp",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "userAddress",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        },
        {
          "internalType": "enum UniqueFrontendIntegrationContract.TransactionType",
          "name": "transactionType",
          "type": "uint8"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "walletAddress",
      "outputs": [
        {
          "internalType": "address payable",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "withdrawalValue",
          "type": "uint256"
        }
      ],
      "name": "withdrawFunds",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
  ];

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const connectedAccount = await signer.getAddress();
        setAccount(connectedAccount);

        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        setContract(contract);

        updateBalance();
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      console.error("MetaMask not found");
    }
  };

  const [formattedBalance, setFormattedBalance] = useState("0");

  const updateBalance = async () => {
    if (contract) {
      const newBalance = await contract.getBalance();
      setBalance(newBalance);
      setFormattedBalance(ethers.utils.formatEther(newBalance));
    }
  };

  const depositFunds = async () => {
    if (contract) {
      const tx = await contract.depositFunds(ethers.utils.parseEther("1.0")); // Deposit 1 Ether
      await tx.wait();
      updateBalance();
    }
  };

  const withdrawFunds = async () => {
    if (contract) {
      const tx = await contract.withdrawFunds(ethers.utils.parseEther("1.0")); // Withdraw 1 Ether
      await tx.wait();
      updateBalance();
    }
  };

  const getTransactions = async () => {
    if (contract) {
      try {
        const transactionCount = await contract.getTransactionCount();
        const transactionList = [];

        for (let i = 0; i < transactionCount; i++) {
          const transactionDetails = await contract.getTransactionDetails(i);
          transactionList.push({
            timestamp: new Date(transactionDetails.timestamp * 1000),
            userAddress: transactionDetails.userAddress,
            amount: ethers.utils.formatEther(transactionDetails.amount),
            type: transactionDetails.transactionTypeName,
          });
        }

        setTransactions(transactionList);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
  };

  return (
    <div className="App">
       
      <header className="App-header">
    
        <h1>MetaBank</h1>
        {account ? (
          <div className="main">
            <p>Connected Account: <span>{account}</span> </p>
            <p>Contract Address: <span>{contractAddress}</span> </p>
            <p>Balance: <span>{ethers.utils.formatEther(balance)}</span>  ETH</p>
            <button onClick={depositFunds}>Deposit 1 ETH</button>
            <button onClick={withdrawFunds}>Withdraw 1 ETH</button>
            <button onClick={getTransactions}>Get Transactions</button>
            <div className="transactions">
              <h2>Transaction List</h2>
              <ul className="list">
                {transactions.map((tx, index) => (
                  <li key={index} className="list-items">
                    <p>Timestamp: <span className="item">{tx.timestamp.toString()}</span> </p>
                    <p>User Address: <span>{tx.userAddress}</span></p>
                    <p>Amount: <span>{tx.amount}</span>  ETH</p>
                    <p>Type: <span>{tx.type}</span></p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}
      </header>
    </div>
  );
}

export default App;
