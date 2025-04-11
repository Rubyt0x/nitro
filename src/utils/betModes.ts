import { BetMode } from '../types/game';

export const BET_MODES: BetMode[] = [
  {
    name: 'Safe Bet',
    betAmount: 1,
    linesToCheck: [1], // Middle row only
  },
  {
    name: 'Standard Bet',
    betAmount: 5,
    linesToCheck: [0, 1, 2], // All rows
  },
  {
    name: 'Risky Bet',
    betAmount: 10,
    linesToCheck: [0, 1, 2, 3, 4], // Rows + diagonals
  },
  {
    name: 'Max Risk',
    betAmount: 20,
    linesToCheck: [0, 1, 2, 3, 4, 5, 6, 7], // All lines
    bonusMultiplier: 1.2,
  },
];