import { Symbol as GameSymbol } from '../../types/game';

// Re-export the Symbol type
export type Symbol = GameSymbol;

// Core RNG configuration
export const RNG_CONFIG = {
  TARGET_RTP: 0.95, // 95% RTP target
  EMA_SMOOTHING: 0.1, // Exponential moving average smoothing factor
  INCREMENTAL_BOOST_STEP: 0.05, // How much to boost weights each step
  MAX_BOOST_MULTIPLIER: 2.0, // Maximum boost multiplier for weights
  BET_SCALING_FACTOR: 0.1, // How much bet size affects weight adjustments
};

// Base weights for each symbol (sums to 1.0)
export const SYMBOL_WEIGHTS: Record<Symbol, number> = {
  '⛽️': 0.02, // Wild - Very rare base weight
  '🏎️': 0.08, // Scatter
  '🔔': 0.12, // High value
  '🪓': 0.20, // Medium value
  '💣': 0.30, // Low value
  '🔥': 0.28, // Lowest value
};

// Jackpot-specific configuration
export const JACKPOT_CONFIG = {
  BASE_WEIGHT: 0.02, // Base weight for Fuel Pump
  MAX_WEIGHT: 0.10, // Maximum weight for Fuel Pump
  SPIN_BOOST: 0.001, // Weight increase per spin without jackpot
  BET_BOOST: 0.0001, // Weight increase per unit bet
  TIME_BOOST: 0.0005, // Weight increase per minute of play
  RESET_ON_JACKPOT: true, // Reset weight to base after jackpot hit
  DECAY_RATE: 0.95, // Weight decay rate when not playing
};

// Near-miss probabilities for each symbol
export const NEAR_MISS_PROBABILITIES: Record<Symbol, number[]> = {
  '⛽️': [0.05, 0.1, 0.15], // Wild near-miss probabilities (lower base)
  '🏎️': [0.15, 0.25, 0.35], // Scatter near-miss probabilities
  '🔔': [0.2, 0.3, 0.4], // High value near-miss probabilities
  '🪓': [0.25, 0.35, 0.45], // Medium value near-miss probabilities
  '💣': [0.3, 0.4, 0.5], // Low value near-miss probabilities
  '🔥': [0.35, 0.45, 0.55], // Lowest value near-miss probabilities
};

// Payout multipliers for winning combinations
export const PAYOUT_MULTIPLIERS: Record<Symbol, number[]> = {
  '⛽️': [0, 0, 0, 0, 0, 0], // Wild pays on all lines
  '🏎️': [0, 0, 0, 0, 0, 0], // Scatter pays on all positions
  '🔔': [0, 0, 0, 0, 0, 0], // High value
  '🪓': [0, 0, 0, 0, 0, 0], // Medium value
  '💣': [0, 0, 0, 0, 0, 0], // Low value
  '🔥': [0, 0, 0, 0, 0, 0], // Lowest value
};

// Volatility settings
export const VOLATILITY_SETTINGS = {
  LOW: {
    WEIGHT_VARIANCE: 0.1,
    BOOST_MULTIPLIER: 1.5,
  },
  MEDIUM: {
    WEIGHT_VARIANCE: 0.2,
    BOOST_MULTIPLIER: 2.0,
  },
  HIGH: {
    WEIGHT_VARIANCE: 0.3,
    BOOST_MULTIPLIER: 2.5,
  },
}; 