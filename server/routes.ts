import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, miningUpdateSchema, updateUserSchema } from "@shared/schema";
import { hashPassword, verifyPassword } from "./auth";
import { z } from "zod";
import crypto from "crypto";
import session from "express-session";
import memorystore from "memorystore";

// Add session type declaration
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Generate a unique referral code
function generateReferralCode(): string {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `NR${random}`;
}

export function registerRoutes(app: express.Express) {
  // Create MemoryStore
  const MemoryStore = memorystore(session);

  // Update session middleware configuration
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key', // Use environment variable in production
    resave: false,
    saveUninitialized: false,
    store: new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    }),
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true
    }
  }));

  // Register new user
  app.post("/api/users", async (req, res) => {
    try {
      // Validate request data against schema
      const validatedData = insertUserSchema.parse(req.body);
      const { referralCode } = req.body;

      // Check if username exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(400).json({
          error: "Username already taken",
          fieldErrors: { username: "This username is already taken" }
        });
      }

      // Check if email exists
      const existingEmail = await storage.getUserByEmail(validatedData.email);
      if (existingEmail) {
        return res.status(400).json({
          error: "Email already registered",
          fieldErrors: { email: "This email is already registered" }
        });
      }

      // Hash password
      const hashedPassword = await hashPassword(validatedData.password);

      // Create user
      const user = await storage.createUser({
        ...validatedData,
        password: hashedPassword,
        referralCount: 0,
        totalReferralRewards: "0"
      });

      // Generate and store referral code
      const newReferralCode = generateReferralCode();
      await storage.createReferralCode(user.id, newReferralCode);

      // Process referral if code was provided
      if (referralCode) {
        await storage.processReferral(referralCode, user.id);
      }

      // Set session
      req.session.userId = user.id;
      await req.session.save();

      // Return user data (excluding password)
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Validation failed",
          fieldErrors: error.errors.reduce((acc, err) => {
            const field = err.path[0] as string;
            acc[field] = err.message;
            return acc;
          }, {} as Record<string, string>)
        });
      }
      res.status(500).json({ error: "Failed to create user" });
    }
  });

  // Update mining endpoint handler
  app.post("/api/mining/:userId", async (req, res) => {
    try {
      // Log incoming request data
      console.log("Mining request body:", req.body);
      console.log("Mining request params:", req.params);

      const userId = parseInt(req.params.userId);
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Validate mining data against schema
      const validationResult = miningUpdateSchema.safeParse({
        userId,
        ...req.body
      });

      if (!validationResult.success) {
        console.error("Mining data validation failed:", validationResult.error);
        return res.status(400).json({
          error: "Invalid mining data",
          details: validationResult.error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      const updateData = validationResult.data;

      // Get user and verify existence
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Update user's mining stats
      const updatedUser = await storage.updateUserMining(
        userId,
        parseFloat(updateData.mined),
        updateData.hashRate
      );

      // Log successful update
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

      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid mining data",
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      res.status(400).json({ error: "Failed to update mining progress" });
    }
  });

  // Login endpoint
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return res.status(400).json({ error: "Username and password are required" });
      }

      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Invalid username or password" });
      }

      // Set session
      req.session.userId = user.id;
      await req.session.save(); // Ensure session is saved

      // Return user data (excluding password)
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

  // Get user by ID
  app.get("/api/users/:id", async (req, res) => {
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

  app.patch("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      const updateData = updateUserSchema.parse(req.body);

      // If username is being updated, check if it's already taken
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
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid update data", details: error.errors });
      }
      res.status(400).json({ error: "Failed to update user" });
    }
  });

  app.get("/api/achievements/:userId", async (req, res) => {
    const achievements = await storage.getAchievements(Number(req.params.userId));
    res.json(achievements);
  });

  app.post("/api/achievements/:userId", async (req, res) => {
    const { type, progress } = z.object({
      type: z.string(),
      progress: z.number(),
    }).parse(req.body);

    const achievement = await storage.updateAchievement(
      Number(req.params.userId),
      type,
      progress
    );
    res.json(achievement);
  });

  app.get("/api/friends/:userId", async (req, res) => {
    const friends = await storage.getFriends(Number(req.params.userId));
    res.json(friends);
  });

  app.post("/api/friends", async (req, res) => {
    const { userId, friendId } = z.object({
      userId: z.number(),
      friendId: z.number(),
    }).parse(req.body);

    const friend = await storage.addFriend(userId, friendId);
    res.json(friend);
  });

  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  // New referral routes
  app.get("/api/referrals/stats", async (req, res) => {
    try {
      // Check for active session and user authentication
      if (!req.session?.userId) {
        console.log("No session found or user not authenticated");
        return res.status(401).json({ error: "Not authenticated" });
      }

      const userId = req.session.userId;
      console.log(`Fetching referral stats for user ${userId}`);

      const stats = await storage.getReferralStats(userId);
      const referralCode = await storage.getReferralCode(userId);

      // Log the response for debugging
      console.log("Referral stats response:", {
        code: referralCode,
        stats: {
          totalReferrals: stats.referralCount || 0,
          currentTier: stats.referralTier || 'None',
          totalRewards: stats.totalReferralRewards || '0',
          pendingRewards: '0'
        }
      });

      res.json({
        code: referralCode,
        stats: {
          totalReferrals: stats.referralCount || 0,
          currentTier: stats.referralTier || 'None',
          totalRewards: stats.totalReferralRewards || '0',
          pendingRewards: '0'
        }
      });
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      res.status(500).json({ error: "Failed to fetch referral stats" });
    }
  });

  // Add these routes for airdrop functionality
  app.get("/api/airdrop/stats", async (req, res) => {
    try {
      const stats = await storage.getAirdropStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching airdrop stats:", error);
      res.status(500).json({ error: "Failed to fetch airdrop stats" });
    }
  });

  // Update the airdrop eligibility check route
  app.get("/api/airdrop/eligibility", async (req, res) => {
    try {
      // Get userId from session
      const userId = req.session?.userId;

      if (!userId) {
        // Instead of just sending error, redirect to login
        return res.status(401).json({ 
          error: "Not authenticated",
          message: "Please log in to check eligibility",
          code: "LOGIN_REQUIRED"
        });
      }

      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        req.session.destroy(() => {});
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

  app.post("/api/airdrop/claim", async (req, res) => {
    try {
      const userId = req.session?.userId;
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const walletAddressSchema = z.object({ walletAddress: z.string().min(42).max(42) });
      const { walletAddress } = walletAddressSchema.parse(req.body);

      const result = await storage.claimAirdrop(userId, walletAddress);
      res.json(result);
    } catch (error) {
      console.error("Error claiming airdrop:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid wallet address",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Failed to claim airdrop" });
    }
  });

  app.post("/api/social/verify", async (req, res) => {
    try {
      if (!req.session?.userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const socialVerificationSchema = z.object({ platform: z.string(), username: z.string() }); //Example schema
      const { platform, username } = socialVerificationSchema.parse(req.body);
      const success = await storage.verifySocialMedia(
        req.session.userId,
        platform,
        username
      );

      res.json({ success });
    } catch (error) {
      console.error("Error verifying social media:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: "Invalid verification data",
          details: error.errors
        });
      }
      res.status(500).json({ error: "Failed to verify social media" });
    }
  });

  return app;
}

export function createServerWithRoutes(app: express.Express): Promise<Server> {
  const httpServer = createServer(app);
  return Promise.resolve(httpServer);
}