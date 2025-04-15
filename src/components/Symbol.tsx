import { motion } from 'framer-motion';
import { Symbol as SymbolType } from '../types/game';

interface SymbolProps {
  symbol: SymbolType;
  isWinning?: boolean;
}

export const Symbol = ({ symbol, isWinning }: SymbolProps) => {
  return (
    <motion.div
      className={`w-[72px] h-[72px] flex items-center justify-center text-4xl
        ${isWinning ? 'scale-110' : ''}
        hover:bg-red-500/5 transition-colors
        border-b border-red-800/20 text-white/90
        relative group`}
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
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};