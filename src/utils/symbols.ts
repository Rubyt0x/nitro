import { Symbol, SymbolConfig } from '../types/game';

export const SYMBOLS: SymbolConfig[] = [
  { symbol: '⛽️', weight: 5, multiplier: 50, jackpotMultiplier: 1000 },
  { symbol: '🏎️', weight: 8, multiplier: 25, jackpotMultiplier: 500 },
  { symbol: '🔔', weight: 12, multiplier: 15, jackpotMultiplier: 250 },
  { symbol: '🪓', weight: 15, multiplier: 10, jackpotMultiplier: 150 },
  { symbol: '💣', weight: 30, multiplier: 5, jackpotMultiplier: 100 },
  { symbol: '🔥', weight: 30, multiplier: 5, jackpotMultiplier: 100 },
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