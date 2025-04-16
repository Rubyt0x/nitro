import { LineSelection, CreditMultiplier } from '../types/game';

export const LINE_SELECTIONS: LineSelection[] = [
  {
    label: "1 Line",
    lines: [1], // Middle row only
    description: "Play just the middle row"
  },
  {
    label: "3 Lines",
    lines: [0, 1, 2], // All rows
    description: "Play all horizontal lines"
  },
  {
    label: "5 Lines",
    lines: [0, 1, 2, 3, 4], // Rows + diagonals
    description: "Play rows and diagonals"
  },
  {
    label: "8 Lines",
    lines: [0, 1, 2, 3, 4, 5, 6, 7], // All lines
    description: "Play all possible lines"
  }
];

export const CREDIT_MULTIPLIERS: CreditMultiplier[] = [
  { value: 100, label: "100x" },
  { value: 200, label: "200x" },
  { value: 500, label: "500x" },
  { value: 1000, label: "1000x" }
]; 