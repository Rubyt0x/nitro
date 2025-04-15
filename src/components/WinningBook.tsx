import * as Dialog from '@radix-ui/react-dialog';
import { Symbol } from '../types/game';
import { getSymbolConfig } from '../utils/symbols';

interface WinningBookProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const WinningBook = ({ open, onOpenChange }: WinningBookProps) => {
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

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/90 backdrop-blur-sm p-4 sm:p-6 rounded-none shadow-[0_0_15px_rgba(255,0,0,0.3)] border-2 border-red-500/50 w-[90vw] max-w-2xl flex flex-col max-h-[85vh]">
          <Dialog.Title className="text-base sm:text-lg md:text-xl font-medium text-white mb-4 font-press-start flex-shrink-0">
            Winning Combinations
          </Dialog.Title>
          
          <div className="overflow-y-auto flex-grow pr-2 -mr-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {symbols.map(symbol => {
                const config = getSymbolConfig(symbol as Symbol);
                if (!config) return null;
                
                return (
                  <div key={symbol} className="bg-black/50 p-4 border border-red-500/30">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{symbol}</span>
                      <span className="text-white/90 font-press-start">x{config.multiplier}</span>
                    </div>
                    <div className="text-xs text-red-400/70 font-press-start">
                      Jackpot: x{config.jackpotMultiplier} (Requires Max Bet)
                    </div>
                  </div>
                );
              })}
            </div>

            <div>
              <Dialog.Title className="text-base sm:text-lg md:text-xl font-medium text-white mb-4 font-press-start flex-shrink-0">
                Pay Lines
              </Dialog.Title>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {lines.map(line => (
                  <div key={line.index} className="bg-black/50 p-4 border border-red-500/30">
                    <div className="text-white/90 font-press-start">{line.name}</div>
                    <div className="text-xs text-red-400/70 font-press-start mt-1">
                      Line #{line.index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end flex-shrink-0">
            <Dialog.Close className="px-4 py-2 bg-red-600 text-white rounded-none hover:bg-red-700 transition-colors font-press-start">
              Close
            </Dialog.Close>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}; 