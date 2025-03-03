import { users, miningRewards, transactions, achievements, friends, type User, type InsertUser, type MiningReward, type Transaction, referralCodes, referrals, airdropClaims, socialVerification } from "@shared/schema";
import { db } from "./db";
import { eq, or, and } from "drizzle-orm";
import { sql } from 'drizzle-orm';

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserMining(id: number, mined: number, hashRate: number): Promise<User>;
  getAllUsers(): Promise<User[]>;
  updateUser(id: number, data: Partial<Omit<User, 'id' | 'username'>>): Promise<User>;

  // Mining operations
  getMiningRewardByHash(modelHash: string): Promise<MiningReward | undefined>;
  createMiningReward(reward: Omit<MiningReward, 'id' | 'timestamp'>): Promise<MiningReward>;
  createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction>;

  // Achievement operations
  getAchievements(userId: number): Promise<Achievement[]>;
  updateAchievement(userId: number, type: string, progress: number): Promise<Achievement>;

  // Friend operations
  getFriends(userId: number): Promise<Friend[]>;
  addFriend(userId: number, friendId: number): Promise<Friend>;

  // Referral operations
  createReferralCode(userId: number, code: string): Promise<typeof referralCodes.$inferSelect>;
  getReferralCode(userId: number): Promise<string | undefined>;
  processReferral(code: string, newUserId: number): Promise<void>;
  getReferralStats(userId: number): Promise<{
    referralCount: number;
    referralTier: string | null;
    totalReferralRewards: string;
  }>;

  // Airdrop operations
  checkAirdropEligibility(userId: number): Promise<{
    eligible: boolean;
    amount: string;
    reason?: string;
  }>;
  claimAirdrop(userId: number, walletAddress: string): Promise<{
    success: boolean;
    amount: string;
    message: string;
  }>;
  verifySocialMedia(userId: number, platform: string, username: string): Promise<boolean>;
  getAirdropStats(): Promise<{
    totalParticipants: number;
    remainingTier1: number;
    remainingTier2: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    try {
      // Ensure the ID is a valid integer
      if (!id || isNaN(id) || id <= 0) {
        console.warn(`Invalid user ID: ${id}`);
        return undefined;
      }

      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  async updateUserMining(id: number, mined: number, hashRate: number): Promise<User> {
    try {
      // Ensure valid parameters
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`Invalid user ID: ${id}`);
      }

      if (isNaN(mined) || mined < 0) {
        throw new Error(`Invalid mined amount: ${mined}`);
      }

      if (isNaN(hashRate) || hashRate < 0) {
        throw new Error(`Invalid hash rate: ${hashRate}`);
      }

      // Get current user data
      const existingUser = await this.getUser(id);
      if (!existingUser) {
        throw new Error(`User ${id} not found`);
      }

      // Parse and calculate new total with precise decimal handling
      const currentTotal = existingUser.totalMined ? parseFloat(String(existingUser.totalMined)) : 0;
      const minedAmount = parseFloat(mined.toFixed(8));
      const newTotal = (currentTotal + minedAmount).toFixed(8);

      // Update user with new mining data
      const [updatedUser] = await db
        .update(users)
        .set({
          totalMined: newTotal,
          currentHashRate: Math.round(hashRate),
          lastMined: new Date()
        })
        .where(eq(users.id, id))
        .returning();

      if (!updatedUser) {
        throw new Error("Failed to update user mining data");
      }

      return updatedUser;
    } catch (error) {
      console.error("Error in updateUserMining:", error);
      throw error;
    }
  }

  async updateUser(id: number, data: Partial<Omit<User, 'id' | 'username'>>): Promise<User> {
    try {
      // Validate ID
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`Invalid user ID: ${id}`);
      }

      // Check if user exists before updating
      const existingUser = await this.getUser(id);
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }

      const [updatedUser] = await db
        .update(users)
        .set(data)
        .where(eq(users.id, id))
        .returning();

      if (!updatedUser) {
        throw new Error("Failed to update user");
      }

      return updatedUser;
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw error;
    }
  }

  async getAchievements(userId: number): Promise<Achievement[]> {
    return db.select().from(achievements).where(eq(achievements.userId, userId));
  }

  async updateAchievement(userId: number, type: string, progress: number): Promise<Achievement> {
    const [existing] = await db
      .select()
      .from(achievements)
      .where(
        and(
          eq(achievements.userId, userId),
          eq(achievements.type, type)
        )
      );

    if (existing) {
      const [achievement] = await db
        .update(achievements)
        .set({
          progress,
          completed: progress >= 100,
        })
        .where(eq(achievements.id, existing.id))
        .returning();
      return achievement;
    } else {
      const [achievement] = await db
        .insert(achievements)
        .values({
          userId,
          type,
          progress,
          completed: progress >= 100,
        })
        .returning();
      return achievement;
    }
  }

  async getFriends(userId: number): Promise<Friend[]> {
    return db
      .select()
      .from(friends)
      .where(or(eq(friends.userId, userId), eq(friends.friendId, userId)));
  }

  async addFriend(userId: number, friendId: number): Promise<Friend> {
    const [friend] = await db
      .insert(friends)
      .values({
        userId,
        friendId,
        status: "pending",
      })
      .returning();
    return friend;
  }

  async getMiningRewardByHash(modelHash: string): Promise<MiningReward | undefined> {
    try {
      const [reward] = await db
        .select()
        .from(miningRewards)
        .where(eq(miningRewards.modelHash, modelHash));
      return reward;
    } catch (error) {
      console.error("Error fetching mining reward:", error);
      throw error;
    }
  }

  async createMiningReward(reward: Omit<MiningReward, 'id' | 'timestamp'>): Promise<MiningReward> {
    try {
      const [createdReward] = await db
        .insert(miningRewards)
        .values(reward)
        .returning();
      return createdReward;
    } catch (error) {
      console.error("Error creating mining reward:", error);
      throw error;
    }
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'timestamp'>): Promise<Transaction> {
    try {
      const [createdTransaction] = await db
        .insert(transactions)
        .values(transaction)
        .returning();
      return createdTransaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }

  // Referral code operations
  async createReferralCode(userId: number, code: string) {
    const [referralCode] = await db
      .insert(referralCodes)
      .values({ userId, code })
      .returning();
    return referralCode;
  }

  async getReferralCode(userId: number): Promise<string | undefined> {
    const [referralCode] = await db
      .select()
      .from(referralCodes)
      .where(eq(referralCodes.userId, userId));
    return referralCode?.code;
  }

  async processReferral(code: string, newUserId: number): Promise<void> {
    // Find the referral code
    const [referralCode] = await db
      .select()
      .from(referralCodes)
      .where(eq(referralCodes.code, code));

    if (!referralCode) return;

    const referrerId = referralCode.userId;

    // Get referrer's current stats
    const referrer = await this.getUser(referrerId);
    if (!referrer) return;

    // Calculate new referral count and determine tier
    const newCount = (referrer.referralCount || 0) + 1;
    let tier = referrer.referralTier;
    let rewardAmount = "0";

    // Silver tier: 5 direct referrals = 100 coins
    if (newCount >= 5 && (!tier || tier !== 'SILVER')) {
      tier = 'SILVER';
      rewardAmount = "100";
    }

    // Update referrer's stats
    await db
      .update(users)
      .set({
        referralCount: newCount,
        referralTier: tier,
        totalReferralRewards: (parseFloat(referrer.totalReferralRewards || "0") + parseFloat(rewardAmount)).toString()
      })
      .where(eq(users.id, referrerId));

    // Create referral record
    await db
      .insert(referrals)
      .values({
        referrerId,
        referredId: newUserId,
        tier: tier || 'NONE',
        rewardAmount,
        status: rewardAmount === "0" ? "pending" : "completed"
      });
  }

  async getReferralStats(userId: number) {
    const user = await this.getUser(userId);
    if (!user) {
      return {
        referralCount: 0,
        referralTier: null,
        totalReferralRewards: "0"
      };
    }

    return {
      referralCount: user.referralCount || 0,
      referralTier: user.referralTier || null,
      totalReferralRewards: user.totalReferralRewards || "0"
    };
  }

  async checkAirdropEligibility(userId: number) {
    try {
      const user = await this.getUser(userId);
      if (!user) {
        return { eligible: false, amount: "0", reason: "User not found" };
      }

      if (user.airdropClaimed) {
        return { eligible: false, amount: "0", reason: "Already claimed" };
      }

      // Check social media verification
      const allSocialVerified = user.telegramVerified &&
        user.twitterVerified &&
        user.instagramVerified &&
        user.facebookVerified &&
        user.redditVerified;

      if (!allSocialVerified) {
        return { eligible: false, amount: "0", reason: "Social media not verified" };
      }

      // Check referral requirement (minimum 5 referrals)
      if (user.referralCount < 5) {
        return { eligible: false, amount: "0", reason: "Need 5 referrals minimum" };
      }

      // Determine airdrop amount based on registration order
      let amount = "0";
      if (user.registrationNumber <= 50000) {
        amount = "1000";
      } else if (user.registrationNumber <= 150000) {
        amount = "500";
      }

      // Add social media bonus
      if (amount !== "0") {
        amount = (parseFloat(amount) + 250).toString();
      }

      return { eligible: true, amount };
    } catch (error) {
      console.error("Error checking airdrop eligibility:", error);
      throw error;
    }
  }

  async claimAirdrop(userId: number, walletAddress: string) {
    try {
      const eligibility = await this.checkAirdropEligibility(userId);

      if (!eligibility.eligible) {
        return {
          success: false,
          amount: "0",
          message: eligibility.reason || "Not eligible"
        };
      }

      // Update user's airdrop status
      await db
        .update(users)
        .set({
          airdropClaimed: true,
          airdropAmount: eligibility.amount,
          walletAddress
        })
        .where(eq(users.id, userId));

      // Create airdrop claim record
      await db
        .insert(airdropClaims)
        .values({
          userId,
          claimAmount: eligibility.amount,
          claimType: eligibility.amount === "1250" ? "TIER_1" : "TIER_2",
          status: "completed",
          walletAddress
        });

      return {
        success: true,
        amount: eligibility.amount,
        message: "Airdrop claimed successfully"
      };
    } catch (error) {
      console.error("Error claiming airdrop:", error);
      throw error;
    }
  }

  async verifySocialMedia(userId: number, platform: string, username: string) {
    try {
      // Create or update social verification record
      await db
        .insert(socialVerification)
        .values({
          userId,
          platform,
          username,
          verified: true,
          verifiedAt: new Date()
        })
        .onConflictDoUpdate({
          target: [socialVerification.userId, socialVerification.platform],
          set: {
            username,
            verified: true,
            verifiedAt: new Date()
          }
        });

      // Update user's platform verification status
      const updateData = {
        [`${platform}Verified`]: true
      };

      await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userId));

      return true;
    } catch (error) {
      console.error("Error verifying social media:", error);
      throw error;
    }
  }

  async getAirdropStats() {
    try {
      // Get the count of users who have claimed the airdrop
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .where(eq(users.airdropClaimed, true));

      const totalParticipants = result[0]?.count ?? 0;
      const remainingTier1 = Math.max(50000 - totalParticipants, 0);
      const remainingTier2 = Math.max(100000 - Math.max(totalParticipants - 50000, 0), 0);

      console.log("Airdrop stats calculated:", {
        totalParticipants,
        remainingTier1,
        remainingTier2
      });

      return {
        totalParticipants,
        remainingTier1,
        remainingTier2
      };
    } catch (error) {
      console.error("Error getting airdrop stats:", error);
      // Return default values if there's an error
      return {
        totalParticipants: 0,
        remainingTier1: 50000,
        remainingTier2: 100000
      };
    }
  }
}

export const storage = new DatabaseStorage();