import React, { useState } from 'react';
import RedeemModal from '../components/RedeemModal';
import goodimg from "../assets/good.jpg";
import evilimg from "../assets/evil.jpg";
import { useNavigate } from 'react-router-dom';

interface RedeemPageProps {
  balance: number;
}

const RedeemPage: React.FC<RedeemPageProps> = ({ balance }) => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();

  const nftData = [
    { title: "Good Pack", price: 30, Image: goodimg, id: 1, negative: "Evil Expression, Scowl, Frown, No beard,Sarcastic Smile,blurry images", keywords: "Cartoon, Exagerated,Handsome, Beautiful, Detailed Animation, Animated, No Background, Black Background, Happy, Long hair, Always bearded" },
    { title: "Evil Pack", price: 30, Image: evilimg, id: 2, negative: "Good Expression, Smile, blurry images", keywords: "Evil ,Cartoon, Exagerated,Handsome, Beautiful, Detailed Animation, Animated, No Background, Black Background, Happy, Long hair, Always bearded, Sarcastic smile" },
  ];

  const handleMint = (price: number, keywords: string, negative: string) => {
    // Implement minting logic here
    console.log(`Minting: Price ${price}, Keywords: ${keywords}, Negative: ${negative}`);
  };

  const handleClose = () => {
    setShowModal(false);
    navigate('/');
  };

  return (
    <div>
      <h1>Redeem Page</h1>
      {showModal && (
        <RedeemModal
          balance={balance}
          nftData={nftData}
          onClose={handleClose}
          onMint={handleMint}
        />
      )}
    </div>
  );
};

export default RedeemPage;