import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

interface JackpotOverlayProps {
  show: boolean;
}

export const JackpotOverlay = ({ show }: JackpotOverlayProps) => {
  const [isCounting, setIsCounting] = useState(false);
  const spring = useSpring(0, { 
    stiffness: 50,
    damping: 20,
    mass: 0.3,
    restSpeed: 0.01
  });
  const formattedCount = useTransform(spring, (value) => 
    Math.floor(value).toLocaleString()
  );

  useEffect(() => {
    if (show) {
      setIsCounting(true);
      spring.set(8000000);
    } else {
      setIsCounting(false);
      spring.set(0);
    }
  }, [show, spring]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ 
              delay: 0.1,
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1]
            }}
            className="text-center"
          >
            <motion.h1 
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.2,
                duration: 0.5,
                type: "spring",
                stiffness: 60,
                damping: 12,
                mass: 0.8
              }}
              className="text-4xl sm:text-6xl md:text-7xl font-press-start text-red-500 mb-4 sm:mb-6"
            >
              MEGA JACKPOT
            </motion.h1>
            <div className="flex items-center justify-center gap-4 sm:gap-6">
              <motion.img 
                src="/images/fuel-logo.png" 
                alt="FUEL logo" 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.3,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 60,
                  damping: 12
                }}
                className="w-12 h-12 sm:w-16 sm:h-16 animate-pulse"
              />
              <motion.div 
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.4,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 40,
                  damping: 10,
                  mass: 0.8
                }}
                className="text-3xl sm:text-5xl md:text-6xl font-press-start text-white"
              >
                <motion.span
                  animate={{
                    scale: [1, 1.05, 1],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  {formattedCount}
                </motion.span>
              </motion.div>
            </div>
            <motion.p 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                delay: 0.5,
                duration: 0.5,
                type: "spring",
                stiffness: 60,
                damping: 12,
                mass: 0.8
              }}
              className="mt-4 sm:mt-6 text-lg sm:text-xl text-red-400 font-press-start"
            >
              CONGRATULATIONS!
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 