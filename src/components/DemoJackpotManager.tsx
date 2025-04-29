import React, { useEffect, useState } from 'react';
import { DemoJackpot } from './DemoJackpot';
import { withSymbolMapping } from './withSymbolMapping';
import { FuelSymbolWrapper } from './FuelSymbolWrapper';

interface DemoJackpotManagerProps {
  children: React.ReactNode;
}

export const DemoJackpotManager: React.FC<DemoJackpotManagerProps> = ({ children }) => {
  const [hasSeenDemo, setHasSeenDemo] = useState(() => 
    sessionStorage.getItem('hasSeenDemo') === 'true'
  );
  const [isDemoActive, setIsDemoActive] = useState(false);

  useEffect(() => {
    if (!hasSeenDemo) {
      // Wait for page to load and fade in
      const timer = setTimeout(() => {
        setIsDemoActive(true);
        sessionStorage.setItem('hasSeenDemo', 'true');
        setHasSeenDemo(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [hasSeenDemo]);

  const handleDemoComplete = () => {
    setIsDemoActive(false);
  };

  return (
    <>
      {children}
      <DemoJackpot 
        isActive={isDemoActive} 
        onComplete={handleDemoComplete} 
      />
    </>
  );
};

// Export wrapped components for use in the app
export const WrappedFuelSymbol = withSymbolMapping(FuelSymbolWrapper); 