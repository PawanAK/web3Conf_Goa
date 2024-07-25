import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import Header from "./components/Header";
import RedeemPage from "./pages/RedeemPage";
import { getFaBalance } from "./utils/aptos";
import "./App.css";

const App: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const { account, connected } = useWallet();
  const token = "0x65735cb9546ca07af21f4bef98ca581e30c3bdedf32c2a5d6c5e1419e95dee53";

  useEffect(() => {
    const fetchBalance = async () => {
      if (account) {
        const balance = await getFaBalance(account.address, token);
        setBalance(balance / 100000000);
      }
    };

    if (connected) {
      fetchBalance();
    }
  }, [account, connected]);

  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={
            <div className="flex flex-col items-center justify-center mt-8">
              {!connected ? (
                <WalletSelector />
              ) : (
                <>
                  <p>Wallet Address: {account?.address ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}` : "No Address"}</p>
                  <p>Balance: $TELE {balance.toFixed(2)}</p>
                  <Link to="/redeem" className="bg-yellow-500 text-white py-2 px-4 rounded mt-4">
                    Redeem
                  </Link>
                </>
              )}
            </div>
          } />
          <Route path="/redeem" element={<RedeemPage balance={balance} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;