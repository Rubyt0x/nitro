import * as Dialog from '@radix-ui/react-dialog';
import { Symbol } from '../types/game';
import { getSymbolConfig } from '../utils/symbols';
import { SYMBOL_WEIGHTS, PAYOUT_MULTIPLIERS } from '../utils/adaptiveRNG/config';
import { WrappedFuelSymbol } from './DemoJackpotManager';

interface WinningBookProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'combinations' | 'rules';
}

export const WinningBook = ({ open, onOpenChange, type }: WinningBookProps) => {
  const symbols = [
    '/images/fuel-logo.png',  // Rarest - 1% - Jackpot
    '🏎️',                    // Very rare - 2%
    '⛽️',                    // Rare - 5%
    '🪓',                    // High value - 20%
    '🔥',                    // Medium value - 30%
    '💣'                     // Most common - 42%
  ];
  const lines = [
    { name: 'Top Row', index: 0 },
    { name: 'Middle Row', index: 1 },
    { name: 'Bottom Row', index: 2 },
    { name: 'Diagonal (Top-Left to Bottom-Right)', index: 3 },
    { name: 'Diagonal (Top-Right to Bottom-Left)', index: 4 },
    { name: 'Left Column', index: 5 },
    { name: 'Middle Column', index: 6 },
    { name: 'Right Column', index: 7 }
  ];

  const renderWinningCombinations = () => (
    <div className="space-y-3 sm:space-y-4">
      {/* Symbol Payouts */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-2 sm:mb-3 font-press-start">Symbol Payouts</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {symbols.map(symbol => {
            const config = getSymbolConfig(symbol as Symbol);
            if (!config) return null;
            
            const probability = (config.weight / 100 * 100).toFixed(1);
            const isJackpotSymbol = symbol === '/images/fuel-logo.png';
            
            return (
              <div key={symbol} className="bg-black/50 p-2 sm:p-3 border border-red-500/30">
                <div className="flex items-center gap-2 sm:gap-3">
                  <WrappedFuelSymbol 
                    symbol={symbol}
                    className="text-2xl sm:text-3xl"
                  />
                  <div className="flex flex-col">
                    <span className="text-white text-xs sm:text-sm font-press-start">
                      {isJackpotSymbol ? 'x1000' : `x${config.multiplier}`}
                    </span>
                    <small className="text-red-400/80 text-[10px] sm:text-xs font-sans font-normal tracking-wide">
                      {probability}% chance
                    </small>
                  </div>
                </div>
                <div className="text-white/80 text-[10px] sm:text-xs font-press-start mt-2">
                  {isJackpotSymbol ? 'Jackpot (Max Bet)' : 'Regular Win'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Symbol Rarity */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-2 sm:mb-3 font-press-start">Symbol Rarity</h3>
        <div className="bg-black/50 p-2 sm:p-3 border border-red-500/30">
          <ul className="text-white/90 text-xs sm:text-sm font-press-start space-y-1 sm:space-y-2">
            <li>• Fuel Token (logo) - Rarest (1% chance)</li>
            <li>• Race Car (🏎️) - Very Rare (2% chance)</li>
            <li>• Fuel Pump (⛽️) - Rare (5% chance)</li>
            <li>• Axe (🪓) - High Value (20% chance)</li>
            <li>• Fire (🔥) - Medium Value (30% chance)</li>
            <li>• Bomb (💣) - Most Common (42% chance)</li>
          </ul>
        </div>
      </div>

      {/* Pay Lines */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-2 sm:mb-3 font-press-start">Pay Lines</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          {lines.map(line => (
            <div key={line.index} className="bg-black/50 p-2 sm:p-3 border border-red-500/30">
              <div className="text-white text-xs sm:text-sm font-press-start">{line.name}</div>
              <div className="text-white/80 text-[10px] sm:text-xs font-press-start mt-1">
                Line #{line.index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderGameRules = () => (
    <div className="space-y-3 sm:space-y-4">
      {/* Betting Modes */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-2 sm:mb-3 font-press-start">Betting Modes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
          <div className="bg-black/50 p-2 sm:p-3 border border-red-500/30">
            <div className="text-white text-xs sm:text-sm font-press-start">Safe Bet</div>
            <div className="text-white/80 text-[10px] sm:text-xs mt-1">1 <span className="sm:hidden">/</span><span className="hidden sm:inline">per</span> line, middle row only</div>
          </div>
          <div className="bg-black/50 p-2 sm:p-3 border border-red-500/30">
            <div className="text-white text-xs sm:text-sm font-press-start">Standard Bet</div>
            <div className="text-white/80 text-[10px] sm:text-xs mt-1">5 <span className="sm:hidden">/</span><span className="hidden sm:inline">per</span> line, all rows</div>
          </div>
          <div className="bg-black/50 p-2 sm:p-3 border border-red-500/30">
            <div className="text-white text-xs sm:text-sm font-press-start">Risky Bet</div>
            <div className="text-white/80 text-[10px] sm:text-xs mt-1">10 <span className="sm:hidden">/</span><span className="hidden sm:inline">per</span> line, rows + diagonals</div>
          </div>
          <div className="bg-black/50 p-2 sm:p-3 border border-red-500/30">
            <div className="text-white text-xs sm:text-sm font-press-start">Max Risk</div>
            <div className="text-white/80 text-[10px] sm:text-xs mt-1">20 <span className="sm:hidden">/</span><span className="hidden sm:inline">per</span> line, all lines + 20% bonus</div>
          </div>
        </div>
      </div>

      {/* Jackpot Rules */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-2 sm:mb-3 font-press-start">Jackpot Rules</h3>
        <div className="bg-black/50 p-2 sm:p-3 border border-red-500/30">
          <ul className="text-white/90 text-xs sm:text-sm font-press-start space-y-1 sm:space-y-2">
            <li>• Only the Fuel Token (logo) can trigger the jackpot</li>
            <li>• Must bet max FUEL (10 per line)</li>
            <li>• All selected lines must show Fuel Token (logo)</li>
            <li>• 10% of each bet added to jackpot pool</li>
            <li>• Mega Jackpot triggered at 1000+ FUEL</li>
            <li>• Multiple winning lines get 10% bonus per line</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-2xl bg-gradient-to-b from-red-950 to-black p-4 sm:p-6 rounded-lg border border-red-500/30 shadow-xl z-[101]">
          <Dialog.Title className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 font-press-start">
            {type === 'combinations' ? 'Winning Combinations' : 'Game Rules'}
          </Dialog.Title>
          {type === 'combinations' ? renderWinningCombinations() : renderGameRules()}
          <Dialog.Close className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors">
            <span className="sr-only">Close</span>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}; 