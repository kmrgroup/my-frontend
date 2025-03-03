import { pgTable, text, serial, boolean, timestamp, integer, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core user schema - add social media verification and wallet fields
export const users = pgTable("users", {
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
  registrationNumber: integer("registration_number"), // To track user order for tiered distribution
});

// Airdrop tracking schema
export const airdropClaims = pgTable("airdrop_claims", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  claimAmount: text("claim_amount").notNull(),
  claimType: text("claim_type").notNull(), // 'TIER_1', 'TIER_2', 'SOCIAL_BONUS'
  timestamp: timestamp("timestamp").defaultNow(),
  status: text("status").notNull(), // 'pending', 'completed', 'failed'
  walletAddress: text("wallet_address").notNull(),
});

// Social media verification schema
export const socialVerification = pgTable("social_verification", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  platform: text("platform").notNull(), // 'telegram', 'twitter', etc.
  platformUserId: text("platform_user_id"),
  username: text("username"),
  verified: boolean("verified").default(false),
  verifiedAt: timestamp("verified_at"),
});

// Validation schemas
export const socialVerificationSchema = z.object({
  platform: z.enum(['telegram', 'twitter', 'instagram', 'facebook', 'reddit']),
  platformUserId: z.string().optional(),
  username: z.string().min(1, "Username is required"),
});

export const walletAddressSchema = z.object({
  walletAddress: z.string()
    .min(42, "Invalid wallet address length")
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format")
});

// Form validation schemas
export const insertUserSchema = createInsertSchema(users, {
  username: z.string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores and hyphens"),
  email: z.string()
    .email("Please enter a valid email address"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")
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
  registrationNumber: true,
});

// Mining update schema
export const miningUpdateSchema = z.object({
  userId: z.number().int("User ID must be an integer").positive("User ID must be positive"),
  mined: z.string().regex(/^\d*\.?\d*$/, "Invalid mining amount"),
  hashRate: z.number().min(0, "Hash rate must be positive"),
  modelHash: z.string(),
  accuracy: z.union([z.string(), z.number()]).transform(val => val.toString()),
  loss: z.union([z.string(), z.number()]).transform(val => val.toString()),
  difficulty: z.union([z.string(), z.number()]).transform(val => val.toString())
});

// User update schema
export const updateUserSchema = z.object({
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

// Transaction history
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  fromUserId: integer("from_user_id").notNull(),
  toUserId: integer("to_user_id").notNull(),
  amount: numeric("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  type: text("type").notNull(), // 'mining_reward', 'transfer', etc.
  status: text("status").notNull().default('pending'),
});

// Achievement and friend schemas
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: text("type").notNull(),
  progress: integer("progress").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
});

export const friends = pgTable("friends", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  friendId: integer("friend_id").notNull(),
  status: text("status").notNull().default("pending"),
});

// Referral tiers and their requirements
export const referralTiers = {
  SILVER: { minReferrals: 5, reward: 100 },
  PLATINUM: { percentage: 10 },
  GOLD: { percentage: 5 }
} as const;

// Referral codes table
export const referralCodes = pgTable("referral_codes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  code: text("code").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Referral tracking table
export const referrals = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull().references(() => users.id),
  referredId: integer("referred_id").notNull().references(() => users.id),
  tier: text("tier").notNull(), // 'SILVER', 'PLATINUM', 'GOLD'
  rewardAmount: text("reward_amount").notNull(),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Mining rewards schema
export const miningRewards = pgTable("mining_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  amount: text("amount").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  accuracy: text("accuracy").notNull(),
  loss: text("loss").notNull(),
  modelHash: text("model_hash").notNull(),
  difficulty: text("difficulty").notNull(),
  validated: boolean("validated").default(false),
});

// Export types
export type User = typeof users.$inferSelect;
export type AirdropClaim = typeof airdropClaims.$inferSelect;
export type SocialVerification = typeof socialVerification.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type MiningUpdate = z.infer<typeof miningUpdateSchema>;
export type Transaction = typeof transactions.$inferSelect;
export type ReferralCode = typeof referralCodes.$inferSelect;
export type Referral = typeof referrals.$inferSelect;
export type MiningReward = typeof miningRewards.$inferSelect;