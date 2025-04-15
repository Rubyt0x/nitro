import { useState, useCallback, useEffect } from 'react';
import { Reel } from './Reel';
import { BettingPanel } from '@/components/BettingPanel';
import { ResultMatrix, Symbol } from '@/types/game';
import { generateResultMatrix } from '@/utils/symbols';
import { evaluateWin } from '@/utils/winEvaluator';
import * as Toast from '@radix-ui/react-toast';
import * as Dialog from '@radix-ui/react-dialog';

export const SlotMachine = () => {
  const [balance, setBalance] = useState(100);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<ResultMatrix>([
    ['🍀', '🍋', '🍒'],
    ['🍋', '🔔', '🍀'],
    ['🍒', '🍀', '🍋']
  ]);
  const [lastWin, setLastWin] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [totalBet, setTotalBet] = useState(0);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [jackpotPool, setJackpotPool] = useState(0);
  const [isPulsing, setIsPulsing] = useState(false);

  useEffect(() => {
    if (jackpotPool > 1000) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [jackpotPool]);

  const handleBetChange = (newTotalBet: number, newSelectedLines: number[]) => {
    setTotalBet(newTotalBet);
    setSelectedLines(newSelectedLines);
  };

  const handleSpin = useCallback(() => {
    if (spinning || balance < totalBet) return;

    setSpinning(true);
    setBalance(prev => prev - totalBet);
    
    // Add 10% of the bet to the jackpot pool
    const jackpotContribution = Math.floor(totalBet * 0.1);
    setJackpotPool(prev => prev + jackpotContribution);
    
    const newResult = generateResultMatrix();
    setResult(newResult);
    
    setTimeout(() => {
      const winResult = evaluateWin(newResult, selectedLines, totalBet / selectedLines.length);
      if (winResult.winnings > 0) {
        setBalance(prev => prev + winResult.winnings);
        setLastWin(winResult.winnings);
      } else {
        setLastWin(0);
      }
      setSpinning(false);
      
      if (balance - totalBet <= 0 && winResult.winnings === 0) {
        setShowResetDialog(true);
      }
    }, 2500);
  }, [spinning, balance, totalBet, selectedLines]);

  const resetGame = () => {
    setBalance(100);
    setLastWin(0);
    setShowResetDialog(false);
    setTotalBet(0);
    setJackpotPool(0);
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-6 md:px-8 bg-gradient-to-br from-red-900 via-black to-red-950">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col items-center">
        {/* Jackpot Pool Display */}
        <div className={`bg-black/90 backdrop-blur-sm rounded-none p-3 sm:p-4 mb-4 w-full border-2 border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.3)] relative overflow-hidden
          ${isPulsing ? 'animate-pulse' : ''}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 animate-shimmer"></div>
          <div className="relative">
            <div className="text-center">
              <div className="text-xs sm:text-sm font-medium text-red-400 mb-1 font-press-start tracking-wider">JACKPOT POOL</div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white font-press-start tracking-wider">
                {jackpotPool.toLocaleString()} <span className="text-red-400 text-sm sm:text-base font-press-start">credits</span>
              </div>
              {jackpotPool > 1000 && (
                <div className="text-xs sm:text-sm text-red-400 mt-2 font-press-start animate-bounce">
                  🎰 MEGA JACKPOT! 🎰
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-black/80 backdrop-blur-sm rounded-none p-4 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(255,0,0,0.3)] border-2 border-red-500/50 w-full">
          {/* Reels Container */}
          <div className={`flex justify-center items-center gap-2 sm:gap-3 bg-black/90 backdrop-blur-sm p-3 sm:p-4 md:p-6 rounded-none border-2 border-red-500/30 shadow-[0_0_10px_rgba(255,0,0,0.2)] transition-all duration-300 ${
            spinning ? 'shadow-[0_0_20px_rgba(255,0,0,0.5)]' : ''
          }`}>
            {[0, 1, 2].map(i => (
              <div key={i} className="flex-1 basis-1/3 max-w-[80px] sm:max-w-[100px] md:max-w-[120px] flex justify-center">
                <Reel
                  finalSymbols={result[i]}
                  spinning={spinning}
                  delay={i * 0.2}
                />
              </div>
            ))}
          </div>

          {/* Betting Panel */}
          <div className="mt-4 sm:mt-6 md:mt-8">
            <BettingPanel
              balance={balance}
              onBetChange={handleBetChange}
              disabled={spinning}
            />
          </div>

          {/* Spin Button */}
          <button
            onClick={handleSpin}
            disabled={spinning || balance < totalBet}
            className={`w-full mt-4 sm:mt-6 px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-none font-bold text-sm sm:text-base transition-all duration-200 font-press-start
              ${spinning || balance < totalBet
                ? 'bg-red-900/30 text-white/50 cursor-not-allowed border-2 border-red-500/20 backdrop-blur-sm'
                : 'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-[0_0_10px_rgba(255,0,0,0.3)] border-2 border-red-500/50 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]'
              }`}
          >
            SPIN
          </button>
        </div>

        {/* Toast Notifications */}
        <Toast.Provider>
          <Toast.Root
            open={lastWin > 0}
            onOpenChange={() => setLastWin(0)}
            className="bg-black/90 backdrop-blur-sm text-white p-3 sm:p-4 rounded-none shadow-[0_0_10px_rgba(255,0,0,0.3)] border-2 border-red-500/50 flex items-center gap-2 text-sm sm:text-base font-press-start"
          >
            <div className="text-lg sm:text-xl md:text-2xl">
              {lastWin >= 100 ? '🎰' : '🎉'}
            </div>
            <Toast.Title className="font-medium">
              {lastWin >= 100 
                ? `JACKPOT! You won ${lastWin.toLocaleString()} credits!`
                : `You won ${lastWin.toLocaleString()} credits!`}
            </Toast.Title>
          </Toast.Root>
          <Toast.Viewport className="fixed bottom-4 right-4" />
        </Toast.Provider>

        {/* Game Over Dialog */}
        <Dialog.Root open={showResetDialog} onOpenChange={setShowResetDialog}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm p-4 sm:p-6 rounded-none shadow-[0_0_15px_rgba(255,0,0,0.3)] border-2 border-red-500/50 w-[90vw] max-w-sm sm:max-w-md">
              <Dialog.Title className="text-base sm:text-lg md:text-xl font-medium text-white mb-2 sm:mb-3 md:mb-4 font-press-start">
                Game Over
              </Dialog.Title>
              <Dialog.Description className="text-red-400/70 mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base font-press-start">
                You've run out of credits. Would you like to play again?
              </Dialog.Description>
              <div className="flex justify-end gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={resetGame}
                  className="px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-none hover:from-red-700 hover:to-red-900 transition-all duration-200 text-sm sm:text-base border-2 border-red-500/50 font-press-start"
                >
                  Play Again
                </button>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>
    </div>
  );
};