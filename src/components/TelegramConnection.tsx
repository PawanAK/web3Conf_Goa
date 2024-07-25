import React, { useState } from 'react';
import { saveTelegramConnection } from '../utils/telegramConnection';

interface TelegramConnectionProps {
  walletAddress: string;
}

const TelegramConnection: React.FC<TelegramConnectionProps> = ({ walletAddress }) => {
  const [telegramId, setTelegramId] = useState('');

  const handleConnect = async () => {
    if (telegramId && walletAddress) {
      await saveTelegramConnection(telegramId, walletAddress);
      alert('Telegram ID and wallet address have been saved!');
    } else {
      alert('Please enter your Telegram ID and connect your wallet first.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-4">
      <input
        type="text"
        value={telegramId}
        onChange={(e) => setTelegramId(e.target.value)}
        placeholder="Enter your Telegram ID"
        className="border p-2 rounded mb-2"
      />
      <button
        onClick={handleConnect}
        className="bg-blue-500 text-white py-2 px-4 rounded"
      >
        Connect Telegram
      </button>
    </div>
  );
};

export default TelegramConnection;
