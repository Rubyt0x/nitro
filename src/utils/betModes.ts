import { BetMode } from '../types/game';

export const BET_MODES: BetMode[] = [
  {
    name: 'Safe Bet',
    betAmount: 100,
    linesToCheck: [1], // Middle row only
  },
  {
    name: 'Standard Bet',
    betAmount: 500,
    linesToCheck: [0, 1, 2], // All rows
  },
  {
    name: 'Risky Bet',
    betAmount: 1000,
    linesToCheck: [0, 1, 2, 3, 4], // Rows + diagonals
  },
  {
    name: 'Max Risk',
    betAmount: 2000,
    linesToCheck: [0, 1, 2, 3, 4, 5, 6, 7], // All lines
    bonusMultiplier: 1.2,
  },
];