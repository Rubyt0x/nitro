import { motion, useAnimationControls, MotionValue, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface AnimatedBalanceProps {
  balance: number;
  isWinning?: boolean;
}

export const AnimatedBalance = ({ balance, isWinning }: AnimatedBalanceProps) => {
  const controls = useAnimationControls();
  const count = useMotionValue(balance);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isWinning) {
      controls.start({
        scale: [1, 1.2, 1],
        transition: { duration: 0.4, ease: "easeOut" }
      });
    }
  }, [balance, isWinning, controls]);

  useEffect(() => {
    count.set(balance);
  }, [balance, count]);

  return (
    <div className="relative flex items-center gap-2">
      <motion.div
        animate={controls}
        className="flex items-center"
      >
        <motion.span>
          {rounded}
        </motion.span>
        
        <span className="ml-2 font-press-start text-xs sm:text-sm">FUEL</span>
      </motion.div>

      {/* Winning animation overlay */}
      {isWinning && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: [0, 1, 0], scale: [0.5, 1.2, 1.5] }}
          transition={{ duration: 0.8 }}
          className="absolute left-full ml-2"
        >
          <span className="text-yellow-400 text-sm">💰</span>
        </motion.div>
      )}
    </div>
  );
}; 