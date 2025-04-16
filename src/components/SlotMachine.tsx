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

    try {
      setIsSpinning(true);
      setIsWinning(false);
      playSound('spin');

      setWinningSymbols([]);
      setWinningLines([]);
      setWinningCoordinates([]);
      
      const newBalanceAfterBet = balance - totalBet;
      setBalance(newBalanceAfterBet);
      
      const jackpotContribution = Number((totalBet * 0.1).toFixed(2));
      setJackpotPool(prev => Number((prev + jackpotContribution).toFixed(2)));
      
      const newResult = generateResultMatrix();
      setResult(newResult);
      
      setTimeout(() => {
        const winResult = evaluateWin(newResult, selectedLines, totalBet / selectedLines.length);
        stopSound('spin');
        
        if (winResult.winnings > 0) {
          setIsWinning(true);
          setBalance(prev => prev + winResult.winnings);
          setLastWin(winResult.winnings);
          
          // Set win notification
          const winMessage = winResult.jackpot 
            ? "⛽️ JACKPOT HIT" 
            : `${winResult.lines[0].symbol} Line ${winResult.lines[0].lineIndex + 1}`;
          setWinNotification({
            message: winMessage,
            amount: winResult.winnings
          });
          
          const symbolsForAnim = winResult.lines.map(line => ({
            symbol: line.symbol,
            lineIndex: line.lineIndex
          }));
          setWinningSymbols(symbolsForAnim);

          setWinningLines(winResult.lines);

          const coords: [number, number][] = [];
          winResult.lines.forEach(line => {
            const lineCoords: [number, number][] = WIN_LINES[line.lineIndex]; 
            if (lineCoords) {
              lineCoords.forEach(([row, col]) => {
                const gridCoord: [number, number] = [col, row]; 
                if (!coords.some(c => c[0] === gridCoord[0] && c[1] === gridCoord[1])) {
                  coords.push(gridCoord);
                }
              });
            }
          });
          setWinningCoordinates(coords);

          const winningCombinations = winResult.lines.map(line => ({
            symbol: line.symbol,
            count: 3 
          }));
          playWinSound(winningCombinations);

          // Reset winning state after animation
          setTimeout(() => {
            setIsWinning(false);
          }, 2000);
        } else {
          setLastWin(0);
        }
        setIsSpinning(false);
        
        if (balance - totalBet <= 0 && winResult.winnings === 0) {
          setShowResetDialog(true);
        }
      }, 2500);
    } catch (error) {
      console.error('Error during spin:', error);
      stopSound('spin');
      playSound('gameOver');
      setIsSpinning(false);
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

  return (
    <div className={`min-h-screen flex justify-center items-center px-3 sm:px-6 md:px-8 relative overflow-hidden`}>
      {/* Base gradient layer */}
      <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-1500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isSpinning 
          ? 'from-black via-black to-black opacity-100' 
          : 'from-red-900 via-black to-red-950 opacity-100'
      }`} />
      
      {/* Animated overlay layer */}
      <div className={`absolute inset-0 transition-all duration-1500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isSpinning 
          ? 'bg-black/80 backdrop-blur-sm' 
          : 'bg-transparent'
      }`} />
      
      {/* Pulsing glow effect */}
      <div className={`absolute inset-0 transition-all duration-1500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
        isSpinning 
          ? 'bg-red-500/5 animate-pulse' 
          : 'bg-transparent'
      }`} />
      
      {/* Main content */}
      <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl flex flex-col items-center py-2 sm:py-12 md:py-16">
        
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
            </div>
          </div>

          {/* Betting Panel */}
          <div className="mt-2 sm:mt-8 md:mt-10">
            <BettingPanel
              balance={balance}
              onBetChange={handleBetChange}
              disabled={isSpinning || !isConnected}
              isWinning={isWinning}
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
            <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm p-4 sm:p-6 rounded-none shadow-[0_0_15px_rgba(255,0,0,0.3)] border-2 border-red-500/50 w-[90vw] max-w-sm sm:max-w-md">
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