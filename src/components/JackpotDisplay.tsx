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

const FlyingParticle = ({ delay, isJackpot }: { delay: number; isJackpot: boolean }) => (
  <motion.div
    className={`absolute w-1 h-4 rounded-full ${isJackpot ? 'bg-red-500/30' : 'bg-yellow-500/30'}`}
    initial={{ 
      x: -20,
      y: Math.random() * 100,
      rotate: -45,
      opacity: 0 
    }}
    animate={{ 
      x: '120%',
      y: [null, Math.random() * 100],
      rotate: 45,
      opacity: [0, 1, 0]
    }}
    transition={{
      duration: 2,
      delay,
      ease: "linear"
    }}
  />
);

export const JackpotDisplay = ({ jackpotPool, winNotification, title }: JackpotDisplayProps) => {
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [currentAmount, setCurrentAmount] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const messageQueue = useRef<{ message: string; amount: number }[]>([]);
  const particleCount = 8; // Number of particles to show

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
        setCurrentMessage(nextMessage.message);
        setCurrentAmount(nextMessage.amount);
        
        setTimeout(() => {
          setCurrentMessage(null);
          setCurrentAmount(null);
          setIsAnimating(false);
          if (messageQueue.current.length > 0) {
            setTimeout(processNextMessage, 500);
          }
        }, 3000);
      }
    }
  };

  const formatJackpot = (amount: number) => {
    return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const currentJackpotFormatted = formatJackpot(jackpotPool);

  return (
    <div className="relative w-full bg-gradient-to-b from-black/90 to-black/70 rounded-none border-2 border-red-500/50 shadow-[0_0_15px_rgba(255,0,0,0.3)] backdrop-blur-sm mb-4 sm:mb-6 overflow-hidden">
      {/* Integrated Title */}
      {title && (
        <div className="text-center py-1.5 sm:py-2 border-b border-red-500/30">
          <h1 className="text-sm sm:text-base md:text-lg font-press-start text-red-400 tracking-wider uppercase">
            {title}
          </h1>
        </div>
      )}

      {/* Content Area */}
      <div className="p-3 sm:p-4 md:p-5 text-center relative">
        <AnimatePresence mode="wait">
          {currentMessage && currentAmount !== null ? (
            // Win Notification State
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center min-h-[60px] sm:min-h-[70px]"
            >
              <div className="text-base sm:text-lg md:text-xl font-press-start text-yellow-400 mb-1">{currentMessage}</div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold font-press-start text-white flex items-center justify-center">
                <img 
                  src="/images/fuel-logo.png" 
                  alt="FUEL logo" 
                  className="w-4 h-4 sm:w-5 sm:h-5"
                />
                <span className="text-red-500/50 mx-2">|</span>
                <span>{formatJackpot(currentAmount)}</span>
              </div>
            </motion.div>
          ) : (
            // Default Jackpot Pool State
            <motion.div
              key="jackpot-pool"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex flex-col items-center justify-center min-h-[60px] sm:min-h-[70px]"
            >
              <div className="text-xs sm:text-sm font-press-start text-red-400/80 uppercase tracking-wider mb-1">Jackpot Pool</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold font-press-start text-white flex items-center justify-center">
                <img 
                  src="/images/fuel-logo.png" 
                  alt="FUEL logo" 
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <span className="text-red-500/50 mx-2">|</span>
                <span>{currentJackpotFormatted}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtle LED grid effect */}
        {/* ... LED grid divs ... */}
      </div>
    </div>
  );
}; 