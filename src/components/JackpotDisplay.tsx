import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface JackpotDisplayProps {
  jackpotPool: number;
  winNotification?: {
    message: string;
    amount: number;
  };
}

export const JackpotDisplay = ({ jackpotPool, winNotification }: JackpotDisplayProps) => {
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
        setCurrentMessage(`${nextMessage.message} — +${nextMessage.amount} FUEL!`);
        
        setTimeout(() => {
          setCurrentMessage(null);
          setIsAnimating(false);
          if (messageQueue.current.length > 0) {
            setTimeout(processNextMessage, 500);
          }
        }, 2000);
      }
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'bn';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else {
      return num.toFixed(2);
    }
  };

  return (
    <div className="relative w-full mb-2 sm:mb-4">
      <div className="bg-black/90 backdrop-blur-sm rounded-none p-1.5 sm:p-3 w-full border-2 border-red-500/50 shadow-[0_0_10px_rgba(255,0,0,0.3)] relative overflow-hidden">
        <div className="relative flex items-center">
          <div className="p-1.5 sm:p-3 border-r-2 border-red-500/50 flex items-center justify-center">
            <span className="text-xl sm:text-3xl md:text-4xl">⛽️</span>
          </div>
          <div className="flex-1 px-1.5 sm:px-3 py-1 sm:py-2">
            <AnimatePresence mode="wait">
              {currentMessage ? (
                <motion.div
                  key="notification"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="text-base sm:text-2xl md:text-3xl font-bold text-white font-mono tracking-wider"
                >
                  {currentMessage}
                </motion.div>
              ) : (
                <motion.div
                  key="jackpot"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-1"
                >
                  <div className="text-[10px] sm:text-sm font-medium text-red-400 mb-0.5 sm:mb-1 font-press-start tracking-wider">
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