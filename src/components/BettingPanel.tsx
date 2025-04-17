import { useState, useEffect } from 'react';
import { LineSelection, CreditMultiplier } from '@/types/game';
import { LINE_SELECTIONS, CREDIT_MULTIPLIERS } from '@/utils/betConfig';
import * as Tooltip from '@radix-ui/react-tooltip';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface BettingPanelProps {
  balance: number;
  onBetChange: (totalBet: number, selectedLines: number[]) => void;
  disabled: boolean;
  isWinning?: boolean;
  onLinePreview?: (lines: number[]) => void;
}

export const BettingPanel = ({ balance, onBetChange, disabled, isWinning = false, onLinePreview }: BettingPanelProps) => {
  const [selectedLines, setSelectedLines] = useState<LineSelection>(LINE_SELECTIONS[0]);
  const [selectedMultiplier, setSelectedMultiplier] = useState<CreditMultiplier>(CREDIT_MULTIPLIERS[0]);
  const [totalBet, setTotalBet] = useState(0);
  const [estimatedBets, setEstimatedBets] = useState<number | typeof Infinity>(0);
  const [displayedBalance, setDisplayedBalance] = useState(balance);
  const [winAmount, setWinAmount] = useState(0);

  useEffect(() => {
    if (isWinning) {
      const difference = balance - displayedBalance;
      setWinAmount(difference);
      
      // Animate the balance increase
      const duration = 1000; // 1 second
      const frameRate = 60;
      const totalFrames = Math.round(duration / (1000 / frameRate));
      const increment = difference / totalFrames;

      let currentFrame = 0;
      const interval = setInterval(() => {
        currentFrame++;
        const nextValue = displayedBalance + increment * currentFrame;

        if (currentFrame >= totalFrames) {
          setDisplayedBalance(balance);
          clearInterval(interval);
        } else {
          setDisplayedBalance(nextValue);
        }
      }, 1000 / frameRate);

      return () => clearInterval(interval);
    } else {
      setDisplayedBalance(balance);
    }
  }, [balance, isWinning]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'bn';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };

  useEffect(() => {
    const newTotalBet = selectedLines.lines.length * selectedMultiplier.value;
    setTotalBet(newTotalBet);
    setEstimatedBets(newTotalBet === 0 ? Infinity : Math.floor(balance / newTotalBet));
    onBetChange(newTotalBet, selectedLines.lines);
  }, [selectedLines, selectedMultiplier, balance, onBetChange]);

  const showSpinZeroTooltip = estimatedBets === 0 && totalBet > 0;

  const handleLineHover = (lines: number[]) => {
    onLinePreview?.(lines);
  };

  const handleLineLeave = () => {
    onLinePreview?.([]);
  };

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-6 w-full">
      {/* Balance, Total Bet, and Bet Estimate */}
      <div className="grid grid-cols-3 gap-2 w-full">
        <motion.div 
          className={`bg-black/50 backdrop-blur-sm rounded-none p-2 border ${
            isWinning ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'border-red-500/30'
          }`}
          initial={{ scale: 1 }}
          animate={isWinning ? { scale: [1, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-slate-400 text-[10px] sm:text-xs font-press-start">Balance</div>
          <div className={`text-sm sm:text-base font-semibold font-press-start flex items-center gap-1 ${
            isWinning ? 'text-yellow-400' : 'text-white'
          }`}>
            <Coins className={`w-4 h-4 ${isWinning ? 'text-yellow-400' : 'text-red-400'}`} />
            {formatNumber(displayedBalance)}
            {isWinning && winAmount > 0 && (
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute -top-6 right-0 text-yellow-400 text-sm font-press-start"
              >
                +{formatNumber(winAmount)}
              </motion.span>
            )}
          </div>
        </motion.div>
        <div className="bg-black/50 backdrop-blur-sm rounded-none p-2 border border-red-500/30">
          <div className="text-slate-400 text-[10px] sm:text-xs font-press-start">Total Bet</div>
          <div className="text-white text-sm sm:text-base font-semibold font-press-start">{formatNumber(totalBet)}</div>
        </div>
        <Tooltip.Provider>
          <Tooltip.Root delayDuration={100}>
            <Tooltip.Trigger asChild>
              <div className={`bg-black/50 backdrop-blur-sm rounded-none p-2 border border-red-500/30 ${showSpinZeroTooltip ? 'cursor-help' : ''}`}>
                <div className="text-slate-400 text-[10px] sm:text-xs font-press-start">Spins Left</div>
                <div className={`text-white text-sm sm:text-base font-semibold font-press-start ${showSpinZeroTooltip ? 'text-red-400/70' : ''}`}>
                  { estimatedBets === Infinity ? '∞' : estimatedBets }
                </div>
              </div>
            </Tooltip.Trigger>
            {showSpinZeroTooltip && (
              <Tooltip.Portal>
                <Tooltip.Content
                  className="bg-black/90 backdrop-blur-sm text-white px-3 py-2 rounded-none text-xs sm:text-sm border-2 border-red-500/50 shadow-lg"
                  sideOffset={5}
                >
                  Adjust bet or top up
                  <Tooltip.Arrow className="fill-black" />
                </Tooltip.Content>
              </Tooltip.Portal>
            )}
          </Tooltip.Root>
        </Tooltip.Provider>
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
                      onMouseEnter={() => handleLineHover(option.lines)}
                      onMouseLeave={handleLineLeave}
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
          <div className="flex items-center justify-center text-xs sm:text-sm font-medium text-red-400 font-press-start gap-x-1.5">
            <img 
              src="/images/fuel-logo.png" 
              alt="" 
              className="w-4 h-4"
            />
            <span>/ Line</span>
          </div>
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
    </div>
  );
}; 