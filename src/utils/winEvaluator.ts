import { ResultMatrix, Symbol, WinResult, LineWin, BetMode } from '../types/game';
import { getSymbolConfig } from './symbols';

const WIN_LINES = [
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

export const evaluateWin = (matrix: ResultMatrix, betMode: BetMode): WinResult => {
  const winningLines: LineWin[] = [];
  let totalWinnings = 0;
  
  // Check only the lines specified by the bet mode
  for (const lineIndex of betMode.linesToCheck) {
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
        
        let lineWin = symbolConfig.multiplier * betMode.betAmount;
        if (betMode.bonusMultiplier) {
          lineWin *= betMode.bonusMultiplier;
        }
        totalWinnings += lineWin;
      }
    }
  }
  
  // Check for jackpot (all checked lines win with same symbol)
  if (winningLines.length === betMode.linesToCheck.length && winningLines.length > 0) {
    const jackpotSymbol = winningLines[0].symbol;
    const allSameSymbol = winningLines.every(line => line.symbol === jackpotSymbol);
    
    if (allSameSymbol) {
      const symbolConfig = getSymbolConfig(jackpotSymbol);
      if (symbolConfig) {
        let jackpotWin = symbolConfig.jackpotMultiplier * betMode.betAmount;
        if (betMode.bonusMultiplier) {
          jackpotWin *= betMode.bonusMultiplier;
        }
        
        return {
          winnings: jackpotWin,
          jackpot: true,
          symbol: jackpotSymbol,
          lines: winningLines
        };
      }
    }
  }
  
  return {
    winnings: totalWinnings,
    jackpot: false,
    lines: winningLines
  };
};