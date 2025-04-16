import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface JackpotDisplayProps {
  jackpotPool: number;
  winNotification?: {
    message: string;
    amount: number;
  };
  title?: string;
}

export const JackpotDisplay = ({ jackpotPool, winNotification, title }: JackpotDisplayProps) => {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const messageQueue = useRef<{ message: string; amount: number }[]>([]);

  useEffect(() => {
    if (winNotification) {
      messageQueue.current.push(winNotification);
      if (!isAnimating) {
        processNextMessage();
      }
    }
  }, [winNotification]);

  const processNextMessage = () => {
    if (messageQueue.current.length > 0) {
      const nextMessage = messageQueue.current.shift();
      if (nextMessage) {
        setIsAnimating(true);
        setCurrentMessage(`${nextMessage.message} — +${formatNumber(nextMessage.amount)} FUEL!`);
        
        setTimeout(() => {
          setCurrentMessage(null);
          setIsAnimating(false);
          if (messageQueue.current.length > 0) {
            setTimeout(processNextMessage, 500);
          }
        }, 3000);
      }
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'bn';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return num % 1000 !== 0 ? (num / 1000).toFixed(1) + 'K' : (num / 1000) + 'K';
    } else {
      return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
  };

  return (
    <div className="relative w-full mb-2 sm:mb-4">
      <div className="bg-black/90 backdrop-blur-sm rounded-none w-full border-2 border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.3)] relative overflow-hidden h-[120px] sm:h-[140px]">
        {/* Title Section */}
        {title && (
          <div className="flex items-center justify-center border-b-2 border-red-500/50 h-[45px] sm:h-[52px]">
            <div className="flex items-center justify-between w-full h-full">
              <div className="h-full border-r-2 border-red-500/50 flex items-center">
                <span role="img" aria-label="Slot Machine" className="text-base sm:text-xl px-2 sm:px-3">🎰</span>
              </div>
              <h1 className="flex-1 px-2 sm:px-3 text-[10px] sm:text-base font-press-start text-red-500 text-center shadow-text-glow uppercase whitespace-nowrap">
                {title}
              </h1>
              <div className="h-full border-l-2 border-red-500/50 flex items-center">
                <span role="img" aria-label="Slot Machine" className="text-base sm:text-xl px-2 sm:px-3">🎰</span>
              </div>
            </div>
          </div>
        )}

        {/* Jackpot/Notification Section */}
        <div className="relative flex items-center justify-center h-[75px] sm:h-[88px]">
          <div className="flex-1 px-2 sm:px-3">
            <AnimatePresence mode="wait">
              {currentMessage ? (
                <motion.div
                  key="notification"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm sm:text-lg md:text-xl font-bold text-white font-mono tracking-wider text-center"
                >
                  {currentMessage}
                </motion.div>
              ) : (
                <motion.div
                  key="jackpot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-1 text-center"
                >
                  <div className="text-[9px] sm:text-xs font-medium text-red-400 font-press-start tracking-wider">
                    JACKPOT POOL
                  </div>
                  <motion.div
                    initial={{ opacity: 0.5 }}
                    animate={{ opacity: 1 }}
                    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1 }}
                    className="text-base sm:text-2xl md:text-3xl font-bold text-white font-mono tracking-wider"
                  >
                    {formatNumber(jackpotPool)} <span className="text-red-400 text-[10px] sm:text-sm font-press-start">FUEL</span>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* LED effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 via-transparent to-red-500/5 animate-[pulse_2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}; 