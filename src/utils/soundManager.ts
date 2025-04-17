import { Howl } from 'howler';

export type SoundType = 'spin' | 'winBomb' | 'winFire' | 'winCar' | 'winBell' | 'winAxe' | 'winJackpot';

interface SoundConfig {
  src: string[];
  volume: number;
}

const soundConfig: Record<SoundType, SoundConfig> = {
  spin: {
    src: ['/sounds/spin.mp3'],
    volume: 0.7
  },
  winBomb: {
    src: ['/sounds/winBomb.mp3'],
    volume: 0.7
  },
  winFire: {
    src: ['/sounds/winFire.mp3'],
    volume: 0.7
  },
  winCar: {
    src: ['/sounds/winCar.mp3'],
    volume: 0.7
  },
  winBell: {
    src: ['/sounds/winBell.mp3'],
    volume: 0.7
  },
  winAxe: {
    src: ['/sounds/winAxe.mp3'],
    volume: 0.7
  },
  winJackpot: {
    src: ['/sounds/jackpot.mp3'],
    volume: 1.0
  }
};

let sounds: Record<SoundType, Howl> = {} as Record<SoundType, Howl>;
let isMuted = false;

export const initSounds = () => {
  Object.entries(soundConfig).forEach(([type, config]) => {
    sounds[type as SoundType] = new Howl({
      src: config.src,
      volume: config.volume,
      preload: true
    });
  });
};

export const playSound = (type: SoundType) => {
  if (!isMuted && sounds[type]) {
    sounds[type].play();
  }
};

export const stopSound = (type: SoundType) => {
  if (sounds[type]) {
    sounds[type].stop();
  }
};

export const toggleMute = () => {
  isMuted = !isMuted;
  return isMuted;
};

export const getMuteState = () => isMuted;

export const playWinSound = (winningSymbols: string[], isJackpot: boolean) => {
  if (isJackpot) {
    playSound('winJackpot');
  } else if (winningSymbols.length > 0) {
    // Play the appropriate sound based on the first winning symbol
    const symbolSounds: Record<string, SoundType> = {
      '💣': 'winBomb',
      '🔥': 'winFire',
      '🏎️': 'winCar',
      '🔔': 'winBell',
      '🪓': 'winAxe'
    };
    
    const symbol = winningSymbols[0];
    const soundType = symbolSounds[symbol];
    if (soundType) {
      playSound(soundType);
    }
  }
}; 