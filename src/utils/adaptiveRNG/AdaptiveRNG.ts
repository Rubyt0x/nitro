import {
  Symbol,
  SYMBOL_WEIGHTS,
  RNG_CONFIG,
  JACKPOT_CONFIG,
  VOLATILITY_SETTINGS,
  NEAR_MISS_PROBABILITIES,
  PAYOUT_MULTIPLIERS
} from './config';

interface GameState {
  currentRTP: number;
  sessionWins: number;
  sessionSpins: number;
  volatilityLevel: keyof typeof VOLATILITY_SETTINGS;
  lastWinAmount: number;
  consecutiveLosses: number;
  spinsSinceJackpot: number;
  totalWagered: number;
  lastActivityTime: number;
  fuelPumpWeight: number;
}

export class AdaptiveRNG {
  private currentWeights: Record<Symbol, number>;
  private gameState: GameState;
  private boostMultiplier: number;
  private rngSeed: number;

  constructor() {
    this.currentWeights = { ...SYMBOL_WEIGHTS };
    this.gameState = {
      currentRTP: RNG_CONFIG.TARGET_RTP,
      sessionWins: 0,
      sessionSpins: 0,
      volatilityLevel: 'MEDIUM',
      lastWinAmount: 0,
      consecutiveLosses: 0,
      spinsSinceJackpot: 0,
      totalWagered: 0,
      lastActivityTime: Date.now(),
      fuelPumpWeight: JACKPOT_CONFIG.BASE_WEIGHT
    };
    this.boostMultiplier = 1.0;
    this.rngSeed = Date.now();
  }

  private seededRandom(): number {
    this.rngSeed = (this.rngSeed * 16807) % 2147483647;
    return (this.rngSeed - 1) / 2147483646;
  }

  private updateRTP(winAmount: number, betAmount: number): void {
    const spinRTP = winAmount / betAmount;
    this.gameState.currentRTP = (1 - RNG_CONFIG.EMA_SMOOTHING) * this.gameState.currentRTP + 
                               RNG_CONFIG.EMA_SMOOTHING * spinRTP;
  }

  private updateFuelPumpWeight(betAmount: number): void {
    // Calculate time-based boost
    const currentTime = Date.now();
    const minutesSinceLastActivity = (currentTime - this.gameState.lastActivityTime) / (1000 * 60);
    this.gameState.lastActivityTime = currentTime;

    // Apply decay if no activity
    if (minutesSinceLastActivity > 1) {
      this.gameState.fuelPumpWeight *= Math.pow(JACKPOT_CONFIG.DECAY_RATE, minutesSinceLastActivity);
    }

    // Calculate boosts
    const spinBoost = this.gameState.spinsSinceJackpot * JACKPOT_CONFIG.SPIN_BOOST;
    const betBoost = betAmount * JACKPOT_CONFIG.BET_BOOST;
    const timeBoost = minutesSinceLastActivity * JACKPOT_CONFIG.TIME_BOOST;

    // Apply boosts
    this.gameState.fuelPumpWeight = Math.min(
      JACKPOT_CONFIG.BASE_WEIGHT + spinBoost + betBoost + timeBoost,
      JACKPOT_CONFIG.MAX_WEIGHT
    );

    // Update current weights
    this.currentWeights['⛽️'] = this.gameState.fuelPumpWeight;
  }

  private adjustWeights(): void {
    const rtpDiff = RNG_CONFIG.TARGET_RTP - this.gameState.currentRTP;
    const volatilitySettings = VOLATILITY_SETTINGS[this.gameState.volatilityLevel];
    
    // Calculate boost based on RTP difference and consecutive losses
    let boost = Math.min(
      Math.abs(rtpDiff) * RNG_CONFIG.INCREMENTAL_BOOST_STEP * volatilitySettings.BOOST_MULTIPLIER,
      RNG_CONFIG.MAX_BOOST_MULTIPLIER
    );
    
    if (this.gameState.consecutiveLosses > 5) {
      boost *= 1 + (this.gameState.consecutiveLosses - 5) * 0.1;
    }

    // Apply weight adjustments to all symbols except Fuel Pump
    (Object.keys(this.currentWeights) as Symbol[]).forEach((symbol) => {
      if (symbol === '⛽️') return; // Skip Fuel Pump as it's handled separately
      
      const baseWeight = SYMBOL_WEIGHTS[symbol];
      const variance = volatilitySettings.WEIGHT_VARIANCE;
      
      if (rtpDiff > 0) {
        // Increase weights for lower-paying symbols
        if (PAYOUT_MULTIPLIERS[symbol][3] <= 100) {
          this.currentWeights[symbol] = baseWeight * (1 + boost);
        } else {
          this.currentWeights[symbol] = baseWeight * (1 - boost);
        }
      } else {
        // Increase weights for higher-paying symbols
        if (PAYOUT_MULTIPLIERS[symbol][3] > 100) {
          this.currentWeights[symbol] = baseWeight * (1 + boost);
        } else {
          this.currentWeights[symbol] = baseWeight * (1 - boost);
        }
      }

      // Add random variance based on volatility
      const randomVariance = (this.seededRandom() - 0.5) * variance;
      this.currentWeights[symbol] *= (1 + randomVariance);
    });

    // Normalize weights to ensure they sum to 1
    const totalWeight = Object.values(this.currentWeights).reduce((a, b) => a + b, 0);
    (Object.keys(this.currentWeights) as Symbol[]).forEach((symbol) => {
      this.currentWeights[symbol] /= totalWeight;
    });
  }

  private generateSymbol(): Symbol {
    const random = this.seededRandom();
    let cumulativeWeight = 0;
    
    for (const [symbol, weight] of Object.entries(this.currentWeights)) {
      cumulativeWeight += weight;
      if (random <= cumulativeWeight) {
        return symbol as Symbol;
      }
    }
    
    return '🔥'; // Fallback to most common symbol
  }

  private shouldCreateNearMiss(): boolean {
    const random = this.seededRandom();
    const baseProb = this.gameState.consecutiveLosses * 0.05;
    return random < Math.min(0.5, baseProb);
  }

  private generateNearMissPattern(symbol: Symbol): Symbol[] {
    const pattern = Array(3).fill(symbol);
    const missPosition = Math.floor(this.seededRandom() * 3);
    pattern[missPosition] = this.generateSymbol();
    return pattern;
  }

  public spin(betAmount: number): { matrix: Symbol[][], winAmount: number } {
    this.gameState.sessionSpins++;
    this.gameState.spinsSinceJackpot++;
    this.gameState.totalWagered += betAmount;
    
    // Update Fuel Pump weight based on current game state
    this.updateFuelPumpWeight(betAmount);
    this.adjustWeights();

    // Generate a 3x3 matrix
    const matrix: Symbol[][] = Array(3).fill(null).map(() => Array(3).fill(null));
    
    // Fill each column with symbols
    for (let col = 0; col < 3; col++) {
      if (this.shouldCreateNearMiss()) {
        const targetSymbol = this.generateSymbol();
        const pattern = this.generateNearMissPattern(targetSymbol);
        for (let row = 0; row < 3; row++) {
          matrix[col][row] = pattern[row];
        }
      } else {
        for (let row = 0; row < 3; row++) {
          matrix[col][row] = this.generateSymbol();
        }
      }
    }

    // Calculate win amount based on the matrix
    const winAmount = this.calculateWinAmount(matrix, betAmount);
    this.updateGameState(winAmount, betAmount);

    // Log RNG values and weights for each symbol
    console.log('\n=== RNG Values for Spin ===');
    console.log('Current Weights:');
    Object.entries(this.currentWeights).forEach(([symbol, weight]) => {
      console.log(`${symbol}: ${weight.toFixed(4)}`);
    });
    console.log('\nGenerated Matrix:');
    matrix.forEach((col, i) => console.log(`Column ${i + 1}:`, col));
    console.log('Win Amount:', winAmount);
    console.log('Current RTP:', this.gameState.currentRTP.toFixed(4));
    console.log('Volatility Level:', this.gameState.volatilityLevel);
    console.log('Consecutive Losses:', this.gameState.consecutiveLosses);
    console.log('Spins Since Jackpot:', this.gameState.spinsSinceJackpot);
    console.log('Fuel Pump Weight:', this.gameState.fuelPumpWeight.toFixed(4));
    console.log('========================\n');

    return { matrix, winAmount };
  }

  private calculateWinAmount(matrix: Symbol[][], betAmount: number): number {
    // Count symbols in each line
    const lines = [
      // Horizontal lines
      [matrix[0][0], matrix[1][0], matrix[2][0]], // Top row
      [matrix[0][1], matrix[1][1], matrix[2][1]], // Middle row
      [matrix[0][2], matrix[1][2], matrix[2][2]], // Bottom row
      // Diagonal lines
      [matrix[0][0], matrix[1][1], matrix[2][2]], // Top-left to bottom-right
      [matrix[0][2], matrix[1][1], matrix[2][0]], // Top-right to bottom-left
      // Vertical lines
      [matrix[0][0], matrix[0][1], matrix[0][2]], // Left column
      [matrix[1][0], matrix[1][1], matrix[1][2]], // Middle column
      [matrix[2][0], matrix[2][1], matrix[2][2]]  // Right column
    ];

    let maxPayout = 0;
    lines.forEach(line => {
      const symbolCount = line.reduce((acc, symbol) => {
        acc[symbol] = (acc[symbol] || 0) + 1;
        return acc;
      }, {} as Record<Symbol, number>);

      (Object.entries(symbolCount) as [Symbol, number][]).forEach(([symbol, count]) => {
        const payout = PAYOUT_MULTIPLIERS[symbol][count];
        maxPayout = Math.max(maxPayout, payout);
      });
    });

    return maxPayout * betAmount;
  }

  private updateGameState(winAmount: number, betAmount: number): void {
    this.updateRTP(winAmount, betAmount);
    
    if (winAmount > 0) {
      this.gameState.sessionWins++;
      this.gameState.lastWinAmount = winAmount;
      this.gameState.consecutiveLosses = 0;
      
      // Check if this was a jackpot win
      if (this.isJackpotWin(winAmount, betAmount)) {
        this.gameState.spinsSinceJackpot = 0;
        if (JACKPOT_CONFIG.RESET_ON_JACKPOT) {
          this.gameState.fuelPumpWeight = JACKPOT_CONFIG.BASE_WEIGHT;
        }
      }
    } else {
      this.gameState.consecutiveLosses++;
    }

    // Adjust volatility based on session performance
    if (this.gameState.sessionSpins % 10 === 0) {
      const winRate = this.gameState.sessionWins / this.gameState.sessionSpins;
      if (winRate < 0.2) {
        this.gameState.volatilityLevel = 'LOW';
      } else if (winRate > 0.4) {
        this.gameState.volatilityLevel = 'HIGH';
      } else {
        this.gameState.volatilityLevel = 'MEDIUM';
      }
    }
  }

  private isJackpotWin(winAmount: number, betAmount: number): boolean {
    // Define what constitutes a jackpot win
    return winAmount >= betAmount * 100; // Example: 100x bet is a jackpot
  }

  public getGameState(): GameState {
    return { ...this.gameState };
  }

  public getCurrentWeights(): Record<Symbol, number> {
    return { ...this.currentWeights };
  }
} 