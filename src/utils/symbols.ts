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
  const matrix = Array(3).fill(null).map(() =>
    Array(3).fill(null).map(() => getRandomSymbol())
  );
  
  // Log final results only
  console.log('\n=== Spin Results ===');
  console.log('Final Matrix:');
  matrix.forEach((col, i) => console.log(`Column ${i + 1}:`, col));
  
  // Calculate and log symbol distribution
  const symbolCounts = matrix.flat().reduce((acc, symbol) => {
    acc[symbol] = (acc[symbol] || 0) + 1;
    return acc;
  }, {} as Record<Symbol, number>);
  
  console.log('\nSymbol Distribution:');
  Object.entries(symbolCounts).forEach(([symbol, count]) => {
    console.log(`${symbol}: ${count} (${((count / 9) * 100).toFixed(1)}%)`);
  });
  console.log('===================\n');
  
  return matrix;
};

export const getSymbolConfig = (symbol: Symbol): SymbolConfig | undefined => {
  return SYMBOLS.find(s => s.symbol === symbol);
};