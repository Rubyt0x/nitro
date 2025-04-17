import { motion, AnimatePresence } from 'framer-motion';
import { Symbol } from '../../types/game';
import { useState } from 'react';

interface IntroScreenProps {
  onComplete: () => void;
}

const symbols: Symbol[] = ['⛽️', '🏎️', '🔔', '🪓', '💣', '🔥'];

const IntroScreen: React.FC<IntroScreenProps> = ({ onComplete }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onComplete, 1500);
  };

  return (
    <AnimatePresence>
      {!isExiting && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="fixed inset-0 flex flex-col items-center justify-center z-50"
        >
          {/* Background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-red-950 to-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1]
            }}
          />

          {/* Confetti */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -50,
                  rotate: Math.random() * 360,
                  opacity: 0,
                }}
                animate={{
                  y: window.innerHeight + 50,
                  rotate: Math.random() * 360,
                  opacity: 1,
                }}
                exit={{ 
                  opacity: 0,
                  transition: { duration: 0.5, delay: i * 0.02 }
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: i * 0.1,
                }}
              >
                {symbols[Math.floor(Math.random() * symbols.length)]}
              </motion.div>
            ))}
          </div>

          {/* Bento Box Container */}
          <motion.div
            className="relative z-10 bg-black p-8 rounded-none border-2 border-red-600 shadow-lg flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ 
              scale: 0.5, 
              opacity: 0,
              y: 100
            }}
            transition={{ 
              duration: 1,
              ease: [0.22, 1, 0.36, 1]
            }}
          >
            {/* Title */}
            <motion.h1
              className="text-6xl font-bold text-white mb-12 font-['Press_Start_2P'] text-center"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ 
                y: -50, 
                opacity: 0,
                transition: { duration: 0.5 }
              }}
              transition={{ 
                duration: 0.8,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              FUEL NITRO RUSH
            </motion.h1>

            {/* Start Button */}
            <motion.button
              className="w-full px-3 sm:px-6 md:px-8 py-1.5 sm:py-3 md:py-4 rounded-none font-bold text-xs sm:text-base transition-all duration-200 font-press-start bg-red-600 text-white hover:bg-red-700 active:scale-95 shadow-[0_0_10px_rgba(255,0,0,0.3)] border-2 border-red-500/50 backdrop-blur-sm hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]"
              onClick={handleStart}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ 
                scale: 0.5, 
                opacity: 0,
                y: 50
              }}
              transition={{ 
                duration: 0.5,
                delay: 0.6,
                ease: [0.22, 1, 0.36, 1]
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              START GAME
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IntroScreen; 