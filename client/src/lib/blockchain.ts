import SHA256 from 'crypto-js/sha256';
import { offchainStorage } from './offchain-storage';

export interface Block {
  index: number;
  timestamp: number;
  transactions: any[];
  previousHash: string;
  hash: string;
  validator: string;
  validations: string[];
}

export class Blockchain {
  chain: Block[];
  pendingTransactions: any[];
  private lastMiningTime: Map<number, number>;
  private networkStartTime: number;
  private initialReward: number;
  private halvingPeriod: number;
  private activeUsers: Set<number>;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingTransactions = [];
    this.lastMiningTime = new Map();
    this.networkStartTime = Date.now();
    this.initialReward = 0.00001;
    this.halvingPeriod = 30 * 24 * 60 * 60 * 1000; // 30 days
    this.activeUsers = new Set();
  }

  createGenesisBlock(): Block {
    return {
      index: 0,
      timestamp: Date.now(),
      transactions: [],
      previousHash: "0",
      hash: "0",
      validator: "genesis",
      validations: []
    };
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  calculateHash(block: Omit<Block, 'hash'>): string {
    return SHA256(
      block.index +
      block.previousHash +
      block.timestamp +
      JSON.stringify(block.transactions) +
      block.validator +
      block.validations.join('')
    ).toString();
  }

  calculateReward(userId: number): number {
    const now = Date.now();
    const lastMining = this.lastMiningTime.get(userId) || 0;

    // Check cooldown (5 seconds)
    if (now - lastMining < 5000) {
      console.log("Cooldown in effect for user:", userId);
      return 0;
    }

    // Calculate number of halvings
    const networkAge = (now - this.networkStartTime) / this.halvingPeriod;
    const halvings = Math.floor(networkAge);

    // Apply halving effect
    const baseReward = this.initialReward / Math.pow(2, halvings);

    // Calculate early user bonus
    const userIndex = Array.from(this.activeUsers).indexOf(userId);
    const maxBonus = 2.0;
    const earlyUserBonus = userIndex === -1 ? maxBonus :
      Math.max(1, maxBonus - (userIndex / 1000));

    // Get activity bonus
    const activityScore = offchainStorage.getUserActivityScore(userId);
    const activityBonus = 1 + Math.min(0.5, activityScore * 0.01);

    // Calculate final reward
    const finalReward = baseReward * earlyUserBonus * activityBonus;

    console.log("Reward calculation:", {
      userId,
      baseReward,
      halvings,
      earlyUserBonus,
      activityBonus,
      finalReward
    });

    return Number(finalReward.toFixed(8));
  }

  async participateMining(userId: number): Promise<boolean> {
    if (!userId) {
      console.error("Invalid user ID:", userId);
      return false;
    }

    const reward = this.calculateReward(userId);
    if (reward === 0) {
      console.log("Zero reward, participation blocked for user:", userId);
      return false;
    }

    // Add user to active users set
    this.activeUsers.add(userId);

    // Create transaction
    const transaction = {
      type: 'mining_reward' as const,
      userId,
      amount: reward,
      timestamp: Date.now(),
      activityType: 'mining',
      activityScore: 1
    };

    // Store transaction off-chain
    offchainStorage.addTransaction(transaction);

    this.pendingTransactions.push(transaction);
    this.lastMiningTime.set(userId, Date.now());

    // Create new block
    await this.createBlock(userId);
    return true;
  }

  private async createBlock(validatorId: number): Promise<Block> {
    const previousBlock = this.getLatestBlock();
    const newBlock: Block = {
      index: previousBlock.index + 1,
      timestamp: Date.now(),
      transactions: [...this.pendingTransactions],
      previousHash: previousBlock.hash,
      hash: '',
      validator: validatorId.toString(),
      validations: []
    };

    newBlock.hash = this.calculateHash(newBlock);
    this.pendingTransactions = [];
    this.chain.push(newBlock);
    return newBlock;
  }

  getLastMiningTime(userId: number): number {
    return this.lastMiningTime.get(userId) || 0;
  }

  getStats(userId: number) {
    const now = Date.now();
    const networkAgeInDays = (now - this.networkStartTime) / (24 * 60 * 60 * 1000);
    const lastMiningTime = this.getLastMiningTime(userId);

    return {
      length: this.chain.length,
      totalParticipants: this.activeUsers.size,
      lastBlockTime: this.getLatestBlock().timestamp,
      networkAgeInDays: Math.floor(networkAgeInDays),
      currentHalvingPeriod: Math.floor(networkAgeInDays / 30) + 1,
      offChainTransactions: offchainStorage.getRecentTransactions().length,
      userId,
      lastMiningTime
    };
  }
}

export const blockchain = new Blockchain();