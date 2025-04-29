import { Symbol, SymbolConfig } from '../types/game';

export const SYMBOLS: SymbolConfig[] = [
  { symbol: '/images/fuel-logo.png', weight: 1, multiplier: 1000, jackpotMultiplier: 10000 }, // Fuel Token logo - Jackpot
  { symbol: '🏎️', weight: 2, multiplier: 25, jackpotMultiplier: 500 },     // Race car
  { symbol: '⛽️', weight: 5, multiplier: 50, jackpotMultiplier: 1000 },    // Fuel pump
  { symbol: '🪓', weight: 20, multiplier: 10, jackpotMultiplier: 150 },     // Axe
  { symbol: '🔥', weight: 30, multiplier: 5, jackpotMultiplier: 100 },      // Fire
  { symbol: '💣', weight: 42, multiplier: 5, jackpotMultiplier: 100 },      // Bomb
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