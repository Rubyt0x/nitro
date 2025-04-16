import { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, Coins, Volume2, VolumeX } from 'lucide-react';
import { initSounds, playSound, stopSound, playWinSound, toggleMute, getMuteState } from '../utils/soundManager';
import { generateResultMatrix } from '../utils/symbols';
import { evaluateWin } from '../utils/winEvaluator';
import { WinningBook } from './WinningBook';
import { AnimatedBalance } from './AnimatedBalance';
import { Button } from '../components/ui/button';
import { cn } from '../lib/utils';
import { Reel, ReelRef } from './Reel';
import type { Symbol } from '../types/game';

export const SlotMachine = () => {
  const [matrix, setMatrix] = useState<Symbol[][]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [balance, setBalance] = useState(100);
  const [selectedBet, setSelectedBet] = useState(1);
  const [selectedLines, setSelectedLines] = useState([1]); // Middle row by default
  const [showWinBook, setShowWinBook] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isWinning, setIsWinning] = useState(false);
  
  const reelRefs = useRef<Array<ReelRef | null>>([]);

  useEffect(() => {
    initSounds();
    setIsMuted(getMuteState());
  }, []);

  const handleSpin = async () => {
    if (isSpinning || balance < selectedBet) return;
    
    setIsSpinning(true);
    setIsWinning(false);
    setBalance(prev => prev - selectedBet);

    // Generate new results
    const newMatrix = generateResultMatrix();
    const result = evaluateWin(newMatrix, selectedLines, selectedBet);
    
    // Start the reels spinning
    const promises = reelRefs.current.map((ref, index) => {
      return new Promise<void>(resolve => {
        setTimeout(() => {
          if (ref) {
            ref.setSymbols(newMatrix[index]);
            ref.spin();
          }
          resolve();
        }, index * 200); // Stagger the start of each reel
      });
    });

    // Wait for all reels to stop
    await Promise.all(promises);
    
    // If there's a win, update balance and show animation
    if (result.winnings > 0) {
      setIsWinning(true);
      setBalance(prev => prev + result.winnings);
      
      // Play win sound based on win amount
      if (result.winnings >= selectedBet * 5) {
        playWinSound([{ symbol: '⛽️', count: 3 }]); // Big win
      } else {
        playWinSound([{ symbol: '🔥', count: 3 }]); // Regular win
      }
      
      // Reset winning state after animation
      setTimeout(() => {
        setIsWinning(false);
      }, 1000);
    }

    setIsSpinning(false);
  };

  const handleBetChange = (bet: number) => {
    if (!isSpinning) {
      setSelectedBet(bet);
      playSound('buttonClick');
    }
  };

  const handleLineChange = (lines: number[]) => {
    if (!isSpinning) {
      setSelectedLines(lines);
      playSound('buttonClick');
    }
  };

  const handleMuteToggle = () => {
    const newState = toggleMute();
    setIsMuted(newState);
  };

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-red-950">
      <div className="fixed top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleMuteToggle}
          className="text-white hover:text-red-400"
        >
          {isMuted ? <VolumeX /> : <Volume2 />}
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowWinBook(true)}
          className="text-white hover:text-red-400"
        >
          <BookOpen />
        </Button>
      </div>

      {/* Balance Display */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <AnimatedBalance balance={balance} isWinning={isWinning} />
      </div>

      {/* Game Container */}
      <div className="relative w-[300px] sm:w-[400px] aspect-square border-2 border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.3)] bg-black/50 backdrop-blur-sm">
        <div className="grid grid-cols-3 h-full">
          {[0, 1, 2].map((colIndex) => (
            <div key={colIndex} className="relative">
              <Reel
                finalSymbols={matrix[colIndex] || []}
                spinning={isSpinning}
                delay={colIndex * 200}
                ref={(el) => (reelRefs.current[colIndex] = el)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex gap-2">
          <Button
            onClick={() => handleBetChange(1)}
            className={cn(
              "px-4 py-2",
              selectedBet === 1 && "bg-red-600 hover:bg-red-700"
            )}
            disabled={isSpinning}
          >
            Safe
          </Button>
          <Button
            onClick={() => handleBetChange(5)}
            className={cn(
              "px-4 py-2",
              selectedBet === 5 && "bg-red-600 hover:bg-red-700"
            )}
            disabled={isSpinning}
          >
            Standard
          </Button>
          <Button
            onClick={() => handleBetChange(10)}
            className={cn(
              "px-4 py-2",
              selectedBet === 10 && "bg-red-600 hover:bg-red-700"
            )}
            disabled={isSpinning}
          >
            Risky
          </Button>
          <Button
            onClick={() => handleBetChange(20)}
            className={cn(
              "px-4 py-2",
              selectedBet === 20 && "bg-red-600 hover:bg-red-700"
            )}
            disabled={isSpinning}
          >
            Max
          </Button>
        </div>

        <Button
          onClick={handleSpin}
          disabled={isSpinning || balance < selectedBet}
          className="px-8 py-3 text-lg font-bold"
        >
          {isSpinning ? "Spinning..." : "Spin"}
        </Button>
      </div>

      <WinningBook
        open={showWinBook}
        onOpenChange={setShowWinBook}
        type="combinations"
      />
    </div>
  );
};