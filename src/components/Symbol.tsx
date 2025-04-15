import { motion } from 'framer-motion';
import { Symbol as SymbolType } from '../types/game';

interface SymbolProps {
  symbol: SymbolType;
  isWinning?: boolean;
}

export const Symbol = ({ symbol, isWinning }: SymbolProps) => {
  return (
    <motion.div
      className={`w-16 h-16 flex items-center justify-center text-4xl
        ${isWinning ? 'scale-110' : ''}
        hover:bg-red-500/10 transition-colors
        border-b border-red-500/20 text-white`}
      animate={isWinning ? {
        scale: [1, 1.1, 1],
        transition: { 
          duration: 0.5,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {}}
    >
      {symbol}
    </motion.div>
  );
};