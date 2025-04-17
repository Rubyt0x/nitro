import { useState } from 'react';
import * as Select from '@radix-ui/react-select';
import { BetMode } from '../types/game';
import { Coins } from 'lucide-react';
import { BET_MODES } from '../utils/betModes';

interface ControlsProps {
  balance: number;
  betMode: BetMode;
  onBetModeChange: (mode: BetMode) => void;
  onSpin: () => void;
  disabled: boolean;
  lastWin: number;
}

export const Controls = ({
  balance,
  betMode,
  onBetModeChange,
  onSpin,
  disabled,
  lastWin
}: ControlsProps) => {
  return (
    <div className="flex flex-col items-center gap-6 mt-8">
      <div className="flex gap-12 text-slate-900">
        <div className="text-center">
          <div className="text-sm text-slate-500 font-medium mb-1">Balance</div>
          <div className="text-2xl font-semibold">{balance}</div>
        </div>
        <div className="text-center">
          <div className="text-sm text-slate-500 font-medium mb-1">Last Win</div>
          <div className="text-2xl font-semibold">{lastWin}</div>
        </div>
      </div>
      
      <div className="flex gap-4 items-center">
        <Select.Root value={betMode.name} onValueChange={(value) => {
          const mode = BET_MODES.find(m => m.name === value);
          if (mode) onBetModeChange(mode);
        }}>
          <Select.Trigger className="inline-flex items-center justify-center px-4 py-2 bg-red-900 rounded-lg text-white hover:bg-red-800 transition-colors min-w-[120px]">
            <Coins className="w-4 h-4 mr-2 text-slate-600" />
            <Select.Value />
          </Select.Trigger>
          
          <Select.Portal>
            <Select.Content className="bg-red-900 rounded-lg p-1 shadow-xl border border-red-800">
              <Select.Viewport>
                {BET_MODES.map((mode) => (
                  <Select.Item
                    key={mode.name}
                    value={mode.name}
                    className="px-4 py-2 text-white hover:bg-red-800 rounded cursor-pointer outline-none"
                  >
                    <Select.ItemText>{mode.name} ({mode.betAmount})</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        
        <button
          onClick={onSpin}
          disabled={disabled || balance < betMode.betAmount}
          className={`px-8 py-3 rounded-lg text-white font-medium transition-all
            ${disabled || balance < betMode.betAmount
              ? 'bg-red-800 cursor-not-allowed'
              : 'bg-red-900 hover:bg-red-800 active:scale-[0.98]'
            }`}
        >
          SPIN
        </button>
      </div>
    </div>
  );
};