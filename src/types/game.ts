export type Symbol = '💎' | '7️⃣' | '🔔' | '🍒' | '🍋' | '🍀';

export interface SymbolConfig {
  symbol: Symbol;
  weight: number;
  multiplier: number;
  jackpotMultiplier: number;
}

export interface BetMode {
  name: string;
  betAmount: number;
  linesToCheck: number[];
  bonusMultiplier?: number;
}

export type ResultMatrix = Symbol[][];

export interface LineWin {
  lineIndex: number;
  symbol: Symbol;
  multiplier: number;
}

export interface WinResult {
  winnings: number;
  jackpot: boolean;
  symbol?: Symbol;
  lines: LineWin[];
}