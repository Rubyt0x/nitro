import { useState, useEffect } from 'react';
import { LineSelection, CreditMultiplier } from '@/types/game';
import { LINE_SELECTIONS, CREDIT_MULTIPLIERS } from '@/utils/betConfig';
import * as Tooltip from '@radix-ui/react-tooltip';

interface BettingPanelProps {
  balance: number;
  onBetChange: (totalBet: number, selectedLines: number[]) => void;
  disabled: boolean;
}

export const BettingPanel = ({ balance, onBetChange, disabled }: BettingPanelProps) => {
  const [selectedLines, setSelectedLines] = useState<LineSelection>(LINE_SELECTIONS[0]);
  const [selectedMultiplier, setSelectedMultiplier] = useState<CreditMultiplier>(CREDIT_MULTIPLIERS[0]);
  const [totalBet, setTotalBet] = useState(0);
  const [estimatedBets, setEstimatedBets] = useState(0);

  useEffect(() => {
    const newTotalBet = selectedLines.lines.length * selectedMultiplier.value;
    setTotalBet(newTotalBet);
    setEstimatedBets(Math.floor(balance / newTotalBet));
    onBetChange(newTotalBet, selectedLines.lines);
  }, [selectedLines, selectedMultiplier, balance]);

  const handleMaxRisk = () => {
    setSelectedLines(LINE_SELECTIONS[3]); // 8 lines
    setSelectedMultiplier(CREDIT_MULTIPLIERS[3]); // 10x
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
      {/* Balance and Total Bet */}
      <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full">
        <div className="flex flex-col items-center space-y-1 bg-black/90 backdrop-blur-sm p-3 sm:p-4 rounded-none border-2 border-red-500/30">
          <div className="text-xs sm:text-sm font-medium text-red-400 font-press-start">Balance</div>
          <div className="text-xl sm:text-2xl font-bold text-white font-press-start">
            {balance} <span className="text-red-400/70 text-xs sm:text-sm font-press-start">credits</span>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-1 bg-black/90 backdrop-blur-sm p-3 sm:p-4 rounded-none border-2 border-red-500/30">
          <div className="text-xs sm:text-sm font-medium text-red-400 font-press-start">Total Bet</div>
          <div className="text-xl sm:text-2xl font-bold text-white font-press-start">
            {totalBet} <span className="text-red-400/70 text-xs sm:text-sm font-press-start">credits</span>
          </div>
        </div>
      </div>

      {/* Bet Estimate */}
      <div className="bg-black/90 backdrop-blur-sm p-3 sm:p-4 rounded-none w-full text-center border-2 border-red-500/30">
        <div className="text-xs sm:text-sm text-red-400 mb-1 font-press-start">Bet Estimate</div>
        <div className="text-base sm:text-lg font-medium text-white font-press-start">
          You can make <span className="font-bold text-red-500 font-press-start">{estimatedBets}</span> bet{estimatedBets !== 1 ? 's' : ''} with current settings
        </div>
        {estimatedBets === 0 && (
          <div className="text-xs sm:text-sm text-red-500 mt-1">
            Not enough credits for this bet
          </div>
        )}
      </div>

      {/* Betting Controls */}
      <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full">
        {/* Line Selection */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-xs sm:text-sm font-medium text-red-400 font-press-start">Lines</div>
          <div className="grid grid-cols-2 gap-2 w-full">
            {LINE_SELECTIONS.map((option) => (
              <Tooltip.Provider key={option.label}>
                <Tooltip.Root>
                  <Tooltip.Trigger asChild>
                    <button
                      onClick={() => setSelectedLines(option)}
                      disabled={disabled}
                      className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-none text-xs sm:text-sm font-medium transition-all
                        ${selectedLines.label === option.label
                          ? 'bg-red-600/90 text-white border-2 border-red-500/50'
                          : 'bg-black/90 text-red-400 hover:bg-black/80 border-2 border-red-500/30'
                        }
                        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {option.label}
                    </button>
                  </Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      className="bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-none text-xs sm:text-sm border-2 border-red-500/50"
                      sideOffset={5}
                    >
                      {option.description}
                      <Tooltip.Arrow className="fill-black" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              </Tooltip.Provider>
            ))}
          </div>
        </div>

        {/* Credit Multiplier */}
        <div className="flex flex-col items-center space-y-2">
          <div className="text-xs sm:text-sm font-medium text-red-400 font-press-start">Credits per Line</div>
          <div className="grid grid-cols-2 gap-2 w-full">
            {CREDIT_MULTIPLIERS.map((multiplier) => (
              <button
                key={multiplier.value}
                onClick={() => setSelectedMultiplier(multiplier)}
                disabled={disabled}
                className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-none text-xs sm:text-sm font-medium transition-all
                  ${selectedMultiplier.value === multiplier.value
                    ? 'bg-red-600/90 text-white border-2 border-red-500/50'
                    : 'bg-black/90 text-red-400 hover:bg-black/80 border-2 border-red-500/30'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {multiplier.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Max Risk Button */}
      <button
        onClick={handleMaxRisk}
        disabled={disabled}
        className={`w-full px-3 sm:px-4 py-1.5 sm:py-2 rounded-none text-xs sm:text-sm font-medium transition-all
          ${disabled 
            ? 'opacity-50 cursor-not-allowed bg-black/90 text-red-400/50 border-2 border-red-500/20'
            : 'bg-black/90 text-red-400 hover:bg-black/80 border-2 border-red-500/30'
          }`}
      >
        Max Risk (8 Lines × 10x)
      </button>
    </div>
  );
}; 