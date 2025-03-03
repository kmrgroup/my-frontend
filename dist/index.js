var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// server/index.ts
import express2 from "express";

// server/routes.ts
import { createServer } from "http";

// shared/schema.ts
var schema_exports = {};
__export(schema_exports, {
  achievements: () => achievements,
  airdropClaims: () => airdropClaims,
  friends: () => friends,
  insertUserSchema: () => insertUserSchema,
  miningRewards: () => miningRewards,
  miningUpdateSchema: () => miningUpdateSchema,
  referralCodes: () => referralCodes,
  referralTiers: () => referralTiers,
  referrals: () => referrals,
  socialVerification: () => socialVerification,
  socialVerificationSchema: () => socialVerificationSchema,
  transactions: () => transactions,
  updateUserSchema: () => updateUserSchema,
  users: () => users,
  walletAddressSchema: () => walletAddressSchema
});
import { pgTable, text, serial, boolean, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  emailVerified: boolean("email_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  totalMined: text("total_mined").default("0"),
  currentHashRate: integer("current_hash_rate").default(0),
  lastMined: timestamp("last_mined"),
  displayName: text("display_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  profession: text("profession"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  githubUrl: text("github_url"),
  referralCount: integer("referral_count").default(0),
  referralTier: text("referral_tier"),
  totalReferralRewards: text("total_referral_rewards").default("0"),
  // New fields for airdrop
  walletAddress: text("wallet_address").unique(),
  telegramVerified: boolean("telegram_verified").default(false),
  twitterVerified: boolean("twitter_verified").default(false),
  instagramVerified: boolean("instagram_verified").default(false),
  facebookVerified: boolean("facebook_verified").default(false),
  redditVerified: boolean("reddit_verified").default(false),
  airdropClaimed: boolean("airdrop_claimed").default(false),
  airdropAmount: text("airdrop_amount").default("0"),
  registrationNumber: integer("registration_number")
  // To track user order for tiered distribution
});
var airdropClaims = pgTable("airdrop_claims", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  claimAmount: text("claim_amount").notNull(),
  claimType: text("claim_type").notNull(),
  // 'TIER_1', 'TIER_2', 'SOCIAL_BONUS'
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").notNull(),
  // 'pending', 'completed', 'failed'
  walletAddress: text("wallet_address").notNull()
});
var socialVerification = pgTable("social_verification", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platform: text("platform").notNull(),
  // 'telegram', 'twitter', etc.
  platformUserId: text("platform_user_id"),
  username: text("username"),
  verified: boolean("verified").default(false),
  verifiedAt: timestamp("verified_at")
});
var socialVerificationSchema = z.object({
  platform: z.enum(["telegram", "twitter", "instagram", "facebook", "reddit"]),
  platformUserId: z.string().optional(),
  username: z.string().min(1, "Username is required")
});
var walletAddressSchema = z.object({
  walletAddress: z.string().min(42, "Invalid wallet address length").regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format")
});
var insertUserSchema = createInsertSchema(users, {
  username: z.string().min(3, "Username must be at least 3 characters").max(30, "Username must be less than 30 characters").regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and hyphens"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password is too long").regex(/[A-Z]/, "Password must contain at least one uppercase letter").regex(/[a-z]/, "Password must contain at least one lowercase letter").regex(/[0-9]/, "Password must contain at least one number").regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
}).omit({
  id: true,
  emailVerified: true,
  createdAt: true,
  totalMined: true,
  currentHashRate: true,
  lastMined: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
  profession: true,
  linkedinUrl: true,
  twitterUrl: true,
  githubUrl: true,
  referralCount: true,
  referralTier: true,
  totalReferralRewards: true,
  walletAddress: true,
  telegramVerified: true,
  twitterVerified: true,
  instagramVerified: true,
  facebookVerified: true,
  redditVerified: true,
  airdropClaimed: true,
  airdropAmount: true,
  registrationNumber: true
});
var miningUpdateSchema = z.object({
  userId: z.number().int("User ID must be an integer").positive("User ID must be positive"),
  mined: z.string().regex(/^\d*\.?\d*$/, "Invalid mining amount"),
  hashRate: z.number().min(0, "Hash rate must be positive"),
  modelHash: z.string(),
  accuracy: z.union([z.string(), z.number()]).transform((val) => val.toString()),
  loss: z.union([z.string(), z.number()]).transform((val) => val.toString()),
  difficulty: z.union([z.string(), z.number()]).transform((val) => val.toString())
});
var updateUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  displayName: z.string().min(2, "Display name must be at least 2 characters").optional(),
  avatarUrl: z.string().optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  profession: z.string().max(100, "Profession must be less than 100 characters").optional(),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").optional(),
  twitterUrl: z.string().url("Invalid Twitter URL").optional(),
  githubUrl: z.string().url("Invalid GitHub URL").optional(),
  totalMined: z.string().regex(/^\d*\.?\d*$/, "Invalid mining amount").optional(),
  currentHashRate: z.number().min(0).optional(),
  lastMined: z.date().optional(),
  walletAddress: z.string().optional(),
  telegramVerified: z.boolean().optional(),
  twitterVerified: z.boolean().optional(),
  instagramVerified: z.boolean().optional(),
  facebookVerified: z.boolean().optional(),
  redditVerified: z.boolean().optional(),
  airdropClaimed: z.boolean().optional(),
  airdropAmount: z.string().optional(),
  registrationNumber: z.number().optional()
});
var transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").notNull(),
  toUserId: integer("to_user_id").notNull(),
  amount: numeric("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  type: text("type").notNull(),
  // 'mining_reward', 'transfer', etc.
  status: text("status").notNull().default("pending")
});
var achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  progress: integer("progress").notNull().default(0),
  completed: boolean("completed").notNull().default(false)
});
var friends = pgTable("friends", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  friendId: integer("friend_id").notNull(),
  status: text("status").notNull().default("pending")
});
var referralTiers = {
  SILVER: { minReferrals: 5, reward: 100 },
  PLATINUM: { percentage: 10 },
  GOLD: { percentage: 5 }
};
var referralCodes = pgTable("referral_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow()
});
var referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull().references(() => users.id),
  referredId: integer("referred_id").notNull().references(() => users.id),
  tier: text("tier").notNull(),
  // 'SILVER', 'PLATINUM', 'GOLD'
  rewardAmount: text("reward_amount").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow()
});
var miningRewards = pgTable("mining_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: text("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  accuracy: text("accuracy").notNull(),
  loss: text("loss").notNull(),
  modelHash: text("model_hash").notNull(),
  difficulty: text("difficulty").notNull(),
  validated: boolean("validated").default(false)
});

// server/db.ts
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?"
  );
}
var pool = new Pool({ connectionString: process.env.DATABASE_URL });
var db = drizzle({ client: pool, schema: schema_exports });

// server/storage.ts
import { eq, or, and } from "drizzle-orm";
import { sql } from "drizzle-orm";
var DatabaseStorage = class {
  async getUser(id) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        console.warn(`Invalid user ID: ${id}`);
        return void 0;
      }
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }
  async getUserByUsername(username) {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }
  async getUserByEmail(email) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }
  async createUser(insertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  async getAllUsers() {
    return db.select().from(users);
  }
  async updateUserMining(id, mined, hashRate) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`Invalid user ID: ${id}`);
      }
      if (isNaN(mined) || mined < 0) {
        throw new Error(`Invalid mined amount: ${mined}`);
      }
      if (isNaN(hashRate) || hashRate < 0) {
        throw new Error(`Invalid hash rate: ${hashRate}`);
      }
      const existingUser = await this.getUser(id);
      if (!existingUser) {
        throw new Error(`User ${id} not found`);
      }
      const currentTotal = existingUser.totalMined ? parseFloat(String(existingUser.totalMined)) : 0;
      const minedAmount = parseFloat(mined.toFixed(8));
      const newTotal = (currentTotal + minedAmount).toFixed(8);
      const [updatedUser] = await db.update(users).set({
        totalMined: newTotal,
        currentHashRate: Math.round(hashRate),
        lastMined: /* @__PURE__ */ new Date()
      }).where(eq(users.id, id)).returning();
      if (!updatedUser) {
        throw new Error("Failed to update user mining data");
      }
      return updatedUser;
    } catch (error) {
      console.error("Error in updateUserMining:", error);
      throw error;
    }
  }
  async updateUser(id, data) {
    try {
      if (!id || isNaN(id) || id <= 0) {
        throw new Error(`Invalid user ID: ${id}`);
      }
      const existingUser = await this.getUser(id);
      if (!existingUser) {
        throw new Error(`User with ID ${id} not found`);
      }
      const [updatedUser] = await db.update(users).set(data).where(eq(users.id, id)).returning();
      if (!updatedUser) {
        throw new Error("Failed to update user");
      }
      return updatedUser;
    } catch (error) {
      console.error("Error in updateUser:", error);
      throw error;
    }
  }
  async getAchievements(userId) {
    return db.select().from(achievements).where(eq(achievements.userId, userId));
  }
  async updateAchievement(userId, type, progress) {
    const [existing] = await db.select().from(achievements).where(
      and(
        eq(achievements.userId, userId),
        eq(achievements.type, type)
      )
    );
    if (existing) {
      const [achievement] = await db.update(achievements).set({
        progress,
        completed: progress >= 100
      }).where(eq(achievements.id, existing.id)).returning();
      return achievement;
    } else {
      const [achievement] = await db.insert(achievements).values({
        userId,
        type,
        progress,
        completed: progress >= 100
      }).returning();
      return achievement;
    }
  }
  async getFriends(userId) {
    return db.select().from(friends).where(or(eq(friends.userId, userId), eq(friends.friendId, userId)));
  }
  async addFriend(userId, friendId) {
    const [friend] = await db.insert(friends).values({
      userId,
      friendId,
      status: "pending"
    }).returning();
    return friend;
  }
  async getMiningRewardByHash(modelHash) {
    try {
      const [reward] = await db.select().from(miningRewards).where(eq(miningRewards.modelHash, modelHash));
      return reward;
    } catch (error) {
      console.error("Error fetching mining reward:", error);
      throw error;
    }
  }
  async createMiningReward(reward) {
    try {
      const [createdReward] = await db.insert(miningRewards).values(reward).returning();
      return createdReward;
    } catch (error) {
      console.error("Error creating mining reward:", error);
      throw error;
    }
  }
  async createTransaction(transaction) {
    try {
      const [createdTransaction] = await db.insert(transactions).values(transaction).returning();
      return createdTransaction;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  }
  // Referral code operations
  async createReferralCode(userId, code) {
    const [referralCode] = await db.insert(referralCodes).values({ userId, code }).returning();
    return referralCode;
  }
  async getReferralCode(userId) {
    const [referralCode] = await db.select().from(referralCodes).where(eq(referralCodes.userId, userId));
    return referralCode?.code;
  }
  async processReferral(code, newUserId) {
    const [referralCode] = await db.select().from(referralCodes).where(eq(referralCodes.code, code));
    if (!referralCode) return;
    const referrerId = referralCode.userId;
    const referrer = await this.getUser(referrerId);
    if (!referrer) return;
    const newCount = (referrer.referralCount || 0) + 1;
    let tier = referrer.referralTier;
    let rewardAmount = "0";
    if (newCount >= 5 && (!tier || tier !== "SILVER")) {
      tier = "SILVER";
      rewardAmount = "100";
    }
    await db.update(users).set({
      referralCount: newCount,
      referralTier: tier,
      totalReferralRewards: (parseFloat(referrer.totalReferralRewards || "0") + parseFloat(rewardAmount)).toString()
    }).where(eq(users.id, referrerId));
    await db.insert(referrals).values({
      referrerId,
      referredId: newUserId,
      tier: tier || "NONE",
      rewardAmount,
      status: rewardAmount === "0" ? "pending" : "completed"
    });
  }
  async getReferralStats(userId) {
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
  async checkAirdropEligibility(userId) {
    try {
      const user = await this.getUser(userId);
      if (!user) {
        return { eligible: false, amount: "0", reason: "User not found" };
      }
      if (user.airdropClaimed) {
        return { eligible: false, amount: "0", reason: "Already claimed" };
      }
      const allSocialVerified = user.telegramVerified && user.twitterVerified && user.instagramVerified && user.facebookVerified && user.redditVerified;
      if (!allSocialVerified) {
        return { eligible: false, amount: "0", reason: "Social media not verified" };
      }
      if (user.referralCount < 5) {
        return { eligible: false, amount: "0", reason: "Need 5 referrals minimum" };
      }
      let amount = "0";
      if (user.registrationNumber <= 5e4) {
        amount = "1000";
      } else if (user.registrationNumber <= 15e4) {
        amount = "500";
      }
      if (amount !== "0") {
        amount = (parseFloat(amount) + 250).toString();
      }
      return { eligible: true, amount };
    } catch (error) {
      console.error("Error checking airdrop eligibility:", error);
      throw error;
    }
  }
  async claimAirdrop(userId, walletAddress) {
    try {
      const eligibility = await this.checkAirdropEligibility(userId);
      if (!eligibility.eligible) {
        return {
          success: false,
          amount: "0",
          message: eligibility.reason || "Not eligible"
        };
      }
      await db.update(users).set({
        airdropClaimed: true,
        airdropAmount: eligibility.amount,
        walletAddress
      }).where(eq(users.id, userId));
      await db.insert(airdropClaims).values({
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
  async verifySocialMedia(userId, platform, username) {
    try {
      await db.insert(socialVerification).values({
        userId,
        platform,
        username,
        verified: true,
        verifiedAt: /* @__PURE__ */ new Date()
      }).onConflictDoUpdate({
        target: [socialVerification.userId, socialVerification.platform],
        set: {
          username,
          verified: true,
          verifiedAt: /* @__PURE__ */ new Date()
        }
      });
      const updateData = {
        [`${platform}Verified`]: true
      };
      await db.update(users).set(updateData).where(eq(users.id, userId));
      return true;
    } catch (error) {
      console.error("Error verifying social media:", error);
      throw error;
    }
  }
  async getAirdropStats() {
    try {
      const result = await db.select({ count: sql`count(*)` }).from(users).where(eq(users.airdropClaimed, true));
      const totalParticipants = result[0]?.count ?? 0;
      const remainingTier1 = Math.max(5e4 - totalParticipants, 0);
      const remainingTier2 = Math.max(1e5 - Math.max(totalParticipants - 5e4, 0), 0);
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
      return {
        totalParticipants: 0,
        remainingTier1: 5e4,
        remainingTier2: 1e5
      };
    }
  }
};
var storage = new DatabaseStorage();

// server/auth.ts
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
var scryptAsync = promisify(scrypt);
async function hashPassword(password) {
  try {
    const salt = randomBytes(16).toString("hex");
    const buf = await scryptAsync(password, salt, 64);
    return `${buf.toString("hex")}.${salt}`;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
}
async function verifyPassword(suppliedPassword, storedPassword) {
  try {
    const [hashedPassword, salt] = storedPassword.split(".");
    if (!hashedPassword || !salt) {
      console.error("Invalid stored password format");
      return false;
    }
    const storedBuf = Buffer.from(hashedPassword, "hex");
    const suppliedBuf = await scryptAsync(suppliedPassword, salt, 64);
    const result = timingSafeEqual(storedBuf, suppliedBuf);
    return result;
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
}

// server/routes.ts
import { z as z2 } from "zod";
import crypto from "crypto";
import session from "express-session";
import memorystore from "memorystore";
function generateReferralCode() {
  const timestamp2 = Date.now().toString(36);
  const random = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `NR${random}`;
}
function registerRoutes(app2) {
  const MemoryStore = memorystore(session);
  app2.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    // Use environment variable in production
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 864e5
      // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1e3,
      // 24 hours
      httpOnly: true
    }
  }));
  app2.post("/api/users", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const { referralCode } = req.body;
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({
          error: "Username already taken",
          fieldErrors: { username: "This username is already taken" }
        });
      }
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({
          error: "Email already registered",
          fieldErrors: { email: "This email is already registered" }
        });
      }
      const hashedPassword = await hashPassword(validatedData.password);
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
        referralCount: 0,
        totalReferralRewards: "0"
      });
      const newReferralCode = generateReferralCode();
      await storage.createReferralCode(user.id, newReferralCode);
      if (referralCode) {
        await storage.processReferral(referralCode, user.id);
      }
      req.session.userId = user.id;
      await req.session.save();
      res.status(201).json({
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        referralCode: newReferralCode
      });
    } catch (error) {
      console.error("Registration error:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          fieldErrors: error.errors.reduce((acc, err) => {
            const field = err.path[0];
            acc[field] = err.message;
            return acc;
          }, {})
        });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });
  app2.post("/api/mining/:userId", async (req, res) => {
    try {
      console.log("Mining request body:", req.body);
      console.log("Mining request params:", req.params);
      const userId = parseInt(req.params.userId);
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      const validationResult = miningUpdateSchema.safeParse({
        userId,
        ...req.body
      });
      if (!validationResult.success) {
        console.error("Mining data validation failed:", validationResult.error);
        return res.status(400).json({
          error: "Invalid mining data",
          details: validationResult.error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        });
      }
      const updateData = validationResult.data;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const updatedUser = await storage.updateUserMining(
        userId,
        parseFloat(updateData.mined),
        updateData.hashRate
      );
      console.log("Mining update successful:", {
        userId,
        mined: updateData.mined,
        hashRate: updateData.hashRate
      });
      res.json({
        totalMined: updatedUser.totalMined,
        currentHashRate: updatedUser.currentHashRate,
        lastMined: updatedUser.lastMined
      });
    } catch (error) {
      console.error("Mining update failed:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          error: "Invalid mining data",
          details: error.errors.map((err) => ({
            field: err.path.join("."),
            message: err.message
          }))
        });
      }
      res.status(400).json({ error: "Failed to update mining progress" });
    }
  });
  app2.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid username or password" });
      }
      req.session.userId = user.id;
      await req.session.save();
      res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        totalMined: user.totalMined,
        currentHashRate: user.currentHashRate,
        lastMined: user.lastMined,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
        profession: user.profession,
        linkedinUrl: user.linkedinUrl,
        twitterUrl: user.twitterUrl,
        githubUrl: user.githubUrl
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Login failed" });
    }
  });
  app2.get("/api/users/:id", async (req, res) => {
    try {
      const userId = Number(req.params.id);
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Failed to fetch user" });
    }
  });
  app2.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      const updateData = updateUserSchema.parse(req.body);
      if (updateData.username) {
        const existingUser = await storage.getUserByUsername(updateData.username);
        if (existingUser && existingUser.id !== userId) {
          return res.status(400).json({ error: "Username already taken" });
        }
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      const updatedUser = await storage.updateUser(userId, updateData);
      if (!updatedUser) {
        return res.status(400).json({ error: "Failed to update user" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({ error: "Invalid update data", details: error.errors });
      }
      res.status(400).json({ error: "Failed to update user" });
    }
  });
  app2.get("/api/achievements/:userId", async (req, res) => {
    const achievements2 = await storage.getAchievements(Number(req.params.userId));
    res.json(achievements2);
  });
  app2.post("/api/achievements/:userId", async (req, res) => {
    const { type, progress } = z2.object({
      type: z2.string(),
      progress: z2.number()
    }).parse(req.body);
    const achievement = await storage.updateAchievement(
      Number(req.params.userId),
      type,
      progress
    );
    res.json(achievement);
  });
  app2.get("/api/friends/:userId", async (req, res) => {
    const friends2 = await storage.getFriends(Number(req.params.userId));
    res.json(friends2);
  });
  app2.post("/api/friends", async (req, res) => {
    const { userId, friendId } = z2.object({
      userId: z2.number(),
      friendId: z2.number()
    }).parse(req.body);
    const friend = await storage.addFriend(userId, friendId);
    res.json(friend);
  });
  app2.get("/api/users", async (req, res) => {
    try {
      const users2 = await storage.getAllUsers();
      res.json(users2);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });
  app2.get("/api/referrals/stats", async (req, res) => {
    try {
      if (!req.session?.userId) {
        console.log("No session found or user not authenticated");
        return res.status(401).json({ error: "Not authenticated" });
      }
      const userId = req.session.userId;
      console.log(`Fetching referral stats for user ${userId}`);
      const stats = await storage.getReferralStats(userId);
      const referralCode = await storage.getReferralCode(userId);
      console.log("Referral stats response:", {
        code: referralCode,
        stats: {
          totalReferrals: stats.referralCount || 0,
          currentTier: stats.referralTier || "None",
          totalRewards: stats.totalReferralRewards || "0",
          pendingRewards: "0"
        }
      });
      res.json({
        code: referralCode,
        stats: {
          totalReferrals: stats.referralCount || 0,
          currentTier: stats.referralTier || "None",
          totalRewards: stats.totalReferralRewards || "0",
          pendingRewards: "0"
        }
      });
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ error: "Failed to fetch referral stats" });
    }
  });
  app2.get("/api/airdrop/stats", async (req, res) => {
    try {
      const stats = await storage.getAirdropStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching airdrop stats:", error);
      res.status(500).json({ error: "Failed to fetch airdrop stats" });
    }
  });
  app2.get("/api/airdrop/eligibility", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({
          error: "Not authenticated",
          message: "Please log in to check eligibility",
          code: "LOGIN_REQUIRED"
        });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        req.session.destroy(() => {
        });
        return res.status(401).json({
          error: "Invalid session",
          message: "Please log in again",
          code: "INVALID_SESSION"
        });
      }
      const eligibility = await storage.checkAirdropEligibility(userId);
      res.json(eligibility);
    } catch (error) {
      console.error("Error checking eligibility:", error);
      res.status(500).json({ error: "Failed to check eligibility" });
    }
  });
  app2.post("/api/airdrop/claim", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const walletAddressSchema2 = z2.object({ walletAddress: z2.string().min(42).max(42) });
      const { walletAddress } = walletAddressSchema2.parse(req.body);
      const result = await storage.claimAirdrop(userId, walletAddress);
      res.json(result);
    } catch (error) {
      console.error("Error claiming airdrop:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          error: "Invalid wallet address",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Failed to claim airdrop" });
    }
  });
  app2.post("/api/social/verify", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      const socialVerificationSchema2 = z2.object({ platform: z2.string(), username: z2.string() });
      const { platform, username } = socialVerificationSchema2.parse(req.body);
      const success = await storage.verifySocialMedia(
        req.session.userId,
        platform,
        username
      );
      res.json({ success });
    } catch (error) {
      console.error("Error verifying social media:", error);
      if (error instanceof z2.ZodError) {
        return res.status(400).json({
          error: "Invalid verification data",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Failed to verify social media" });
    }
  });
  return app2;
}
function createServerWithRoutes(app2) {
  const httpServer = createServer(app2);
  return Promise.resolve(httpServer);
}

// server/vite.ts
import express from "express";
import path2 from "path";
import { fileURLToPath as fileURLToPath2 } from "url";
import { dirname as dirname2 } from "path";
import fs from "fs";
import { nanoid } from "nanoid";
import { createServer as createViteServer } from "vite";
import { createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path, { dirname } from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = dirname(__filename);
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    themePlugin(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared")
    }
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true
  }
});

// server/vite.ts
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = dirname2(__filename2);
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        __dirname2,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(__dirname2, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express2();
app.use(express2.json());
app.use(express2.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path3 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path3.startsWith("/api")) {
      let logLine = `${req.method} ${path3} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    console.error("Error:", err);
    res.status(status).json({ message });
  });
  const server = await createServerWithRoutes(app);
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true
  }, () => {
    log(`serving on port ${port}`);
  });
})();
