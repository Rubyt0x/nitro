import * as Dialog from '@radix-ui/react-dialog';
import { Symbol } from '../types/game';
import { getSymbolConfig } from '../utils/symbols';

interface WinningBookProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'combinations' | 'rules';
}

export const WinningBook = ({ open, onOpenChange, type }: WinningBookProps) => {
  const symbols = ['⛽️', '🏎️', '🔔', '🪓', '💣', '🔥'];
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
            
            const probability = ((config.weight / 100) * 100).toFixed(1);
            
            return (
              <div key={symbol} className="bg-black/50 p-2 sm:p-3 border border-red-500/30">
                <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                  <span className="text-xl sm:text-2xl">{symbol}</span>
                  <div className="flex flex-col">
                    <span className="text-white text-xs sm:text-sm font-press-start">x{config.multiplier}</span>
                    <small className="text-red-400/80 text-[10px] sm:text-xs font-sans font-normal tracking-wide">
                      {probability}% chance
                    </small>
                  </div>
                </div>
                {symbol === '⛽️' ? (
                  <div className="text-white/80 text-[10px] sm:text-xs font-press-start">
                    Jackpot: x{config.jackpotMultiplier} (Max Bet)
                  </div>
                ) : (
                  <div className="text-white/80 text-[10px] sm:text-xs font-press-start">
                    Regular Win Only
                  </div>
                )}
              </div>
            );
          })}
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
            <li>• Only the fuel pump (⛽️) symbol can trigger the jackpot</li>
            <li>• Must bet max FUEL (10 per line)</li>
            <li>• All selected lines must show fuel pump (⛽️) symbols</li>
            <li>• 10% of each bet added to jackpot pool</li>
            <li>• Mega Jackpot triggered at 1000+ FUEL</li>
            <li>• Multiple winning lines get 10% bonus per line</li>
          </ul>
        </div>
      </div>

      {/* Game Mechanics */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-2 sm:mb-3 font-press-start">Game Mechanics</h3>
        <div className="bg-black/50 p-2 sm:p-3 border border-red-500/30">
          <ul className="text-white/90 text-xs sm:text-sm font-press-start space-y-1 sm:space-y-2">
            <li>• Each symbol has weighted probability</li>
            <li>• Total symbol weight: 100</li>
            <li>• Base game RTP: ~95-96%</li>
            <li>• Jackpot contribution increases potential RTP</li>
            <li>• Game resets at 0 balance</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm p-3 sm:p-4 rounded-none shadow-[0_0_15px_rgba(255,0,0,0.3)] border-2 border-red-500/50 w-[95vw] sm:w-[90vw] max-w-lg flex flex-col">
          <Dialog.Title className="text-base sm:text-lg font-medium text-white mb-3 sm:mb-4 font-press-start flex-shrink-0">
            {type === 'combinations' ? 'Winning Combinations' : 'Game Rules'}
          </Dialog.Title>
          
          <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            {type === 'combinations' ? renderWinningCombinations() : renderGameRules()}
          </div>

          <div className="mt-3 sm:mt-4 flex justify-end flex-shrink-0">
            <Dialog.Close className="px-3 sm:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-none hover:bg-red-700 transition-colors font-press-start text-xs sm:text-sm">
              Close
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}; 