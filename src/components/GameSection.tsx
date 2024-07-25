import React, { useState, ChangeEvent } from 'react';
import { U64 } from "@aptos-labs/ts-sdk";

interface GameSectionProps {
  balance: number;
  onSubmit: (min: number, max: number, guessArray: U64[], amt: number, winamt: number) => void;
}

const GameSection: React.FC<GameSectionProps> = ({ balance, onSubmit }) => {
  const [range, setRange] = useState<{ min: number; max: number }>({ min: 1, max: 10 });
  const [guesses, setGuesses] = useState<string>("1");
  const [cost, setCost] = useState<number>(0);
  const [result, setResult] = useState<string | null>(null);

  const handleRangeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRange((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  const handleGuessesChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGuesses(e.target.value);
    const guessArray = e.target.value.split(",").map(Number);
    setCost(guessArray.length);
  };

  const handleSubmit = () => {
    const guessArray = guesses.split(",").map(Number);
    const u64_guessArray = guessArray.map((item) => new U64(item));
    const len = guessArray.length;
    const amt = len * 10 * 10000000;
    const winamt = (range.max - range.min + 1 - guessArray.length) * 10 * 10000000;
    onSubmit(range.min, range.max, u64_guessArray, amt, winamt);
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4 text-center">Move-Lette</h1>
      <div className="flex mb-4">
        <input
          type="number"
          name="min"
          value={range.min}
          onChange={handleRangeChange}
          className="border p-2 mr-2 w-full arcade-input"
        />
        <span className="self-center">to</span>
        <input
          type="number"
          name="max"
          value={range.max}
          onChange={handleRangeChange}
          className="border p-2 ml-2 w-full arcade-input"
        />
      </div>
      <input
        type="text"
        value={guesses}
        onChange={handleGuessesChange}
        placeholder="Enter your guesses (e.g., 1,4,5)"
        className="border p-2 w-full mb-4 arcade-input"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4 w-full arcade-button">
        Set Range & Start
      </button>
      <div className="text-center mb-4 arcade-info">
        <p>Cost = {cost} $TELE</p>
        <p>
          Winning Chance = {guesses.split(",").length}/
          {range.max - range.min + 1} ={" "}
          {(
            guesses.split(",").length /
            (range.max - range.min + 1)
          ).toFixed(1)}
        </p>
        <p>
          Potential Win:{" "}
          {(range.max - range.min + 1 - guesses.split(",").length) * 1}{" "}
          $TELE
        </p>
      </div>
      {result && (
        <div className="text-xl font-bold mb-4 text-center arcade-result">
          <p>{result}</p>
        </div>
      )}
    </>
  );
};

export default GameSection;
