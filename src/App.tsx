import { useState } from 'react';
import { SlotMachine } from './components/SlotMachine';
import IntroScreen from './components/intro/IntroScreen';
import { motion, AnimatePresence } from 'framer-motion';
import { DemoJackpotManager } from './components/DemoJackpotManager';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [showGame, setShowGame] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setShowGame(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-950 to-black">
      <AnimatePresence>
        {showIntro ? (
          <IntroScreen onComplete={handleIntroComplete} />
        ) : showGame ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
          >
            <DemoJackpotManager>
              <SlotMachine />
            </DemoJackpotManager>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default App;