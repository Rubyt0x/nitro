export type Symbol =
  | '⛽️'
  | '🏎️'
  | '🔔'
  | '🪓'
  | '💣'
  | '🔥'
  | '7️⃣';

export interface SymbolConfig {
  symbol: Symbol;
  weight: number;
  multiplier: {
    three: number;
    four: number;
    five: number;
  };
  jackpotMultiplier: number;
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
}