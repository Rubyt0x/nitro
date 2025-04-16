import { Symbol, SymbolConfig } from '../types/game';

export const SYMBOLS: SymbolConfig[] = [
  { 
    symbol: '⛽️', 
    weight: 1.5, 
    multiplier: { three: 50, four: 250, five: 3000 },
    jackpotMultiplier: 3000 
  },
  { 
    symbol: '🏎️', 
    weight: 3.0, 
    multiplier: { three: 20, four: 100, five: 500 },
    jackpotMultiplier: 500 
  },
  { 
    symbol: '🔔', 
    weight: 5.0, 
    multiplier: { three: 10, four: 40, five: 200 },
    jackpotMultiplier: 200 
  },
  { 
    symbol: '💣', 
    weight: 7.0, 
    multiplier: { three: 7, four: 25, five: 100 },
    jackpotMultiplier: 100 
  },
  { 
    symbol: '🔥', 
    weight: 9.0, 
    multiplier: { three: 5, four: 15, five: 50 },
    jackpotMultiplier: 50 
  },
  { 
    symbol: '🪓', 
    weight: 11.0, 
    multiplier: { three: 3, four: 10, five: 25 },
    jackpotMultiplier: 25 
  },
  { 
    symbol: '7️⃣', 
    weight: 13.5, 
    multiplier: { three: 2, four: 5, five: 10 },
    jackpotMultiplier: 10 
  }
];

export const getRandomSymbol = (): Symbol => {
  const totalWeight = SYMBOLS.reduce((sum, symbol) => sum + symbol.weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const symbolConfig of SYMBOLS) {
    random -= symbolConfig.weight;
    if (random <= 0) {
      return symbolConfig.symbol;
    }
  }
  
  return SYMBOLS[0].symbol;
};

export const generateResultMatrix = (): Symbol[][] => {
  return Array(3).fill(null).map(() =>
    Array(3).fill(null).map(() => getRandomSymbol())
  );
};

export const getSymbolConfig = (symbol: Symbol): SymbolConfig | undefined => {
  return SYMBOLS.find(s => s.symbol === symbol);
};