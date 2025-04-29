/**
 * Symbol mapping utility - PURELY ADDITIVE
 * This file only provides mapping functions and does not modify any existing logic
 */

export const symbolToDisplay = (symbol: string): string => {
  // Only transform the bell symbol to fuel logo, leave everything else unchanged
  if (symbol === '🔔') return '/images/fuel-logo.png';
  return symbol;
};

export const isFuelSymbol = (symbol: string): boolean => {
  // Only transform the fuel logo image and bell symbol
  return symbol === '/images/fuel-logo.png' || symbol === '🔔';
}; 