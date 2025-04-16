import { ResultMatrix, Symbol, WinResult, LineWin } from '../types/game';
import { getSymbolConfig } from './symbols';

// Define the type for a coordinate pair
type Coordinate = [number, number];

// Define WIN_LINES with the specific type
export const WIN_LINES: Coordinate[][] = [
  // Horizontal lines
  [[0, 0], [0, 1], [0, 2]], // Top row (0)
  [[1, 0], [1, 1], [1, 2]], // Middle row (1)
  [[2, 0], [2, 1], [2, 2]], // Bottom row (2)
  // Diagonal lines
  [[0, 0], [1, 1], [2, 2]], // Top-left to bottom-right (3)
  [[0, 2], [1, 1], [2, 0]], // Top-right to bottom-left (4)
  // Vertical lines
  [[0, 0], [1, 0], [2, 0]], // Left column (5)
  [[0, 1], [1, 1], [2, 1]], // Middle column (6)
  [[0, 2], [1, 2], [2, 2]], // Right column (7)
];

// Define the maximum credit multiplier required for jackpot eligibility
const MAX_CREDIT_MULTIPLIER = 1000;

export const evaluateWin = (
  matrix: ResultMatrix,
  selectedLines: number[],
  creditMultiplier: number
): WinResult => {
  const winningLines: LineWin[] = [];
  let totalWinnings = 0;
  const winningSymbols = new Set<Symbol>();
  
  // Check only the selected lines
  for (const lineIndex of selectedLines) {
    const line = WIN_LINES[lineIndex];
    const symbols = line.map(([row, col]) => matrix[col][row]);
    
    if (symbols.every(s => s === symbols[0])) {
      const symbolConfig = getSymbolConfig(symbols[0]);
      if (symbolConfig) {
        winningLines.push({
          lineIndex,
          symbol: symbols[0],
          multiplier: symbolConfig.multiplier
        });
        
        const lineWin = symbolConfig.multiplier * creditMultiplier;
        totalWinnings += lineWin;
        winningSymbols.add(symbols[0]);
      }
    }
  }
  
  // Check for jackpot (requires specific symbol, all selected lines winning, AND max FUEL)
  const jackpotSymbolConfig = getSymbolConfig('⛽️');
  if (jackpotSymbolConfig && creditMultiplier === MAX_CREDIT_MULTIPLIER) {
    const jackpotLines = winningLines.filter(line => line.symbol === '⛽️');
    if (jackpotLines.length > 0) { 
      // Apply jackpot multiplier for each winning '⛽️' line only if max FUEL were bet
      const jackpotWin = jackpotLines.length * jackpotSymbolConfig.jackpotMultiplier * creditMultiplier;
      totalWinnings += jackpotWin; // Add jackpot winnings on top of regular winnings

      // Check if *all* selected lines were jackpot lines for the 'jackpot: true' flag
      const allLinesAreJackpot = winningLines.length === selectedLines.length && winningLines.every(line => line.symbol === '⛽️');

      return {
        winnings: totalWinnings,
        jackpot: allLinesAreJackpot, // Set true only if all selected lines hit the jackpot symbol
        symbol: '⛽️',
        lines: winningLines
      };
    }
  }
  
  // Check for bonus multiplier for multiple winning lines
  if (winningLines.length > 1) {
    const bonusMultiplier = 1 + (winningLines.length * 0.1);
    totalWinnings = Math.floor(totalWinnings * bonusMultiplier);
  }
  
  return {
    winnings: totalWinnings,
    jackpot: false,
    lines: winningLines
  };
};