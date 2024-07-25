import React from 'react';
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

interface WalletConnectionProps {
  balance: number;
  onRedeemClick: () => void;
  onMintToken: () => void;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({ balance, onRedeemClick, onMintToken }) => {
  const { account, connected } = useWallet();

  if (!connected) {
    return (
      <div className="flex justify-center mb-4">
        <WalletSelector />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center mb-4">
      <button
        className="bg-blue-500 text-white py-2 px-4 rounded mb-2"
        onClick={() => {
          if (account?.address) {
            navigator.clipboard.writeText(account.address);
          } else {
            console.error("No address available to copy.");
          }
        }}>
        {account?.address
          ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
          : "No Address"}
      </button>
      <div className="text-black text-center mb-2">
        <p>Balance: $TELE {balance.toFixed(2)}</p>
      </div>
      <button
        onClick={onRedeemClick}
        className="bg-yellow-500 text-white py-2 px-4 rounded mb-2">
        Redeem
      </button>
      <button
        onClick={onMintToken}
        className="bg-green-500 text-white py-2 px-4 rounded mb-2">
        Buy $TELE Tokens
      </button>
    </div>
  );
};

export default WalletConnection;
