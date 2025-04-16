import * as Dialog from '@radix-ui/react-dialog';
import { Symbol } from '../types/game';
import { getSymbolConfig, SYMBOL_VISUAL_WEIGHTS } from '../utils/symbols';

interface WinningBookProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'combinations' | 'rules';
}

export const WinningBook = ({ open, onOpenChange, type }: WinningBookProps) => {
  const symbols = ['⛽️', '🏎️', '🔔', '🪓', '💣', '🔥'] as const;
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
    <div className="space-y-4 sm:space-y-6">
      {/* How to Win */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-3 sm:mb-4 font-press-start">How to Win</h3>
        <div className="bg-black/50 p-3 sm:p-4 border border-red-500/30 rounded-none">
          <ul className="text-white/90 text-xs sm:text-sm font-press-start space-y-2 sm:space-y-3">
            <li>• Match 3 of the same symbol in a line</li>
            <li>• Each line is evaluated separately</li>
            <li>• Multiple winning lines get bonus multipliers</li>
            <li>• Rarer symbols pay out more when you win</li>
            <li>• Near-misses with rare symbols give small rewards</li>
          </ul>
        </div>
      </div>

      {/* Symbol Payouts */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-3 sm:mb-4 font-press-start">Symbol Payouts</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {symbols.map(symbol => {
            const config = getSymbolConfig(symbol as Symbol);
            if (!config) return null;
            
            const probability = ((SYMBOL_VISUAL_WEIGHTS[symbol] / 100) * 100).toFixed(1);
            const rarity = SYMBOL_VISUAL_WEIGHTS[symbol] <= 10 ? 'Rare' : 
                          SYMBOL_VISUAL_WEIGHTS[symbol] <= 20 ? 'Uncommon' : 'Common';
            
            return (
              <div key={symbol} className="bg-black/50 p-3 sm:p-4 border border-red-500/30 rounded-none">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <span className="text-2xl sm:text-3xl">{symbol}</span>
                  <div className="flex flex-col">
                    <div className="text-white text-xs sm:text-sm font-press-start">
                      <div className="text-red-400">3 Symbols: x{config.multiplier.three}</div>
                      {config.consolationPrize > 0 && (
                        <div className="text-yellow-400">Near-miss: +{config.consolationPrize} FUEL</div>
                      )}
                    </div>
                    <small className="text-red-400/80 text-[10px] sm:text-xs font-sans font-normal tracking-wide mt-1">
                      {rarity} ({probability}% chance)
                    </small>
                  </div>
                </div>
                {symbol === '⛽️' ? (
                  <div className="text-white/80 text-[10px] sm:text-xs font-press-start bg-red-500/10 p-2 rounded-none">
                    Special: Triggers Jackpot when all lines win with max bet
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pay Lines */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-3 sm:mb-4 font-press-start">Pay Lines</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {lines.map(line => (
            <div key={line.index} className="bg-black/50 p-3 sm:p-4 border border-red-500/30 rounded-none">
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
    <div className="space-y-4 sm:space-y-6">
      {/* Betting Modes */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-3 sm:mb-4 font-press-start">Betting Modes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-black/50 p-3 sm:p-4 border border-red-500/30 rounded-none">
            <div className="text-white text-xs sm:text-sm font-press-start">Safe Bet</div>
            <div className="text-white/80 text-[10px] sm:text-xs mt-1">1 FUEL per line, middle row only</div>
            <div className="text-yellow-400/80 text-[10px] sm:text-xs mt-1">Best for beginners</div>
          </div>
          <div className="bg-black/50 p-3 sm:p-4 border border-red-500/30 rounded-none">
            <div className="text-white text-xs sm:text-sm font-press-start">Standard Bet</div>
            <div className="text-white/80 text-[10px] sm:text-xs mt-1">5 FUEL per line, all rows</div>
            <div className="text-yellow-400/80 text-[10px] sm:text-xs mt-1">Balanced risk/reward</div>
          </div>
          <div className="bg-black/50 p-3 sm:p-4 border border-red-500/30 rounded-none">
            <div className="text-white text-xs sm:text-sm font-press-start">Risky Bet</div>
            <div className="text-white/80 text-[10px] sm:text-xs mt-1">10 FUEL per line, rows + diagonals</div>
            <div className="text-yellow-400/80 text-[10px] sm:text-xs mt-1">Higher chance to win</div>
          </div>
          <div className="bg-black/50 p-3 sm:p-4 border border-red-500/30 rounded-none">
            <div className="text-white text-xs sm:text-sm font-press-start">Max Risk</div>
            <div className="text-white/80 text-[10px] sm:text-xs mt-1">20 FUEL per line, all lines</div>
            <div className="text-yellow-400/80 text-[10px] sm:text-xs mt-1">+20% bonus on wins</div>
          </div>
        </div>
      </div>

      {/* Jackpot Rules */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-3 sm:mb-4 font-press-start">Jackpot Rules</h3>
        <div className="bg-black/50 p-3 sm:p-4 border border-red-500/30 rounded-none">
          <ul className="text-white/90 text-xs sm:text-sm font-press-start space-y-2 sm:space-y-3">
            <li>• Only the fuel pump (⛽️) symbol can trigger the jackpot</li>
            <li>• Must bet max FUEL (20 per line)</li>
            <li>• All selected lines must show fuel pump (⛽️) symbols</li>
            <li>• Jackpot starts at 1000 FUEL and grows with each bet</li>
            <li>• 10% of each bet is added to the jackpot pool</li>
            <li>• Multiple winning lines get 10% bonus per line</li>
          </ul>
        </div>
      </div>

      {/* Game Mechanics */}
      <div>
        <h3 className="text-sm sm:text-base font-medium text-red-400 mb-3 sm:mb-4 font-press-start">Game Mechanics</h3>
        <div className="bg-black/50 p-3 sm:p-4 border border-red-500/30 rounded-none">
          <ul className="text-white/90 text-xs sm:text-sm font-press-start space-y-2 sm:space-y-3">
            <li>• Each symbol has a different chance of appearing</li>
            <li>• Rarer symbols pay out more when you win</li>
            <li>• Match 3 symbols in a line to win</li>
            <li>• Near-misses with rare symbols give small rewards</li>
            <li>• Game resets when balance reaches 0</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm p-4 sm:p-6 rounded-none shadow-[0_0_15px_rgba(255,0,0,0.3)] border-2 border-red-500/50 w-[95vw] sm:w-[90vw] max-w-4xl max-h-[90vh] flex flex-col">
          <Dialog.Title className="text-base sm:text-lg font-medium text-white mb-4 sm:mb-6 font-press-start flex-shrink-0">
            {type === 'combinations' ? 'Winning Combinations' : 'Game Rules'}
          </Dialog.Title>
          
          <div className="flex-grow overflow-y-auto pr-2 -mr-2">
            {type === 'combinations' ? renderWinningCombinations() : renderGameRules()}
          </div>

          <div className="mt-4 sm:mt-6 flex justify-end flex-shrink-0">
            <Dialog.Close className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-none hover:bg-red-700 transition-colors font-press-start text-xs sm:text-sm">
              Close
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}; 