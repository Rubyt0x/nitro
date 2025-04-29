import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '@/utils/soundManager';

interface DemoJackpotProps {
  isActive: boolean;
  onComplete: () => void;
}

export const DemoJackpot: React.FC<DemoJackpotProps> = ({ isActive, onComplete }) => {
  const [showOverlay, setShowOverlay] = useState(false);

  useEffect(() => {
    if (isActive) {
      // Start the demo sequence
      const sequence = async () => {
        // Play jackpot sound (using existing sound system)
        playSound('winJackpot');
        
        // Show overlay after a short delay
        setTimeout(() => setShowOverlay(true), 500);
        
        // Complete after 7.5 seconds
        setTimeout(() => {
          setShowOverlay(false);
          onComplete();
        }, 7500);
      };
      
      sequence();
    }
  }, [isActive, onComplete]);

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 pointer-events-none"
        >
          {/* Red glow effect */}
          <div className="absolute inset-0 bg-red-500/20 animate-pulse" />
          
          {/* Jackpot text overlay */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            <h1 className="text-6xl font-bold text-red-500 animate-glow">
              JACKPOT!
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}; 