import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Coins } from 'lucide-react';

interface AnimatedBalanceProps {
  balance: number;
  isWinning?: boolean;
}

export const AnimatedBalance = ({ balance, isWinning = false }: AnimatedBalanceProps) => {
  const [displayedBalance, setDisplayedBalance] = useState(balance);
  const [winAmount, setWinAmount] = useState(0);

  useEffect(() => {
    if (isWinning) {
      const difference = balance - displayedBalance;
      setWinAmount(difference);
      
      // Animate the balance increase
      const duration = 1000; // 1 second
      const frameRate = 60;
      const totalFrames = Math.round(duration / (1000 / frameRate));
      const increment = difference / totalFrames;

      let currentFrame = 0;
      const interval = setInterval(() => {
        currentFrame++;
        const nextValue = displayedBalance + increment * currentFrame;

        if (currentFrame >= totalFrames) {
          setDisplayedBalance(balance);
          clearInterval(interval);
        } else {
          setDisplayedBalance(nextValue);
        }
      }, 1000 / frameRate);

      return () => clearInterval(interval);
    } else {
      setDisplayedBalance(balance);
    }
  }, [balance, isWinning]);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  };

  return (
    <motion.div
      className={`relative flex items-center gap-2 px-4 py-2 bg-black/80 border-2 ${
        isWinning ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'border-red-500/50'
      } rounded-none transition-all duration-300`}
      initial={{ scale: 1 }}
      animate={isWinning ? { scale: [1, 1.1, 1] } : { scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Coins className={`w-5 h-5 ${isWinning ? 'text-yellow-400' : 'text-red-400'}`} />
      <span className={`text-lg font-press-start ${isWinning ? 'text-yellow-400' : 'text-white'}`}>
        {formatNumber(displayedBalance)}
      </span>
      {isWinning && winAmount > 0 && (
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="absolute -top-6 right-0 text-yellow-400 text-sm font-press-start"
        >
          +{formatNumber(winAmount)}
        </motion.span>
      )}
    </motion.div>
  );
}; 