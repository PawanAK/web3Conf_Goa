import React from 'react';

interface HeroProps {
  onGetStarted: () => void;
}

const Hero: React.FC<HeroProps> = ({ onGetStarted }) => {
  return (
    <section className="hero">
      <h1>Welcome to Move-Lette Arcade</h1>
      <p>Step into the future of gaming with decentralized technology!</p>
      <div className="arcade-instructions">
        <h2>How to Play</h2>
        <ol>
          <li>Buy $TELE tokens</li>
          <li>Play games to earn $TELE</li>
          <li>Use $TELE tokens to generate stickers</li>
        </ol>
      </div>
      <button className="cta-button" onClick={onGetStarted}>
        Get Started
      </button>
    </section>
  );
};

export default Hero;