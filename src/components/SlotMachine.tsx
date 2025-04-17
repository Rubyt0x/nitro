import { useState, useEffect, useRef } from 'react';
import { Reel } from './Reel';
import { BettingPanel } from '@/components/BettingPanel';
import { ResultMatrix, Symbol as SymbolType, LineWin } from '@/types/game';
import { generateResultMatrix, getSymbolConfig } from '@/utils/symbols';
import { evaluateWin, WIN_LINES } from '@/utils/winEvaluator';
import * as Dialog from '@radix-ui/react-dialog';
import { WinningBook } from './WinningBook';
import { BookOpen, Coins, Volume2, VolumeX } from 'lucide-react';
import { initSounds, playSound, stopSound, playWinSound, toggleMute, getMuteState } from '../utils/soundManager';
import { AnimatedBalance } from './AnimatedBalance';
import { JackpotDisplay } from './JackpotDisplay';
import { motion, AnimatePresence } from 'framer-motion';

const SymbolConfetti = ({ symbol, index }: { symbol: string; index: number }) => {
  const randomX = Math.random() * 200 - 100; // Wider spread: -100vw to 100vw
  const randomDelay = Math.random() * 1.2; // Longer max delay for more natural effect
  const randomDuration = 1.8 + Math.random() * 1.2; // Duration between 1.8s and 3s
  const startY = -20 - Math.random() * 80; // Higher starting point
  const randomScale = 0.6 + Math.random() * 0.8; // Random size between 0.6 and 1.4

  return (
    <motion.div
      className="absolute text-2xl sm:text-3xl md:text-4xl pointer-events-none"
      initial={{ 
        opacity: 0,
        scale: 0,
        x: `${randomX}vw`,
        y: startY,
        rotate: Math.random() * 360 - 180 // Random initial rotation
      }}
      animate={{ 
        opacity: [0, 1, 1, 0],
        scale: [0.2, randomScale, randomScale, 0.6],
        y: ['0vh', '120vh'],
        rotate: Math.random() * 720 - 360 // Random rotation amount
      }}
      transition={{
        duration: randomDuration,
        delay: randomDelay,
        ease: "easeOut",
        times: [0, 0.2, 0.8, 1]
      }}
    >
      {symbol}
    </motion.div>
  );
};

interface Position {
  col: number; // 0, 1, or 2
  row: number; // 0, 1, or 2
}

// Mapping of line numbers to their paths on the 3x3 grid
const WIN_LINE_PATHS: Record<number, Position[]> = {
  1: [{ col: 0, row: 1 }, { col: 1, row: 1 }, { col: 2, row: 1 }], // Middle horizontal
  2: [{ col: 0, row: 0 }, { col: 1, row: 0 }, { col: 2, row: 0 }], // Top horizontal
  3: [{ col: 0, row: 2 }, { col: 1, row: 2 }, { col: 2, row: 2 }], // Bottom horizontal
  4: [{ col: 0, row: 0 }, { col: 1, row: 1 }, { col: 2, row: 2 }], // Diagonal top-left to bottom-right
  5: [{ col: 0, row: 2 }, { col: 1, row: 1 }, { col: 2, row: 0 }], // Diagonal bottom-left to top-right
  6: [{ col: 0, row: 0 }, { col: 0, row: 1 }, { col: 0, row: 2 }], // Left vertical
  7: [{ col: 1, row: 0 }, { col: 1, row: 1 }, { col: 1, row: 2 }], // Middle vertical
  8: [{ col: 2, row: 0 }, { col: 2, row: 1 }, { col: 2, row: 2 }], // Right vertical
};

// Function remains simple: just return the path for a given line number
const getLinePositions = (line: number): Position[] => {
  return WIN_LINE_PATHS[line] || [];
};

interface LinePreviewProps {
  lines: number[]; // Now expects an array like [1, 2, 3] or [1, 2, 3, 4, 5]
  isVisible: boolean;
}

const LinePreview = ({ lines, isVisible }: LinePreviewProps) => {
  const CELL_SIZE = 72; // Matches SYMBOL_HEIGHT and Reel width
  const HALF_CELL = CELL_SIZE / 2;

  const getCenterCoords = (pos: Position) => ({
    x: pos.col * CELL_SIZE + HALF_CELL,
    y: pos.row * CELL_SIZE + HALF_CELL,
  });

  return (
    // Positioned absolutely within the reels container (w-fit)
    // Use top-1 left-1 to account for parent's p-[4px] padding
    <div className="absolute top-1 left-1 w-[216px] h-[216px] pointer-events-none z-10">
      <AnimatePresence>
        {isVisible && (
          <motion.svg
            key={`preview-lines-${lines.join('-')}`} // Unique key for the set of lines
            className="absolute inset-0 overflow-visible"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {lines.map((line) => {
              const positions = getLinePositions(line);
              if (positions.length < 2) return null;

              const pathData = positions.reduce((acc, pos, index) => {
                const { x, y } = getCenterCoords(pos);
                return index === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
              }, '');

              return (
                // Use a group <g> for each line within the single SVG
                <motion.g key={`line-${line}`}>
                  <motion.path
                    d={pathData}
                    stroke="rgba(239, 68, 68, 0.7)"
                    strokeWidth="4"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    exit={{ pathLength: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  />
                  {positions.map((pos, i) => {
                    const { x, y } = getCenterCoords(pos);
                    return (
                      <motion.circle
                        key={`point-${line}-${i}`}
                        cx={x}
                        cy={y}
                        r="6"
                        fill="rgba(239, 68, 68, 0.7)"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        transition={{ delay: i * 0.05, duration: 0.2 }}
                      />
                    );
                  })}
                </motion.g>
              );
            })}
          </motion.svg>
        )}
      </AnimatePresence>
    </div>
  );
};

export const SlotMachine = () => {
  const [balance, setBalance] = useState(10000);
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
  const [isMuted, setIsMuted] = useState(false);
  const [isWinning, setIsWinning] = useState(false);
  const animationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [winNotification, setWinNotification] = useState<{ message: string; amount: number } | undefined>();
  const [confettiSymbols, setConfettiSymbols] = useState<string[]>([]);
  const [previewLines, setPreviewLines] = useState<number[]>([]);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);

  useEffect(() => {
    if (jackpotPool > 1000) {
      setIsPulsing(true);
      const timer = setTimeout(() => setIsPulsing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [jackpotPool]);

  // Initialize sounds when component mounts
  useEffect(() => {
    initSounds();
    setIsMuted(getMuteState());
  }, []);

  const handleMuteToggle = () => {
    const newMuteState = toggleMute();
    setIsMuted(newMuteState);
  };

  const handleBetChange = (newTotalBet: number, newSelectedLines: number[]) => {
    setTotalBet(newTotalBet);
    setSelectedLines(newSelectedLines);
  };

  const handleSpin = async () => {
    if (isSpinning || animationIntervalRef.current !== null || balance < totalBet) return;

    setIsPreviewVisible(false); // Hide preview immediately on spin start

    try {
      setIsSpinning(true); // Set spinning ON
      setIsWinning(false);
      setConfettiSymbols([]); 
      playSound('spin');

      setWinningSymbols([]);
      setWinningLines([]);
      setWinningCoordinates([]);
      
      const newBalanceAfterBet = balance - totalBet;
      setBalance(newBalanceAfterBet);
      
      const jackpotContribution = Number((totalBet * 0.1).toFixed(2));
      setJackpotPool(prev => Number((prev + jackpotContribution).toFixed(2)));
      
      const newResult = generateResultMatrix();
      setResult(newResult); // Trigger reel animations
      
      // Use a separate function for timeout logic for clarity
      const handleSpinEnd = () => {
        try {
          const winResult = evaluateWin(newResult, selectedLines, totalBet / selectedLines.length);
          stopSound('spin');
          
          if (winResult.winnings > 0) {
            setIsWinning(true);
            setBalance(prev => prev + winResult.winnings); // Use functional update
            setLastWin(winResult.winnings);
            
            // Set win notification using 0-based index + 1 for display
            const winMessage = winResult.jackpot 
              ? "⛽️ JACKPOT HIT" 
              : `${winResult.lines[0].symbol} Line ${winResult.lines[0].lineIndex + 1}`;
            setWinNotification({
              message: winMessage,
              amount: winResult.winnings
            });

            // Create confetti symbols array
            const symbols = winResult.lines.reduce((acc: string[], line) => {
              const symbolCount = line.symbol === '⛽️' ? 25 : 15;
              return [...acc, ...Array(symbolCount).fill(line.symbol)];
            }, []);
            setConfettiSymbols(symbols);
            
            setWinningSymbols(winResult.lines.map(line => ({ symbol: line.symbol, lineIndex: line.lineIndex })));
            setWinningLines(winResult.lines);
            
            const coords: [number, number][] = [];
            winResult.lines.forEach(line => {
              // Use the 0-based line.lineIndex directly with WIN_LINES (now defined in winEvaluator.ts)
              const lineCoords = WIN_LINES[line.lineIndex]; 
              if (lineCoords) {
                lineCoords.forEach(([row, col]) => { // WIN_LINES uses [row, col]
                  const gridCoord: [number, number] = [col, row]; // Grid needs [col, row]
                  if (!coords.some(c => c[0] === gridCoord[0] && c[1] === gridCoord[1])) {
                    coords.push(gridCoord);
                  }
                });
              }
            });
            setWinningCoordinates(coords);

            // Play win sound
            const winningCombinations = winResult.lines.map(line => ({ symbol: line.symbol, count: 3 }));
            playWinSound(winningCombinations);

            // Reset winning state after animation
            setTimeout(() => {
              setIsWinning(false);
              setConfettiSymbols([]); // Clear confetti
            }, 2000);
          } else {
            setLastWin(0);
          }
          
          // Check for game over condition
          // Show dialog only if balance drops below the minimum possible bet (1 line * 100x = 100)
          const MINIMUM_POSSIBLE_BET = 100;
          setBalance(currentBalance => {
             if (currentBalance < MINIMUM_POSSIBLE_BET) {
               setShowResetDialog(true);
             }
             return currentBalance;
          });

        } catch (error) {
          console.error('Error during spin evaluation:', error);
          // Optionally handle error state here
        } finally {
          setIsSpinning(false); // Ensure spinning is set to false
        }
      };

      setTimeout(handleSpinEnd, 2500); // Spin duration

    } catch (error) {
      console.error('Error starting spin:', error);
      stopSound('spin');
      playSound('gameOver');
      setIsSpinning(false); // Also ensure spinning is false if initial try fails
    }
  };

  const resetGame = () => {
    setBalance(10000);
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
    setBalance(10000);
  };

  const handleDisconnectWallet = () => {
    console.log("Disconnect wallet clicked");
    setIsConnected(false);
    setWalletAddress(null);
    setBalance(0);
  };

  const handleLinePreview = (lines: number[]) => {
    setPreviewLines(lines);
    // Set visibility based on whether the lines array is empty or not
    setIsPreviewVisible(lines.length > 0);
  };

  return (
    <div className={`min-h-screen flex justify-center items-center px-3 sm:px-6 md:px-8 relative overflow-hidden`}>
      {/* Base gradient layer */}
      <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isSpinning 
          ? 'from-black via-black to-black opacity-100' 
          : 'from-red-900 via-black to-red-950 opacity-100'
      }`} />
      
      {/* Confetti Container - Adjusted z-index */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <AnimatePresence>
          {confettiSymbols.map((symbol, index) => (
            <SymbolConfetti key={`${index}-${symbol}`} symbol={symbol} index={index} />
          ))}
        </AnimatePresence>
      </div>
      
      {/* Animated overlay layer */}
      <div className={`absolute inset-0 transition-all duration-1500 ease-[cubic-bezier(0.4,0,0.2,1)] z-10 ${
        isSpinning 
          ? 'bg-black/80 backdrop-blur-sm' 
          : 'bg-transparent'
      }`} />
      
      {/* Pulsing glow effect */}
      <div className={`absolute inset-0 transition-all duration-1500 ease-[cubic-bezier(0.4,0,0.2,1)] z-20 ${
        isSpinning 
          ? 'bg-red-500/5 animate-pulse' 
          : 'bg-transparent'
      }`} />

      {/* Main content */}
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col items-center py-2 sm:py-12 md:py-16 z-30">
        
        {/* Top Controls Bar */}
        <div className="w-full flex items-center justify-between mb-2 sm:mb-4 px-1">
          {/* Game Controls (Left/Center) */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={handleMuteToggle}
              className="p-1.5 sm:p-2 border-2 border-red-500/50 bg-black/80 hover:bg-red-500/20 transition-colors rounded-none"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" /> : <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />}
            </button>
            <button
              onClick={() => setShowWinningCombinations(true)}
              className="p-1.5 sm:p-2 border-2 border-red-500/50 bg-black/80 hover:bg-red-500/20 transition-colors rounded-none"
              aria-label="Winning Combinations"
            >
              <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
            </button>
            <button
              onClick={() => setShowGameRules(true)}
              className="p-1.5 sm:p-2 border-2 border-red-500/50 bg-black/80 hover:bg-red-500/20 transition-colors rounded-none"
              aria-label="Game Rules"
            >
              <Coins className="w-3 h-3 sm:w-4 sm:h-4 text-red-400" />
            </button>
          </div>

          {/* Wallet Connection (Right) */}
          <div className="ml-2">
            {isConnected ? (
              <div className="relative group">
                <button
                  className="px-2 sm:px-3 py-1.5 bg-red-600 text-white text-[10px] sm:text-xs rounded-none hover:bg-red-700 transition-colors border-2 border-red-500/50 font-press-start flex items-center gap-1 sm:gap-2"
                >
                  <span>{walletAddress}</span>
                  <svg
                    className="w-2.5 h-2.5 sm:w-3 sm:h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-1 w-full bg-black/90 backdrop-blur-sm border-2 border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.3)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <button
                    onClick={handleDisconnectWallet}
                    className="w-full px-2 sm:px-3 py-1.5 text-red-400 text-[10px] sm:text-xs hover:bg-red-500/10 transition-colors font-press-start text-left"
                  >
                    Disconnect
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={handleConnectWallet}
                className="px-2 sm:px-3 py-1.5 bg-red-600 text-white text-[10px] sm:text-xs rounded-none hover:bg-red-700 transition-colors border-2 border-red-500/50 font-press-start"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>

        {/* Jackpot Display with Integrated Title */}
        <JackpotDisplay 
          title="FUEL NITRO RUSH"
          jackpotPool={jackpotPool} 
          winNotification={winNotification}
        />

        <div className={`bg-black/80 backdrop-blur-sm rounded-none p-3 sm:p-6 md:p-8 border-2 border-red-500/50 w-full relative overflow-hidden
          ${isSpinning ? 'animate-border-glow' : ''}`}>
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
              {/* Line Preview - Moved inside the reels container */}
              <LinePreview lines={previewLines} isVisible={isPreviewVisible} />
            </div>
          </div>

          {/* Betting Panel */}
          <div className="mt-2 sm:mt-8 md:mt-10">
            <BettingPanel
              balance={balance}
              onBetChange={handleBetChange}
              disabled={isSpinning || !isConnected}
              isWinning={isWinning}
              onLinePreview={handleLinePreview}
            />
          </div>

          {/* Spin Button */}
          <button
            onClick={handleSpin}
            disabled={isSpinning || balance < totalBet || !isConnected}
            className={`w-full mt-2 sm:mt-6 px-3 sm:px-6 md:px-8 py-1.5 sm:py-3 md:py-4 rounded-none font-bold text-xs sm:text-base transition-all duration-200 font-press-start
              ${isSpinning || balance < totalBet || !isConnected
                ? 'bg-red-900/30 text-white/50 cursor-not-allowed border-2 border-red-500/20 backdrop-blur-sm'
                : 'bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-[0_0_10px_rgba(255,0,0,0.3)] border-2 border-red-500/50 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]'
              }`}
          >
            {!isConnected ? 'CONNECT WALLET TO PLAY' : 'SPIN'}
          </button>
        </div>

        {/* Game Over Dialog */}
        <Dialog.Root open={showResetDialog} onOpenChange={setShowResetDialog}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm p-4 sm:p-6 rounded-none shadow-[0_0_15px_rgba(255,0,0,0.3)] border-2 border-red-500/50 w-[90vw] max-w-sm sm:max-w-md z-50">
              <Dialog.Title className="text-base sm:text-lg md:text-xl font-medium text-white mb-2 sm:mb-3 md:mb-4 font-press-start">
                Game Over
              </Dialog.Title>
              <Dialog.Description className="text-red-400/70 mb-3 sm:mb-4 md:mb-6 text-sm sm:text-base font-press-start">
                You've run out of FUEL. Top up your account to play again!
              </Dialog.Description>
              <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
                <button
                  onClick={() => window.open('https://app.fuel.network/bridge', '_blank')}
                  className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-none hover:from-red-700 hover:to-red-900 transition-all duration-200 text-sm sm:text-base border-2 border-red-500/50 font-press-start"
                >
                  Bridge to Fuel
                </button>
                <button
                  onClick={() => window.open('https://app.mira.ly', '_blank')}
                  className="w-full px-3 sm:px-4 py-2 bg-gradient-to-r from-red-600 to-red-800 text-white rounded-none hover:from-red-700 hover:to-red-900 transition-all duration-200 text-sm sm:text-base border-2 border-red-500/50 font-press-start"
                >
                  Swap to Fuel
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