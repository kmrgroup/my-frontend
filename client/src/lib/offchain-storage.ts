// Stores transactions off-chain until mainnet transition
export interface OffChainTransaction {
  type: 'mining_reward' | 'transfer' | 'learning_reward' | 'social_reward';
  userId: number;
  amount: number;
  timestamp: number;
  activityType?: string;
  activityScore?: number;
  details?: {
    moduleCompleted?: string;
    questionsAnswered?: number;
    socialAction?: string;
  };
}

class OffChainStorage {
  private transactions: OffChainTransaction[] = [];
  private userActivityScores: Map<number, number> = new Map();

  addTransaction(transaction: OffChainTransaction) {
    this.transactions.push(transaction);
    this.updateActivityScore(transaction);
  }

  private updateActivityScore(transaction: OffChainTransaction) {
    if (!transaction.activityScore) return;

    // Base score from transaction
    let activityScore = transaction.activityScore;

    // Bonus points based on activity type
    switch (transaction.activityType) {
      case 'learning':
        // Higher score for completing learning modules
        activityScore *= 1.5;
        break;
      case 'social':
        // Moderate bonus for social engagement
        activityScore *= 1.2;
        break;
      case 'mining':
        // Base score for regular mining activity
        break;
    }

    const currentScore = this.userActivityScores.get(transaction.userId) || 0;
    this.userActivityScores.set(
      transaction.userId, 
      currentScore + activityScore
    );
  }

  getUserTransactions(userId: number): OffChainTransaction[] {
    return this.transactions.filter(t => t.userId === userId);
  }

  getUserActivityScore(userId: number): number {
    return this.userActivityScores.get(userId) || 0;
  }

  getRecentTransactions(limit: number = 10): OffChainTransaction[] {
    return [...this.transactions]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  getActivityStats(userId: number) {
    const userTransactions = this.getUserTransactions(userId);
    return {
      totalMined: userTransactions
        .filter(t => t.type === 'mining_reward')
        .reduce((sum, t) => sum + t.amount, 0),
      learningModulesCompleted: userTransactions
        .filter(t => t.type === 'learning_reward')
        .length,
      socialEngagements: userTransactions
        .filter(t => t.type === 'social_reward')
        .length,
      activityScore: this.getUserActivityScore(userId)
    };
  }
}

export const offchainStorage = new OffChainStorage();