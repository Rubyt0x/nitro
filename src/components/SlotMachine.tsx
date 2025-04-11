import { useState, useCallback } from 'react';
import { Reel } from './Reel';
import { Controls } from './Controls';
import { ResultMatrix, Symbol, BetMode } from '../types/game';
import { generateResultMatrix } from '../utils/symbols';
import { evaluateWin } from '../utils/winEvaluator';
import { BET_MODES } from '../utils/betModes';
import * as Toast from '@radix-ui/react-toast';
import * as Dialog from '@radix-ui/react-dialog';

export const SlotMachine = () => {
  const [balance, setBalance] = useState(100);
  const [betMode, setBetMode] = useState<BetMode>(BET_MODES[0]);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<ResultMatrix>([
    ['🍀', '🍋', '🍒'],
    ['🍋', '🔔', '🍀'],
    ['🍒', '🍀', '🍋']
  ]);
  const [lastWin, setLastWin] = useState(0);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleSpin = useCallback(() => {
    if (spinning || balance < betMode.betAmount) return;

    setSpinning(true);
    setBalance(prev => prev - betMode.betAmount);
    
    const newResult = generateResultMatrix();
    setResult(newResult);
    
    setTimeout(() => {
      const winResult = evaluateWin(newResult, betMode);
      if (winResult.winnings > 0) {
        setBalance(prev => prev + winResult.winnings);
        setLastWin(winResult.winnings);
      } else {
        setLastWin(0);
      }
      setSpinning(false);
      
      if (balance - betMode.betAmount <= 0 && winResult.winnings === 0) {
        setShowResetDialog(true);
      }
    }, 2500);
  }, [spinning, balance, betMode]);

  const resetGame = () => {
    setBalance(100);
    setBetMode(BET_MODES[0]);
    setLastWin(0);
    setShowResetDialog(false);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="bg-white rounded-2xl p-8 shadow-lg shadow-black/5">
        <div className="flex gap-2 bg-slate-50 p-6 rounded-xl">
          {[0, 1, 2].map(i => (
            <Reel
              key={i}
              finalSymbols={result[i]}
              spinning={spinning}
              delay={i * 0.2}
            />
          ))}
        </div>

        <Controls
          balance={balance}
          betMode={betMode}
          onBetModeChange={setBetMode}
          onSpin={handleSpin}
          disabled={spinning}
          lastWin={lastWin}
        />
      </div>

      <Toast.Provider>
        <Toast.Root
          open={lastWin > 0}
          onOpenChange={() => setLastWin(0)}
          className="bg-white text-slate-900 p-4 rounded-lg shadow-xl border border-slate-200 flex items-center gap-2"
        >
          <div className="text-2xl">
            {lastWin >= 100 ? '🎰' : '🎉'}
          </div>
          <Toast.Title className="font-medium">
            {lastWin >= 100 
              ? `JACKPOT! You won ${lastWin} credits!`
              : `You won ${lastWin} credits!`}
          </Toast.Title>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-4 right-4" />
      </Toast.Provider>

      <Dialog.Root open={showResetDialog} onOpenChange={setShowResetDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/20 backdrop-blur-sm" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl w-[90vw] max-w-md">
            <Dialog.Title className="text-xl font-medium text-slate-900 mb-4">
              Game Over
            </Dialog.Title>
            <Dialog.Description className="text-slate-600 mb-6">
              You've run out of credits. Would you like to play again?
            </Dialog.Description>
            <div className="flex justify-end gap-4">
              <button
                onClick={resetGame}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Play Again
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};