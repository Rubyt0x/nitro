import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../utils/soundManager';
import { Symbol } from '../types';

interface IntroScreenProps {
  onStartGame: () => void;
}

const SYMBOLS: Symbol[] = ['FUEL_PUMP', 'FIRE', 'CAR', 'BOMB', 'AXE', 'BELL'];

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStartGame }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [fallingSymbols, setFallingSymbols] = useState<Array<{ id: number; symbol: Symbol; x: number; delay: number }>>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newSymbol = {
        id: Date.now(),
        symbol: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
        x: Math.random() * window.innerWidth,
        delay: Math.random() * 2
      };
      setFallingSymbols(prev => [...prev, newSymbol]);
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const handleStartClick = () => {
    setIsExiting(true);
    playSound('start');
    setTimeout(onStartGame, 1000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-red-900 via-black to-red-950 overflow-hidden">
      {/* Falling Symbols */}
      <AnimatePresence>
        {fallingSymbols.map(({ id, symbol, x, delay }) => (
          <motion.div
            key={id}
            className="absolute w-16 h-16"
            style={{ left: x }}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: window.innerHeight + 50, opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              y: { duration: 3, delay, ease: "linear" },
              opacity: { duration: 0.5 }
            }}
            onAnimationComplete={() => {
              setFallingSymbols(prev => prev.filter(s => s.id !== id));
            }}
          >
            <img 
              src={`/symbols/${symbol.toLowerCase()}.png`} 
              alt={symbol}
              className="w-full h-full object-contain"
            />
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main Content */}
      <motion.div 
        className="relative bg-black/50 backdrop-blur-sm p-12 rounded-lg border-2 border-red-500/50 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 0.8 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1 
          className="text-6xl font-bold text-red-600 mb-8 font-press-start"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? -20 : 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          NITRO SLOTS
        </motion.h1>
        <motion.button
          onClick={handleStartClick}
          className="px-8 py-4 text-2xl font-bold text-white bg-red-600 rounded-none hover:bg-red-700 transition-colors border-2 border-red-500/50 font-press-start shadow-[0_0_10px_rgba(255,0,0,0.3)] hover:shadow-[0_0_15px_rgba(255,0,0,0.4)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isExiting ? 0 : 1, y: isExiting ? 20 : 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          START GAME
        </motion.button>
      </motion.div>
    </div>
  );
}; 