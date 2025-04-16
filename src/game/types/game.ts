export type Symbol =
  | '⛽️'
  | '🏎️'
  | '🔔'
  | '🪓'
  | '💣'
  | '🔥';

export interface SymbolConfig {
  symbol: Symbol;
  weight: number;
  multiplier: {
    three: number;
  };
  jackpotMultiplier: number;
  matchProbability: number;
  consolationPrize: number;
}

export interface LineSelection {
  label: string;
  lines: number[];
  description: string;
}

export interface CreditMultiplier {
  value: number;
  label: string;
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
  nearMisses?: {
    lineIndex: number;
    symbol: Symbol;
    consolationPrize: number;
  }[];
}