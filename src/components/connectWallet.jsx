import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { useNavigate, useLocation } from "react-router-dom";

const ConnectWallet = () => {
  const [account, setAccount] = useState(() =>
    localStorage.getItem("metamaskAccount")
  );
  const [web3, setWeb3] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

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
    } else {
      setError("MetaMask is not installed. Please install MetaMask.");
    }
  }, []);

  useEffect(() => {
    // Check if already connected and on login page
    if (localStorage.getItem("metamaskAccount") && location.pathname === "/") {
      navigate("/posts", { replace: true });
    }
  }, [navigate, location]);

  const connectWallet = async () => {
    if (web3) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(accounts[0]);
        localStorage.setItem("metamaskAccount", accounts[0]);
        setError("");
        navigate("/posts", { replace: true }); // Use replace instead of push
      } catch (err) {
        console.error("Error connecting to MetaMask:", err);
        setError("Failed to connect wallet.");
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    localStorage.removeItem("metamaskAccount");
  };

  const shortenAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-3">
      {account ? (
        <div className="w-full p-3 bg-gradient-to-r from-purple-600 to-pink-400 ">
          <div className="bg-white/10 backdrop-blur-sm  p-2 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-pink-400 animate-pulse"></div>
              <span className="text-white text-sm font-medium">
                {shortenAddress(account)}
              </span>
            </div>
            <button
              onClick={disconnectWallet}
              className="text-white/80 hover:text-white text-sm transition-colors cursor-pointer"
            >
              Disconnect
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={connectWallet}
          className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-pink-400 text-white cursor-pointer  font-medium shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
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
      {error && (
        <div className="w-full p-3 bg-red-50 border border-red-200 ">
          <p className="text-red-600 text-sm text-center">{error}</p>
        </div>
      )}
    </div>
  );
};

export default ConnectWallet;
