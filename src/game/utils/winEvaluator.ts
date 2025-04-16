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
const MAX_CREDIT_MULTIPLIER = 10;

export const evaluateWin = (
  matrix: ResultMatrix,
  selectedLines: number[],
  creditMultiplier: number
): WinResult => {
  const winningLines: LineWin[] = [];
  let totalWinnings = 0;
  
  // Check only the selected lines
  for (const lineIndex of selectedLines) {
    const line = WIN_LINES[lineIndex];
    const symbols = line.map(([row, col]) => matrix[col][row]);
    
    // Check for three matching symbols - only way to win
    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
      const symbol = symbols[0];
      const symbolConfig = getSymbolConfig(symbol);
      
      if (symbolConfig) {
        winningLines.push({
          lineIndex,
          symbol,
          multiplier: symbolConfig.multiplier.three
        });
        
        const lineWin = symbolConfig.multiplier.three * creditMultiplier;
        totalWinnings += lineWin;
      }
    }
  }
  
  // Check for jackpot (requires specific symbol, all selected lines winning, AND max FUEL)
  const jackpotSymbolConfig = getSymbolConfig('⛽️');
  if (jackpotSymbolConfig && creditMultiplier === MAX_CREDIT_MULTIPLIER) {
    const jackpotLines = winningLines.filter(line => line.symbol === '⛽️');
    if (jackpotLines.length > 0) { 
      // Apply jackpot multiplier for each winning '⛽️' line only if max FUEL were bet
      const jackpotWin = jackpotLines.reduce((total, line) => {
        return total + (line.multiplier * creditMultiplier);
      }, 0);
      
      totalWinnings += jackpotWin;

      // Check if *all* selected lines were jackpot lines for the 'jackpot: true' flag
      const allLinesAreJackpot = winningLines.length === selectedLines.length && 
                               winningLines.every(line => line.symbol === '⛽️');

      return {
        winnings: totalWinnings,
        jackpot: allLinesAreJackpot,
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