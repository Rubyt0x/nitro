import { useState, useCallback, useEffect } from 'react';
import { Reel } from './Reel';
import { BettingPanel } from '@/components/BettingPanel';
import { ResultMatrix, Symbol as SymbolType, LineWin } from '@/types/game';
import { generateResultMatrix } from '@/utils/symbols';
import { evaluateWin, WIN_LINES } from '@/utils/winEvaluator';
import * as Toast from '@radix-ui/react-toast';
import * as Dialog from '@radix-ui/react-dialog';
import { WinningBook } from './WinningBook';
import { BookOpen, Coins } from 'lucide-react';

export const SlotMachine = () => {
  const [balance, setBalance] = useState(100);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<ResultMatrix>([
    ['🔥', '💣', '🪓'],
    ['💣', '🔔', '🔥'],
    ['🪓', '🔥', '💣']
  ]);
  const [lastWin, setLastWin] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [showWinningCombinations, setShowWinningCombinations] = useState(false);
  const [showGameRules, setShowGameRules] = useState(false);
  const [totalBet, setTotalBet] = useState(0);
  const [selectedLines, setSelectedLines] = useState<number[]>([]);
  const [jackpotPool, setJackpotPool] = useState(0.00);
  const [isPulsing, setIsPulsing] = useState(false);
  const [winningSymbols, setWinningSymbols] = useState<{ symbol: SymbolType; lineIndex: number }[]>([]);
  const [winningLines, setWinningLines] = useState<LineWin[]>([]);
  const [winningCoordinates, setWinningCoordinates] = useState<[number, number][]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

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
    if (isSpinning || balance < totalBet) return;

    setIsSpinning(true);
    setWinningSymbols([]);
    setWinningLines([]);
    setWinningCoordinates([]);
    setBalance(prev => prev - totalBet);
    
    // Add 10% of the bet to the jackpot pool
    const jackpotContribution = Number((totalBet * 0.1).toFixed(2));
    setJackpotPool(prev => Number((prev + jackpotContribution).toFixed(2)));
    
    const newResult = generateResultMatrix();
    setResult(newResult);
    
    setTimeout(() => {
      const winResult = evaluateWin(newResult, selectedLines, totalBet / selectedLines.length);
      if (winResult.winnings > 0) {
        setBalance(prev => prev + winResult.winnings);
        setLastWin(winResult.winnings);
        
        // Extract winning symbols with line indices for Reel animation state
        const symbolsForAnim = winResult.lines.map(line => ({
          symbol: line.symbol,
          lineIndex: line.lineIndex
        }));
        setWinningSymbols(symbolsForAnim);

        // Store the detailed winning line info
        setWinningLines(winResult.lines);

        // Calculate and store exact winning coordinates
        const coords: [number, number][] = [];
        winResult.lines.forEach(line => {
          // Explicitly type lineCoords as an array of [number, number] tuples
          const lineCoords: [number, number][] = WIN_LINES[line.lineIndex]; 
          lineCoords.forEach(([row, col]) => { // Destructuring should now be correctly typed
            // Ensure coordinate isn't already added from another winning line
            if (!coords.some(c => c[0] === col && c[1] === row)) {
              coords.push([col, row]);
            }
          });
        });
        setWinningCoordinates(coords);

      } else {
        setLastWin(0);
      }
      setIsSpinning(false);
      
      if (balance - totalBet <= 0 && winResult.winnings === 0) {
        setShowResetDialog(true);
      }
    }, 2500);
  }, [isSpinning, balance, totalBet, selectedLines]);

  const resetGame = () => {
    setBalance(100);
    setLastWin(0);
    setShowResetDialog(false);
    setTotalBet(0);
    setJackpotPool(0);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  const handleConnectWallet = () => {
    console.log("Connect wallet clicked");
    setIsConnected(true);
    setWalletAddress("0x123...abc");
  };

  const handleDisconnectWallet = () => {
    console.log("Disconnect wallet clicked");
    setIsConnected(false);
    setWalletAddress(null);
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-3 sm:px-6 md:px-8 bg-gradient-to-br from-red-900 via-black to-red-950">
      <div className="w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col items-center py-2 sm:py-12 md:py-16">
        
        {/* Title and Connect Wallet Row */}
        <div className="w-full flex flex-col sm:flex-row items-center sm:items-center justify-between gap-1.5 sm:gap-4 mb-2 sm:mb-4">
          {/* Main Title - Box Layout */}
          <div className="w-full sm:w-auto h-9 sm:h-10 border-2 border-red-500/50 bg-black/80 shadow-[0_0_10px_rgba(255,0,0,0.3)] flex items-center">
            <div className="h-full p-1.5 sm:p-2 border-r-2 border-red-500/50 flex items-center">
              <span role="img" aria-label="Slot Machine" className="text-base sm:text-xl">🎰</span>
            </div>
            <h1 className="flex-1 px-1.5 sm:px-3 py-1.5 sm:py-2 text-[10px] sm:text-base font-press-start text-red-500 text-center shadow-text-glow uppercase whitespace-nowrap">
              FUEL NITRO RUSH
            </h1>
            <div className="h-full p-1.5 sm:p-2 border-l-2 border-red-500/50 flex items-center">
              <span role="img" aria-label="Slot Machine" className="text-base sm:text-xl">🎰</span>
            </div>
          </div>

          {/* Connect Wallet Button */}
          {isConnected ? (
            <button 
              onClick={handleDisconnectWallet}
              className="w-full sm:w-auto h-9 sm:h-10 px-2 sm:px-3 bg-black/70 text-red-400 border-2 border-red-500/50 rounded-none font-press-start text-xs hover:bg-black/90 hover:border-red-500 transition-colors truncate max-w-[150px] flex items-center justify-center"
              title={`Connected: ${walletAddress}`}
            >
              {walletAddress ? `${walletAddress.substring(0, 5)}...${walletAddress.substring(walletAddress.length - 3)}` : 'Connected'}
            </button>
          ) : (
            <button 
              onClick={handleConnectWallet}
              className="w-full sm:w-auto h-9 sm:h-10 px-2 sm:px-3 bg-black/70 text-red-400 border-2 border-red-500/50 rounded-none font-press-start text-xs hover:bg-black/90 hover:border-red-500 transition-colors flex items-center justify-center"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {/* Jackpot Pool Display */}
        <div className="relative w-full mb-2 sm:mb-4">
          <div className={`bg-black/90 backdrop-blur-sm rounded-none p-1.5 sm:p-3 w-full border-2 border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.3)] relative overflow-hidden
            ${isPulsing ? 'animate-pulse' : ''}`}>
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 animate-shimmer"></div>
            <div className="relative flex items-center">
              <div className="p-1.5 sm:p-3 border-r-2 border-red-500/50 flex items-center justify-center">
                <span className="text-xl sm:text-3xl md:text-4xl">⛽️</span>
              </div>
              <div className="flex-1 px-1.5 sm:px-3 py-1 sm:py-2">
                <div className="text-[10px] sm:text-sm font-medium text-red-400 mb-0.5 sm:mb-1 font-press-start tracking-wider">JACKPOT</div>
                <div className="text-base sm:text-2xl md:text-3xl font-bold text-white font-press-start tracking-wider">
                  {formatNumber(jackpotPool)} <span className="text-red-400 text-[10px] sm:text-sm font-press-start">FUEL</span>
                </div>
                {jackpotPool > 1000 && (
                  <div className="text-[10px] sm:text-sm text-red-400 mt-0.5 sm:mt-1.5 font-press-start animate-bounce">
                    🎰 MEGA JACKPOT! 🎰
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Paytable Icon Button */}
          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 flex items-center gap-1">
            <button
              onClick={() => setShowWinningCombinations(true)}
              className="p-0.5 sm:p-1 bg-black/50 text-red-400/70 rounded-sm border border-red-500/20 hover:bg-black/70 hover:text-red-400 transition-colors"
              title="Winning Combinations"
            >
              <Coins size={12} className="sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setShowGameRules(true)}
              className="p-0.5 sm:p-1 bg-black/50 text-red-400/70 rounded-sm border border-red-500/20 hover:bg-black/70 hover:text-red-400 transition-colors"
              title="Game Rules"
            >
              <BookOpen size={12} className="sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="bg-black/80 backdrop-blur-sm rounded-none p-3 sm:p-6 md:p-8 shadow-[0_0_15px_rgba(255,0,0,0.3)] border-2 border-red-500/50 w-full">
          {/* Reels Container */}
          <div className="relative flex justify-center py-1 sm:py-2">
            <div className="w-fit mx-auto flex gap-[3px] p-[4px] border border-red-500 bg-black/30 shadow-[inset_0_0_10px_#991b1b] relative">
              {/* Subtle stroke effect */}
              <div className="absolute inset-0 border border-red-500/20" />
              {/* Depth layers */}
              <div className="absolute inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-red-500/5" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent" />
              {/* Outer glow */}
              <div className="absolute -inset-1 bg-red-500/10 blur-sm" />
              {[0, 1, 2].map(colIndex => {
                // Filter coordinates for the current reel
                const reelWinningCoords = winningCoordinates
                  .filter(([col, row]) => col === colIndex)
                  .map(([col, row]) => row); // Pass only the row index

                return (
                  <div key={colIndex} className="w-[72px] h-[216px] overflow-hidden flex flex-col">
                    <Reel
                      finalSymbols={result[colIndex]}
                      spinning={isSpinning}
                      delay={colIndex * 0.2}
                      // Pass the winning row indices for this specific reel
                      winningPositions={reelWinningCoords}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Betting Panel */}
          <div className="mt-2 sm:mt-8 md:mt-10">
            <BettingPanel
              balance={balance}
              onBetChange={handleBetChange}
              disabled={isSpinning}
            />
          </div>

          {/* Spin Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || balance < totalBet}
            className={`w-full mt-2 sm:mt-6 px-3 sm:px-6 md:px-8 py-1.5 sm:py-3 md:py-4 rounded-none font-bold text-xs sm:text-base transition-all duration-200 font-press-start
              ${isSpinning || balance < totalBet
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
            className="bg-black/90 backdrop-blur-sm text-white p-3 sm:p-4 rounded-none shadow-[0_0_10px_rgba(255,0,0,0.3)] border-2 border-red-500/50 flex flex-col gap-2 text-sm sm:text-base font-press-start"
          >
            <div className="flex items-center gap-2">
              <div className="text-lg sm:text-xl md:text-2xl">
                {/* Check if any winning line involves the jackpot symbol ⛽️ and meets jackpot conditions */} 
                {winningLines.some(line => line.symbol === '⛽️') && lastWin >= 100 ? '🎰' : '🎉'} 
              </div>
              <Toast.Title className="font-medium">
                {winningLines.some(line => line.symbol === '⛽️') && lastWin >= 100 
                  ? `JACKPOT! You won ${lastWin.toLocaleString()} FUEL!`
                  : `You won ${lastWin.toLocaleString()} FUEL!`}
              </Toast.Title>
            </div>
            {winningLines.length > 0 && (
              <div className="text-xs text-red-400/70">
                {winningLines.length > 1 ? 'Multiple winning lines!' : 'Winning line!'}
                {winningLines.map((line, index) => (
                  <div key={index} className="mt-1">
                    Line #{line.lineIndex + 1}: {line.symbol} x{line.multiplier}
                  </div>
                ))}
              </div>
            )}
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
                You've run out of FUEL. Would you like to play again?
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

        {/* Winning Combinations Dialog */}
        <WinningBook
          open={showWinningCombinations}
          onOpenChange={setShowWinningCombinations}
          type="combinations"
        />

        {/* Game Rules Dialog */}
        <WinningBook
          open={showGameRules}
          onOpenChange={setShowGameRules}
          type="rules"
        />
      </div>
    </div>
  );
};