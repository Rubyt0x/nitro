import { Symbol, SymbolConfig } from '../types/game';

// Visual weights for symbol appearance (not matching)
export const SYMBOL_VISUAL_WEIGHTS = {
  '🔥': 30, // Very common
  '💣': 30, // Very common
  '🪓': 20, // Uncommon
  '🔔': 10, // Rare
  '🏎️': 7,  // Very rare
  '⛽️': 3   // Ultra rare
} as const;

// Match completion probabilities when 2 symbols are already matching
export const MATCH_COMPLETION_PROBABILITIES = {
  '🔥': 0.6,  // 60% chance to complete match
  '💣': 0.5,  // 50% chance to complete match
  '🪓': 0.3,  // 30% chance to complete match
  '🔔': 0.1,  // 10% chance to complete match
  '🏎️': 0.08, // 8% chance to complete match
  '⛽️': 0.05  // 5% chance to complete match
} as const;

// Base payouts for 3-symbol matches
export const SYMBOLS: SymbolConfig[] = [
  { 
    symbol: '⛽️', 
    weight: SYMBOL_VISUAL_WEIGHTS['⛽️'],
    multiplier: { three: 50 },
    jackpotMultiplier: 50,
    matchProbability: MATCH_COMPLETION_PROBABILITIES['⛽️'],
    consolationPrize: 5 // Small prize for 2 matches
  },
  { 
    symbol: '🏎️', 
    weight: SYMBOL_VISUAL_WEIGHTS['🏎️'],
    multiplier: { three: 25 },
    jackpotMultiplier: 25,
    matchProbability: MATCH_COMPLETION_PROBABILITIES['🏎️'],
    consolationPrize: 3
  },
  { 
    symbol: '🔔', 
    weight: SYMBOL_VISUAL_WEIGHTS['🔔'],
    multiplier: { three: 15 },
    jackpotMultiplier: 15,
    matchProbability: MATCH_COMPLETION_PROBABILITIES['🔔'],
    consolationPrize: 2
  },
  { 
    symbol: '🪓', 
    weight: SYMBOL_VISUAL_WEIGHTS['🪓'],
    multiplier: { three: 10 },
    jackpotMultiplier: 10,
    matchProbability: MATCH_COMPLETION_PROBABILITIES['🪓'],
    consolationPrize: 1
  },
  { 
    symbol: '💣', 
    weight: SYMBOL_VISUAL_WEIGHTS['💣'],
    multiplier: { three: 5 },
    jackpotMultiplier: 5,
    matchProbability: MATCH_COMPLETION_PROBABILITIES['💣'],
    consolationPrize: 0
  },
  { 
    symbol: '🔥', 
    weight: SYMBOL_VISUAL_WEIGHTS['🔥'],
    multiplier: { three: 5 },
    jackpotMultiplier: 5,
    matchProbability: MATCH_COMPLETION_PROBABILITIES['🔥'],
    consolationPrize: 0
  }
];

// Helper function to get a random symbol based on visual weights
export const getRandomSymbol = (): Symbol => {
  const totalWeight = Object.values(SYMBOL_VISUAL_WEIGHTS).reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;
  
  for (const [symbol, weight] of Object.entries(SYMBOL_VISUAL_WEIGHTS)) {
    random -= weight;
    if (random <= 0) {
      return symbol as Symbol;
    }
  }
  
  return '🔥'; // Fallback to most common symbol
};

// Helper function to check if a match should complete based on symbol rarity
export const shouldCompleteMatch = (symbol: Symbol): boolean => {
  const probability = MATCH_COMPLETION_PROBABILITIES[symbol];
  return Math.random() < probability;
};

// Helper function to get consolation prize for near-miss
export const getConsolationPrize = (symbol: Symbol): number => {
  const config = SYMBOLS.find(s => s.symbol === symbol);
  return config?.consolationPrize || 0;
};

export const generateResultMatrix = (): Symbol[][] => {
  return Array(3).fill(null).map(() =>
    Array(3).fill(null).map(() => getRandomSymbol())
  );
};

export const getSymbolConfig = (symbol: Symbol): SymbolConfig | undefined => {
  return SYMBOLS.find(s => s.symbol === symbol);
};