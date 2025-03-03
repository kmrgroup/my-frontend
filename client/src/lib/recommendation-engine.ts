import { offchainStorage, type OffChainTransaction } from './offchain-storage';

interface Recommendation {
  type: 'learning' | 'mining' | 'social';
  title: string;
  description: string;
  priority: number; // 1-10, higher is more important
  actionUrl?: string;
}

class RecommendationEngine {
  private cachedRecommendations: Map<number, Recommendation[]> = new Map();
  private cacheTimeout: number = 5 * 60 * 1000; // 5 minutes
  private lastUpdate: Map<number, number> = new Map();

  getRecommendations(userId: number): Recommendation[] {
    const now = Date.now();
    const lastUpdate = this.lastUpdate.get(userId) || 0;

    // Check if cache is valid
    if (now - lastUpdate < this.cacheTimeout) {
      return this.cachedRecommendations.get(userId) || [];
    }

    // Generate new recommendations
    const recommendations = this.generateRecommendations(userId);
    this.cachedRecommendations.set(userId, recommendations);
    this.lastUpdate.set(userId, now);

    return recommendations;
  }

  private generateRecommendations(userId: number): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const stats = offchainStorage.getActivityStats(userId);
    const transactions = offchainStorage.getUserTransactions(userId);
    
    // Learning recommendations
    this.addLearningRecommendations(recommendations, stats);
    
    // Mining recommendations
    this.addMiningRecommendations(recommendations, transactions);
    
    // Social recommendations
    this.addSocialRecommendations(recommendations, stats);

    // Sort by priority
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  private addLearningRecommendations(recommendations: Recommendation[], stats: any) {
    const completedModules = stats.learningModulesCompleted;

    if (completedModules < 5) {
      recommendations.push({
        type: 'learning',
        title: 'Start Your Learning Journey',
        description: 'Complete blockchain basics modules to increase your mining efficiency',
        priority: 10,
        actionUrl: '/mining-game'
      });
    } else if (completedModules < 15) {
      recommendations.push({
        type: 'learning',
        title: 'Advance Your Knowledge',
        description: 'Take advanced modules to earn higher mining bonuses',
        priority: 8,
        actionUrl: '/mining-game'
      });
    }
  }

  private addMiningRecommendations(recommendations: Recommendation[], transactions: OffChainTransaction[]) {
    const recentMining = transactions
      .filter(tx => tx.type === 'mining_reward')
      .slice(-24); // Last 24 transactions

    if (recentMining.length === 0) {
      recommendations.push({
        type: 'mining',
        title: 'Start Mining',
        description: 'Begin your mining journey to earn rewards',
        priority: 9,
        actionUrl: '/'
      });
    } else {
      const averageReward = recentMining.reduce((sum, tx) => sum + tx.amount, 0) / recentMining.length;
      
      if (averageReward < 0.00002) {
        recommendations.push({
          type: 'mining',
          title: 'Boost Your Mining Rewards',
          description: 'Increase your activity score to earn higher rewards',
          priority: 7,
          actionUrl: '/'
        });
      }
    }
  }

  private addSocialRecommendations(recommendations: Recommendation[], stats: any) {
    if (stats.socialEngagements < 3) {
      recommendations.push({
        type: 'social',
        title: 'Connect with Miners',
        description: 'Join the community to unlock social bonuses',
        priority: 6,
        actionUrl: '/social'
      });
    }
  }
}

export const recommendationEngine = new RecommendationEngine();
