import { motion, useAnimation } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Symbol as SymbolType } from '../types/game';
import { Symbol } from './Symbol';
import { getRandomSymbol } from '../utils/symbols';

interface ReelProps {
  finalSymbols: SymbolType[];
  spinning: boolean;
  delay: number;
  onStop?: () => void;
  winningPositions?: number[];
}

export const Reel = ({ finalSymbols, spinning, delay, onStop, winningPositions = [] }: ReelProps) => {
  const controls = useAnimation();
  const [symbols, setSymbols] = useState<SymbolType[]>(finalSymbols);
  const currentOffsetRef = useRef(0);
  const symbolsRef = useRef<SymbolType[]>(finalSymbols);
  
  const SYMBOL_HEIGHT = 72;
  const BUFFER_SYMBOLS = 15;
  
  useEffect(() => {
    if (spinning) {
      const spinSymbols = Array(BUFFER_SYMBOLS)
        .fill(null)
        .map(getRandomSymbol);
        
      const currentSymbols = symbolsRef.current;
      const newSymbols = [...currentSymbols, ...spinSymbols, ...finalSymbols];
      const spinDistance = (spinSymbols.length + finalSymbols.length) * SYMBOL_HEIGHT;
      const targetOffset = currentOffsetRef.current - spinDistance;
      
      symbolsRef.current = newSymbols;
      setSymbols(newSymbols);
      
      controls.start({
        y: targetOffset,
        transition: {
          duration: 2,
          delay,
          ease: [0.2, 0.0, 0.2, 1],
        },
      }).then(() => {
        currentOffsetRef.current = targetOffset;
        symbolsRef.current = finalSymbols;
        
        requestAnimationFrame(() => {
          setSymbols(finalSymbols);
          controls.set({ y: 0 });
          currentOffsetRef.current = 0;
        });
        
        onStop?.();
      });
    }
  }, [spinning, finalSymbols, delay]);

  return (
    <div 
      className="relative flex flex-col justify-center items-center w-[72px] h-[216px] overflow-hidden bg-neutral-900 shadow-inner border-l border-r border-red-800/20 transition-shadow duration-300 hover:shadow-[0_0_20px_#ff1a1a]"
    >
      <motion.div
        animate={controls}
        initial={{ y: 0 }}
        className="absolute top-0 left-0 w-full"
      >
        {symbols.map((symbol, index) => {
          const isWinning = !spinning && winningPositions.includes(index);
          return (
            <Symbol 
              key={`${symbol}-${index}`}
              symbol={symbol}
              isWinning={isWinning}
            />
          );
        })}
      </motion.div>
      
      <div className="absolute inset-0 bg-[url('/textures/glass.png')] bg-cover opacity-5 pointer-events-none" />
      <div className="absolute top-0 w-full h-[2px] bg-red-500/20 blur-sm" />
      <div className="absolute bottom-0 w-full h-[2px] bg-red-500/20 blur-sm" />
    </div>
  );
};