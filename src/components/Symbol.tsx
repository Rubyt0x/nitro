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
        hover:bg-slate-50 transition-colors
        border-b border-slate-100`}
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