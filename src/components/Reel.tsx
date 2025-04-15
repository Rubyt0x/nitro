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
}

export const Reel = ({ finalSymbols, spinning, delay, onStop }: ReelProps) => {
  const controls = useAnimation();
  const [symbols, setSymbols] = useState<SymbolType[]>(finalSymbols);
  const currentOffsetRef = useRef(0);
  const symbolsRef = useRef<SymbolType[]>(finalSymbols);
  
  const SYMBOL_HEIGHT = 64;
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
          ease: [0.25, 0.1, 0.25, 1],
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
      className="w-16 h-48 overflow-hidden bg-black/90 backdrop-blur-sm rounded-none relative border-2 border-red-500/30 shadow-[0_0_10px_rgba(255,0,0,0.2)]"
    >
      <motion.div
        animate={controls}
        initial={{ y: 0 }}
        className="absolute top-0 left-0 w-full"
      >
        {symbols.map((symbol, index) => (
          <Symbol 
            key={`${symbol}-${index}-${spinning}`}
            symbol={symbol}
          />
        ))}
      </motion.div>
      
      <div className="absolute inset-0 pointer-events-none border-y border-red-500/20" />
    </div>
  );
};