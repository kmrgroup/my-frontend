import { pow_fnn_hash, verifyPowFnn } from './powFnn';

// Worker state
let isRunning = false;
let difficulty = 1;
let powerMode = 'balanced';
let lastHashTime = Date.now();
let hashCount = 0;

// Initialize worker
function initializeWorker() {
  try {
    // Log successful initialization
    console.log('Mining worker initialized');
    self.postMessage({ type: 'initialized' });
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to initialize mining worker';
    console.error('Mining worker initialization error:', errorMessage);
    self.postMessage({
      type: 'error',
      data: { error: errorMessage }
    });
    return false;
  }
}

function calculateHashRate() {
  const now = Date.now();
  const timeDiff = (now - lastHashTime) / 1000;
  const rate = hashCount / timeDiff;
  hashCount = 0;
  lastHashTime = now;
  return rate;
}

function calculateReward(difficulty: number): number {
  const baseReward = 0.00001;
  const difficultyMultiplier = Math.pow(1.5, difficulty);
  const hashRateBonus = calculateHashRateBonus(calculateHashRate());
  const uptimeBonus = calculateUptimeBonus();

  return baseReward * difficultyMultiplier * hashRateBonus * uptimeBonus;
}

function calculateHashRateBonus(hashRate: number): number {
  return Math.min(1.5, 1 + (hashRate / 1000) * 0.1);
}

function calculateUptimeBonus(): number {
  const uptime = (Date.now() - startTime) / (60 * 60 * 1000);
  return Math.min(1.2, 1 + (uptime * 0.01));
}

function generateHash(): string {
  return crypto.randomUUID();
}

async function mineBlock() {
  if (!isRunning) return;

  try {
    const timestamp = Date.now();
    const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    const hash = generateHash();

    hashCount++;

    // Simulate mining success based on difficulty
    if (Math.random() < 1 / (difficulty * 10)) {
      const reward = calculateReward(difficulty);

      self.postMessage({
        type: 'reward',
        data: {
          amount: reward.toString(),
          hash: hash,
          metrics: {
            accuracy: '0.85',
            loss: '0.15'
          },
          difficulty: difficulty.toString()
        }
      });
    }

    if (Date.now() - lastHashTime >= 1000) {
      self.postMessage({
        type: 'hash',
        data: { hashRate: calculateHashRate() }
      });
    }

    const powerModeDelayMultiplier = {
      'efficient': 2.0,
      'balanced': 1.0,
      'performance': 0.5
    }[powerMode] || 1.0;

    const delay = Math.max(10, Math.min(50, difficulty * 10 * powerModeDelayMultiplier));
    setTimeout(mineBlock, delay);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown mining error';
    console.error('Mining error:', errorMessage);

    self.postMessage({
      type: 'error',
      data: { error: errorMessage }
    });

    setTimeout(() => {
      if (isRunning) {
        mineBlock();
      }
    }, 5000);
  }
}

const startTime = Date.now();

// Initialize the worker
initializeWorker();

// Handle messages from the main thread
self.onmessage = (event) => {
  try {
    if (!event.data || typeof event.data !== 'object') {
      throw new Error('Invalid message format');
    }

    const { type, data } = event.data;

    if (!type || typeof type !== 'string') {
      throw new Error('Missing or invalid command type');
    }

    switch (type) {
      case 'start':
        isRunning = true;
        if (data?.config) {
          powerMode = data.config.powerMode || 'balanced';
        }
        console.log('Starting mining with power mode:', powerMode);
        mineBlock();
        break;

      case 'pause':
        isRunning = false;
        console.log('Mining paused');
        break;

      case 'setDifficulty':
        if (data && typeof data.difficulty === 'number' && !isNaN(data.difficulty)) {
          difficulty = Math.max(1, data.difficulty);
          console.log('Difficulty updated:', difficulty);
        } else {
          console.warn('Invalid difficulty value:', data?.difficulty);
        }
        break;

      case 'setPowerMode':
        if (data?.mode && ['efficient', 'balanced', 'performance'].includes(data.mode)) {
          powerMode = data.mode;
          console.log('Power mode updated:', powerMode);
        } else {
          console.warn('Invalid power mode:', data?.mode);
        }
        break;

      default:
        throw new Error(`Unknown command type: ${type}`);
    }
  } catch (error) {
    console.error('Error handling worker message:', error);
    self.postMessage({
      type: 'error',
      data: { error: error instanceof Error ? error.message : 'Failed to process mining command' }
    });
  }
};

// Handle worker errors
self.onerror = (error) => {
  console.error('Worker error:', error);
  self.postMessage({
    type: 'error',
    data: { error: 'Mining worker encountered a critical error' }
  });
};