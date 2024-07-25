import React from 'react';

interface NFTItem {
  title: string;
  price: number;
  Image: string;
  keywords: string;
  negative: string;
  id: number;
}

interface RedeemModalProps {
  balance: number;
  nftData: NFTItem[];
  onClose: () => void;
  onMint: (price: number, keywords: string, negative: string) => void;
}

const RedeemModal: React.FC<RedeemModalProps> = ({ balance, nftData, onClose, onMint }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-2/3 arcade-modal">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Redeem Through Stickers
        </h2>
        <div className="flex justify-between items-center mb-4">
          <p>Balance: $TELE {balance.toFixed(2)}</p>
          <button className="bg-green-500 text-white py-2 px-4 rounded">
            Order!
          </button>
        </div>
        <div className="flex justify-center space-x-4">
          {nftData.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center bg-gray-200 p-4 rounded-lg arcade-item">
              <img
                src={item.Image}
                alt={item.title}
                className="w-32 h-32 mb-2"
              />
              <p className="text-lg">
                {item.title} - $TELE {item.price}
              </p>
              <button
                onClick={() => onMint(item.price, item.keywords, item.negative)}
                className="mt-2 bg-yellow-500 text-white py-2 px-4 rounded arcade-button">
                Mint
              </button>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-red-500 text-white py-2 px-4 rounded arcade-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default RedeemModal;