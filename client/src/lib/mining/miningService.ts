import EventEmitter from 'eventemitter3';
import { miningUpdateSchema, type MiningUpdate } from "@shared/schema";

interface MiningStats {
  hashRate: number;
  totalHashes: number;
  difficulty: number;
  rewards: number;
  temperature: number;
  cpuUsage: number;
  accuracy: number;
  loss: number;
  modelHash: string;
  powerMode: 'efficient' | 'balanced' | 'performance';
}

interface MiningWorkerMessage {
  type: 'hash' | 'reward' | 'error' | 'setDifficulty' | 'setPowerMode' | 'start' | 'pause' | 'initialized';
  data?: any;
}

interface WorkerConfig {
  powerMode: 'efficient' | 'balanced' | 'performance';
}

// Wrap the worker creation in a function that handles initialization errors
async function createMiningWorker(): Promise<Worker> {
  try {
    const worker = new Worker(new URL('./miningWorker.ts', import.meta.url), {
      type: 'module',
    });

    // Wait for worker initialization
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Worker initialization timeout'));
      }, 5000);

      worker.onmessage = (event) => {
        if (event.data.type === 'initialized') {
          clearTimeout(timeout);
          resolve(true);
        }
      };

      worker.onerror = (error) => {
        clearTimeout(timeout);
        reject(error);
      };
    });

    return worker;
  } catch (error) {
    console.error('Failed to create mining worker:', error);
    throw error;
  }
}

export class MiningService extends EventEmitter {
  private isRunning: boolean = false;
  private worker: Worker | null = null;
  private stats: MiningStats = {
    hashRate: 0,
    totalHashes: 0,
    difficulty: 1,
    rewards: 0,
    temperature: 20,
    cpuUsage: 0,
    accuracy: 0,
    loss: 0,
    modelHash: '',
    powerMode: 'balanced'
  };

  private maxTemp = 75;
  private maxCPUUsage = 80;
  private difficultyAdjustmentInterval = 10000;
  private lastAdjustmentTime = Date.now();
  private isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  constructor() {
    super();
    this.initializeService();
  }

  private async initializeService() {
    try {
      await this.initializeWorker();
      this.monitorResources();

      if (this.isMobile) {
        this.stats.powerMode = 'efficient';
        this.maxTemp = 65;
        this.maxCPUUsage = 60;
        this.difficultyAdjustmentInterval = 15000;
      }
    } catch (error) {
      console.error('Failed to initialize mining service:', error);
      this.emit('error', 'Failed to initialize mining service');
    }
  }

  private async initializeWorker() {
    try {
      this.worker = await createMiningWorker();

      this.worker.onmessage = async (event: MessageEvent<MiningWorkerMessage>) => {
        try {
          const { type, data } = event.data;

          switch (type) {
            case 'initialized':
              console.log('Mining worker initialized successfully');
              break;

            case 'hash':
              this.stats.totalHashes++;
              this.stats.hashRate = data.hashRate;
              this.emit('hashUpdate', this.stats);
              break;

            case 'reward':
              try {
                const userId = sessionStorage.getItem("userId");
                if (!userId) {
                  throw new Error('No user ID found');
                }

                const miningUpdate: MiningUpdate = {
                  userId: parseInt(userId, 10),
                  mined: data.amount.toString(),
                  hashRate: this.stats.hashRate,
                  modelHash: data.hash,
                  accuracy: data.metrics.accuracy,
                  loss: data.metrics.loss,
                  difficulty: data.difficulty
                };

                const result = await this.submitMiningReward(miningUpdate);
                this.stats.rewards += parseFloat(data.amount);
                this.stats.accuracy = parseFloat(data.metrics.accuracy);
                this.stats.loss = parseFloat(data.metrics.loss);
                this.stats.modelHash = data.hash;

                this.emit('reward', {
                  amount: parseFloat(data.amount),
                  totalRewards: this.stats.rewards,
                  metrics: data.metrics
                });
              } catch (error) {
                console.error('Mining reward processing failed:', error);
                this.emit('error', error instanceof Error ? error.message : 'Failed to process mining reward');
              }
              break;

            case 'error':
              console.error('Mining worker error:', data.error);
              this.emit('error', data.error);
              break;
          }
        } catch (error) {
          console.error('Error handling worker message:', error);
          this.emit('error', 'Internal mining service error');
        }
      };

      this.worker.onerror = async (error: ErrorEvent) => {
        console.error('Mining worker error:', error.message);
        this.emit('error', `Mining worker error: ${error.message}`);

        if (this.isRunning) {
          console.log('Attempting to restart mining worker...');
          await this.stopMining();
          setTimeout(async () => {
            try {
              await this.initializeWorker();
              this.startMining();
            } catch (initError) {
              console.error('Failed to reinitialize worker:', initError);
              this.emit('error', 'Failed to recover mining worker');
            }
          }, 5000);
        }
      };

    } catch (error) {
      console.error('Failed to initialize mining worker:', error);
      this.emit('error', 'Failed to initialize mining system');
      throw error;
    }
  }

  private async submitMiningReward(reward: MiningUpdate): Promise<any> {
    try {
      const userId = sessionStorage.getItem("userId");
      if (!userId) {
        throw new Error('No user ID found');
      }

      console.log('Submitting mining reward:', reward);

      const response = await fetch(`/api/mining/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mined: reward.mined.toString(),
          hashRate: reward.hashRate,
          modelHash: reward.modelHash,
          accuracy: reward.accuracy.toString(),
          loss: reward.loss.toString(),
          difficulty: reward.difficulty.toString()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Mining reward submission failed:', errorData);
        throw new Error(errorData.error || 'Failed to submit mining reward');
      }

      return await response.json();
    } catch (error) {
      console.error('Error submitting mining reward:', error);
      throw error;
    }
  }

  private monitorResources() {
    try {
      setInterval(() => {
        this.updateSystemStats();
        this.adjustDifficulty();
        this.emit('statsUpdate', this.stats);
      }, 1000);
    } catch (error) {
      console.error('Error in resource monitoring:', error);
    }
  }

  private updateSystemStats() {
    try {
      performance.mark('cpu-start');
      // Do some calculations
      performance.mark('cpu-end');
      const measure = performance.measure('cpu', 'cpu-start', 'cpu-end');
      this.stats.cpuUsage = Math.min((measure.duration / 10) * 100, 100);

      if (this.isMobile && 'getBattery' in navigator) {
        (navigator as any).getBattery().then((battery: any) => {
          if (battery.level < 0.2 && !battery.charging) {
            this.setPowerMode('efficient');
            this.emit('warning', 'Low battery: Switched to efficient mode');
          }
        });
      }
    } catch (error) {
      console.warn('Error updating system stats:', error);
    }
  }

  private adjustDifficulty() {
    try {
      const now = Date.now();
      if (now - this.lastAdjustmentTime >= this.difficultyAdjustmentInterval) {
        const powerModeMultiplier = {
          efficient: 0.7,
          balanced: 1.0,
          performance: 1.3
        }[this.stats.powerMode];

        if (this.stats.cpuUsage > this.maxCPUUsage) {
          this.stats.difficulty = Math.max(1, this.stats.difficulty - 0.1 * powerModeMultiplier);
        } else if (this.stats.cpuUsage < this.maxCPUUsage * 0.8) {
          this.stats.difficulty += 0.1 * powerModeMultiplier;
        }

        if (this.isMobile) {
          this.stats.difficulty = Math.min(this.stats.difficulty, 2.0);
        }

        this.worker?.postMessage({
          type: 'setDifficulty',
          data: { difficulty: this.stats.difficulty, powerMode: this.stats.powerMode }
        });

        this.lastAdjustmentTime = now;
      }
    } catch (error) {
      console.error('Error adjusting difficulty:', error);
    }
  }

  public setPowerMode(mode: 'efficient' | 'balanced' | 'performance') {
    if (this.stats.powerMode !== mode) {
      this.stats.powerMode = mode;
      if (this.worker) {
        this.worker.postMessage({ 
          type: 'setPowerMode', 
          data: { mode } 
        });
      }

      switch (mode) {
        case 'efficient':
          this.maxCPUUsage = this.isMobile ? 40 : 60;
          break;
        case 'balanced':
          this.maxCPUUsage = this.isMobile ? 60 : 80;
          break;
        case 'performance':
          this.maxCPUUsage = this.isMobile ? 80 : 90;
          break;
      }

      this.emit('powerModeChanged', mode);
    }
  }

  public startMining() {
    if (!this.isRunning && this.worker) {
      this.isRunning = true;
      const config: WorkerConfig = {
        powerMode: this.stats.powerMode
      };

      this.worker.postMessage({
        type: 'start',
        data: { config }
      });
      this.emit('started');
    }
  }

  public pauseMining() {
    if (this.isRunning && this.worker) {
      this.isRunning = false;
      this.worker.postMessage({ type: 'pause' });
      this.emit('paused');
    }
  }

  public async stopMining() {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
      this.isRunning = false;
      this.emit('stopped');
    }
  }

  public getStats(): MiningStats {
    return { ...this.stats };
  }

  public isDeviceMobile(): boolean {
    return this.isMobile;
  }
}

export const miningService = new MiningService();