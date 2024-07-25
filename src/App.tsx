import React, { useState, useEffect } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Aptos, Account, Ed25519PrivateKey, U64 } from "@aptos-labs/ts-sdk";
import Header from "./components/Header";
import Hero from "./components/Hero";
import WalletConnection from "./components/WalletConnection";
import GameSection from "./components/GameSection";
import RedeemModal from "./components/RedeemModal";
import goodimg from "../src/assets/good.jpg";
import evilimg from "../src/assets/evil.jpg";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import "./App.css";

interface Range {
  min: number;
  max: number;
}

interface NFTItem {
  title: string;
  price: number;
  Image: string;
  keywords: string;
  negative: string;
  id: number;
}

export const aptos = new Aptos();
export const moduleAddress =
  "d7e864c4e6350c95955ad62eaacfc53f19eaa1ee2c197a7f9b36284c363889a8";

const getFaBalance = async (
  ownerAddress: string,
  assetType: string
): Promise<number> => {
  const data = await aptos.getCurrentFungibleAssetBalances({
    options: {
      where: {
        owner_address: { _eq: ownerAddress },
        asset_type: { _eq: assetType },
      },
    },
  });
  return data[0]?.amount ?? 0;
};

const privateKey = new Ed25519PrivateKey(
  "0xc18a9a158cc0ccfe95798f526cfb9b4ee07ade0f0216d9434d02fb8dc3f56bb0"
);

const admin = Account.fromPrivateKey({ privateKey });

const App: React.FC = () => {
  const [range, setRange] = useState<Range>({ min: 1, max: 10 });
  const [guesses, setGuesses] = useState<string>("1");
  const [cost, setCost] = useState<number>(0);
  const [result, setResult] = useState<string | null>(null);
  const [win, setWin] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const [showGame, setShowGame] = useState<boolean>(false);
  const { account, connected } = useWallet();
  const token =
    "0x65735cb9546ca07af21f4bef98ca581e30c3bdedf32c2a5d6c5e1419e95dee53";

  useEffect(() => {
    const guessArray = guesses.split(",").map(Number);
    const totalCost = guessArray.length;
    setCost(totalCost);
    console.log(win);
  }, [guesses]);

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

  async function mintCoin(admin: Account, receiver: string, amount: number): Promise<string> {
    const transaction = await aptos.transaction.build.simple({
      sender: admin.accountAddress,
      data: {
        function: `${moduleAddress}::tele_point::mint`,
        functionArguments: [receiver, amount],
      },
    });

    const senderAuthenticator = await aptos.transaction.sign({ signer: admin, transaction });
    const pendingTxn = await aptos.transaction.submit.simple({ transaction, senderAuthenticator });

    return pendingTxn.hash;
  }

  async function transferCoin(
    admin: Account,
    fromAddress: string,
    toAddress: string,
    amount: number,
  ): Promise<string> {
    const transaction = await aptos.transaction.build.simple({
      sender: admin.accountAddress,
      data: {
        function: `${admin.accountAddress}::tele_point::transfer`,
        functionArguments: [fromAddress, toAddress, amount],
      },
    });

    const senderAuthenticator = await aptos.transaction.sign({ signer: admin, transaction });
    const pendingTxn = await aptos.transaction.submit.simple({ transaction, senderAuthenticator });

    return pendingTxn.hash;
  }

  const start_movelette = async (
    min: number,
    max: number,
    data: U64[],
    amt: number,
    winning_amt: number
  ) => {
    if (!account) return [];
    const serializer = new Serializer();
    const movevector = new MoveVector<U64>(data);
    movevector.serialize(serializer);
    const transaction = await aptos.transaction.build.simple({
      sender: admin.accountAddress,
      data: {
        function: `${moduleAddress}::tele_point::winner_decision`,
        functionArguments: [
          account.address,
          min,
          max,
          movevector,
          amt,
          winning_amt,
        ],
      },
    });
    try {
      const senderAuthenticator = await aptos.transaction.sign({
        signer: admin,
        transaction,
      });
      const response = await aptos.transaction.submit.simple({
        transaction,
        senderAuthenticator,
      });
      await aptos.waitForTransaction({ transactionHash: response.hash });
    } catch (error: any) {
      console.error(error);
    } finally {
      const oldbalance = balance;
      const newbalance = await getFaBalance(account.address, token);
      setBalance(newbalance / 100000000);
      setWin(newbalance !== oldbalance * 100000000 - amt);
      setResult(
        `Result: ${newbalance !== oldbalance * 100000000 - amt ? "Win" : "Lose"
        }`
      );
    }
  };

  const nftData: NFTItem[] = [
    { title: "Good Pack", price: 30, Image: goodimg, id: 1, negative: "Evil Expression, Scowl, Frown, No beard,Sarcastic Smile,blurry images", keywords: "Cartoon, Exagerated,Handsome, Beautiful, Detailed Animation, Animated, No Background, Black Background, Happy, Long hair, Always bearded" },
    { title: "Evil Pack", price: 30, Image: evilimg, id: 2, negative: "Good Expression, Smile, blurry images", keywords: "Evil ,Cartoon, Exagerated,Handsome, Beautiful, Detailed Animation, Animated, No Background, Black Background, Happy, Long hair, Always bearded, Sarcastic smile" },
  ];

  const mint_nftpack = (amt: number, prompt: string, negative_prompt: string) => {
    var data = {
      action: "Add Sticker",
      prompt: prompt,
      wallet: account?.address,
      negative_prompt: negative_prompt,
    };
    // Transfer TELE to admin.walleadress
    handletokenTransfer(amt);
    window.Telegram.WebApp.sendData(JSON.stringify(data));
  };

  useEffect(() => {
    if (window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
    }
  }, []);

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRange((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleGuessesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGuesses(e.target.value);
  };

  const handleSubmit = () => {
    const guessArray = guesses.split(",").map(Number);
    const u64_guessArray = guessArray.map((item) => new U64(item));
    const len = guessArray.length;
    const amt = len * 10 * 10000000;
    const winamt =
      (range.max - range.min + 1 - guessArray.length) * 10 * 10000000;
    start_movelette(range.min, range.max, u64_guessArray, amt, winamt);
  };

  const handleMintToken = async () => {
    if (account) {
      mintCoin(admin, account?.address, 100 * 100000000);
      const newbalance = await getFaBalance(account.address, token);
      setBalance(newbalance / 100000000);
    }
  };

  const handletokenTransfer = async (amt: number) => {
    if (account) {
      transferCoin(admin, account?.address, admin.accountAddress.toString(), amt * 100000000);
      const newbalance = await getFaBalance(account.address, token);
      setBalance(newbalance / 100000000);
    }
  };

  const handleRedeemClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleGetStarted = () => {
    setShowGame(true);
  };

  return (
    <div className="landing-page">
      <Header />
      {!showGame ? (
        <Hero onGetStarted={handleGetStarted} />
      ) : (
        <div className="game-section">
          <WalletConnection
            balance={balance}
            onRedeemClick={handleRedeemClick}
            onMintToken={handleMintToken}
          />
          {connected && (
            <GameSection
              balance={balance}
              onSubmit={start_movelette}
            />
          )}
          {showModal && (
            <RedeemModal
              balance={balance}
              nftData={nftData}
              onClose={handleCloseModal}
              onMint={mint_nftpack}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default App;