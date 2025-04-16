import { Howl } from 'howler';

// Define sound types
type SoundType = 
  | 'spin' 
  | 'winAxe'
  | 'winBell'
  | 'winBomb'
  | 'winCar'
  | 'winDouble'
  | 'winFuel'
  | 'winSingle'
  | 'winTriple'
  | 'jackpot'
  | 'win'
  | 'win7'
  | 'button'
  | 'gameOver';

// Define rare symbols and their values
const RARE_SYMBOLS: Record<string, number> = {
  '⛽️': 6, // Fuel is most rare
  '🏎️': 5, // Car is second most rare
  '🔥': 4, // Fire is third most rare
  '🔔': 3, // Bell is fourth most rare
  '🪓': 2, // Axe is fifth most rare
  '💣': 1  // Bomb is least rare
};

// Sound configuration with adjusted volumes for casino-style sounds
const soundConfig: Record<SoundType, { src: string; volume: number }> = {
  spin: { src: '/sounds/spin.mp3', volume: 0.5 },
  winAxe: { src: '/sounds/winAxe.mp3', volume: 0.8 },
  winBell: { src: '/sounds/winBell.mp3', volume: 0.8 },
  winBomb: { src: '/sounds/winBomb.mp3', volume: 0.8 },
  winCar: { src: '/sounds/winCar.mp3', volume: 0.8 },
  winDouble: { src: '/sounds/winDouble.mp3', volume: 0.8 },
  winFuel: { src: '/sounds/winFuel.mp3', volume: 0.8 },
  winSingle: { src: '/sounds/winSingle.mp3', volume: 0.8 },
  winTriple: { src: '/sounds/winTriple.mp3', volume: 0.8 },
  jackpot: { src: '/sounds/jackpot.mp3', volume: 0.9 },
  win: { src: '/sounds/win.mp3', volume: 0.8 },
  win7: { src: '/sounds/win7.mp3', volume: 0.9 },
  button: { src: '/sounds/button.mp3', volume: 0.3 },
  gameOver: { src: '/sounds/gameOver.mp3', volume: 0.5 }
};

// Sound instances
const sounds: Record<SoundType, Howl> = {} as Record<SoundType, Howl>;
let isMuted = false;

// Initialize sounds
export const initSounds = () => {
  Object.entries(soundConfig).forEach(([type, config]) => {
    sounds[type as SoundType] = new Howl({
      src: [config.src],
      volume: config.volume,
      preload: true,
    });
  });
};

// Play a sound
export const playSound = (soundName: SoundType) => {
  if (isMuted) return;
  // Stop all other sounds before playing a new one
  Object.values(sounds).forEach(sound => sound.stop());
  sounds[soundName].play();
};

// Stop a sound
export const stopSound = (soundName: SoundType) => {
  sounds[soundName].stop();
};

// Toggle mute state
export const toggleMute = () => {
  isMuted = !isMuted;
  if (isMuted) {
    Object.values(sounds).forEach(sound => sound.stop());
  }
  return isMuted;
};

// Get mute state
export const getMuteState = () => isMuted;

// Helper function to get the sound name for a symbol
const getSymbolSound = (symbol: string): SoundType => {
  const symbolSounds: Record<string, SoundType> = {
    '💣': 'winBomb',
    '🪓': 'winAxe',
    '🏎️': 'winCar',
    '🔥': 'win',
    '⛽️': 'winFuel',
    '🔔': 'winBell'
  };
  return symbolSounds[symbol] || 'win';
};

// Helper function to check if a symbol is rare
const isRareSymbol = (symbol: string): boolean => {
  return RARE_SYMBOLS[symbol] !== undefined;
};

// Helper function to get the rarity value of a symbol
const getSymbolRarity = (symbol: string): number => {
  return RARE_SYMBOLS[symbol] || 0;
};

// Helper function to determine which win sound to play
export const playWinSound = (winningCombinations: { symbol: string; count: number }[]) => {
  if (isMuted) return;
  if (winningCombinations && winningCombinations.length > 0) {
    // Check if any win is a jackpot (⛽️ symbol with high multiplier)
    const hasJackpot = winningCombinations.some(win => 
      win.symbol === '⛽️' && win.count >= 3
    );
    
    if (hasJackpot) {
      playSound('jackpot');
    } else {
      // Play the appropriate win sound based on the symbol
      const mainWin = winningCombinations[0];
      const soundType = getSymbolSound(mainWin.symbol);
      
      // Play different sounds based on the number of matches
      if (mainWin.count === 3) {
        playSound('winTriple');
      } else if (mainWin.count === 2) {
        playSound('winDouble');
      } else {
        playSound('winSingle');
      }
      
      // Also play the symbol-specific sound
      playSound(soundType);
    }
  }
}; 