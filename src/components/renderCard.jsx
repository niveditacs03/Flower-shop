import React, { useState, useEffect } from "react";
import Card from "./card";
import flowersData from "../data";
import Web3 from "web3";

const RenderCard = () => {
  const [cartItems, setCartItems] = useState([]);
  const [availableFlowers, setAvailableFlowers] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState("");
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    const initWeb3 = async () => {
      if (typeof window.ethereum !== "undefined") {
        try {
          const web3Instance = new Web3(window.ethereum);
          setWeb3(web3Instance);

          const connectedAccount = localStorage.getItem("metamaskAccount");
          if (connectedAccount) {
            setAccount(connectedAccount);

            const accounts = await web3Instance.eth.getAccounts();
            if (!accounts.includes(connectedAccount)) {
              setAccount(null);
              localStorage.removeItem("metamaskAccount");
            }
          }

          window.ethereum.on("accountsChanged", (accounts) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              localStorage.setItem("metamaskAccount", accounts[0]);
            } else {
              setAccount(null);
              localStorage.removeItem("metamaskAccount");
              setError("Wallet disconnected");
            }
          });

          window.ethereum.on("chainChanged", () => {
            window.location.reload();
          });
        } catch (err) {
          console.error("Error initializing web3:", err);
          setError("Failed to initialize Web3");
        }
      } else {
        setError("MetaMask is not installed. Please install MetaMask.");
      }
    };

    initWeb3();

    const storedAvailable = localStorage.getItem("availableFlowers");
    if (storedAvailable) {
      setAvailableFlowers(JSON.parse(storedAvailable));
    } else {
      localStorage.setItem("availableFlowers", JSON.stringify(flowersData));
      setAvailableFlowers(flowersData);
    }
  }, []);

  const connectWallet = async () => {
    if (!web3) {
      setError("Web3 not initialized");
      return;
    }

    try {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0xaa36a7",
                  chainName: "Sepolia Testnet",
                  rpcUrls: ["https://rpc.sepolia.org"],
                  nativeCurrency: {
                    name: "SepoliaETH",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.etherscan.io"],
                },
              ],
            });
          } catch (addError) {
            setError("Failed to add Sepolia testnet.");
            return;
          }
        } else {
          setError("Please switch to Sepolia network in MetaMask.");
          return;
        }
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAccount(accounts[0]);
      localStorage.setItem("metamaskAccount", accounts[0]);
      setError("");
    } catch (err) {
      console.error("Connection error:", err);
      setError("Failed to connect wallet: " + err.message);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    localStorage.removeItem("metamaskAccount");
  };

  const toggleCart = (flower) => {
    setCartItems((prev) =>
      prev.some((item) => item.id === flower.id)
        ? prev.filter((item) => item.id !== flower.id)
        : [...prev, flower]
    );
  };

  const handleCheckout = async () => {
    if (!web3 || !account) {
      setError("Please connect your wallet first");
      return;
    }
  
    if (cartItems.length === 0) {
      setError("No flowers added to cart");
      return;
    }
  
    // Calculate total ETH as a float
    const totalEth = cartItems.reduce((sum, flower) => {
      const flowerPrice = typeof flower.price === 'string' 
        ? parseFloat(flower.price) 
        : flower.price;
      return sum + flowerPrice;
    }, 0);
  
    console.log("Total ETH to send:", totalEth);
  
    if (totalEth <= 0) {
      setError("Invalid total amount");
      return;
    }
  
    setIsProcessing(true);
    setError("");
  
    try {
      const merchantAddress = "0x097ac8d3149A4C75f955c97f4726f208435C1268";
      
      // Convert the total directly to wei as a string to preserve precision
      const totalWei = web3.utils.toWei(totalEth.toFixed(6).toString(), 'ether');

      console.log("Total Wei to send:", totalWei);
      
      // Check balance first
      const balance = await web3.eth.getBalance(account);
      console.log("Wallet balance (Wei):", balance);
      
      if (BigInt(balance) < BigInt(totalWei)) {
        throw new Error("Insufficient funds in your wallet");
      }
      
      // Estimate gas instead of using a fixed amount
      const gasEstimate = await web3.eth.estimateGas({
        from: account,
        to: merchantAddress,
        value: totalWei
      }).catch(error => {
        console.error("Gas estimation failed:", error);
        // Default to a higher gas limit if estimation fails
        return 100000;
      });
      
      console.log("Estimated gas:", gasEstimate);
      
      // Add 20% buffer to gas estimate
      const gasLimit = Math.ceil(Number(gasEstimate) * 1.2);
      
      const txParams = {
        from: account,
        to: merchantAddress,
        value: web3.utils.toHex(totalWei),
        gas: web3.utils.toHex(gasLimit)
      };
      
      console.log("Transaction parameters:", txParams);
      
      const result = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
  
      console.log("Transaction submitted:", result);
      setTxHash(result);
      setCartItems([]);
  
    } catch (err) {
      console.error("Checkout error:", err);
      setError(`Transaction failed: ${err.message}`);

    } finally {
      setIsProcessing(false);
    }
  };
  const resetShop = () => {
    setAvailableFlowers(flowersData);
    setCartItems([]);
    localStorage.setItem("availableFlowers", JSON.stringify(flowersData));
  };

  const shortenAddress = (address) => {
    return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";
  };
  return (
    <div className="bg-purple-50 text-gray-800 font-sans min-h-screen relative overflow-hidden -mt-110">
      <main className="p-8">
        {/* Top Bar with Connect Wallet Button */}
        <div className="flex justify-end items-center mb-10 -mt-5">
          {account ? (
            <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-400 inline-flex items-center space-x-2 rounded">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm font-medium">
                {shortenAddress(account)}
              </span>
              <button
                onClick={disconnectWallet}
                className="text-white/80 hover:text-white text-sm transition-colors cursor-pointer ml-2"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <button
              onClick={connectWallet}
              className="py-2 px-4 bg-gradient-to-r from-purple-600 to-pink-400 text-white cursor-pointer font-medium shadow-md hover:bg-pink-500 transition-colors flex items-center rounded space-x-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span>Connect Wallet</span>
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="w-full p-3 bg-red-50 border border-red-200 mb-6">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Transaction Success Message */}
        {txHash && (
          <div className="w-full p-3 bg-green-50 border border-green-200 mb-6">
            <p className="text-green-600 text-sm text-center">
              Transaction successful! Hash: {txHash.substring(0, 10)}...
              <a
                href={`https://sepolia.etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline ml-1"
              >
                View on Etherscan
              </a>
            </p>
          </div>
        )}

        {/* 💫 Floating Reset Button */}
        <div className="fixed bottom-24 right-6 z-40">
          <button
            className="bg-pink-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-pink-700 transition-all font-semibold"
            onClick={resetShop}
          >
            Reset Shop 🔄
          </button>
        </div>

        {/* 💫 Floating Show Cart Button */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            className="bg-purple-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-all font-semibold"
            onClick={() => setShowCart((prev) => !prev)}
          >
            {showCart ? "Hide Cart ❌" : "Show Cart 🛒"}
          </button>
        </div>

        <div className="flex flex-wrap justify-center">
          {availableFlowers.map((flower) => (
            <Card
              key={flower.id}
              {...flower}
              isAdded={cartItems.some((item) => item.id === flower.id)}
              toggleItem={() => toggleCart(flower)}
              handleBuyNow={() => {
                toggleCart(flower);
                setShowCart(true);
              }}
            />
          ))}
        </div>
      </main>

      {/* 🛒 Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 w-72 h-full bg-white shadow-xl z-50 p-6 overflow-y-auto transform transition-transform duration-300 ${
          showCart ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <button
          onClick={() => setShowCart(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-lg font-bold mb-4 border-b pb-2">🛒 Your Cart</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-500">No flowers in cart</p>
        ) : (
          <>
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center mb-4 border-b pb-2"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-12 h-12 rounded object-cover mr-3"
                />
                <div>
                  <p className="font-semibold text-sm">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.price}ETH</p>
                </div>
                <button
                  onClick={() => toggleCart(item)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </div>
            ))}

            {/* 💸 Total and Checkout */}
            <div className="mt-6 border-t pt-4">
              <p className="font-semibold text-base mb-4">
                Total:{" "}
                {cartItems
                  .reduce((sum, flower) => sum + flower.price, 0)}{" "}
                ETH
              </p>

              <button
                className={`w-full py-2 rounded-full font-semibold ${
                  isProcessing || !account
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-800"
                } text-white transition-all`}
                onClick={handleCheckout}
                disabled={isProcessing || !account}
              >
                {isProcessing
                  ? "Processing..."
                  : !account
                  ? "Connect Wallet First"
                  : "Checkout Now 💸"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RenderCard;
