import { motion } from 'framer-motion';
import { Symbol as SymbolType } from '../types/game';
import { WrappedFuelSymbol } from './DemoJackpotManager';

interface SymbolProps {
  symbol: SymbolType;
  isWinning?: boolean;
}

export const Symbol = ({ symbol, isWinning }: SymbolProps) => {
  return (
    <motion.div
      className={`w-[72px] h-[72px] flex items-center justify-center text-4xl
        hover:bg-red-500/5 transition-colors
        border-b border-red-800/20 text-white/90
        relative group`}
      animate={isWinning ? {
        scale: [1, 1.2, 1],
        rotate: [0, 5, -5, 0],
        transition: { 
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {}}
    >
      <WrappedFuelSymbol 
        symbol={symbol}
        className="text-4xl"
      />
      {isWinning && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/20 to-transparent opacity-100 transition-opacity duration-300" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-500/30 via-transparent to-transparent opacity-100 transition-opacity duration-300" />
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};