import { db } from "./db";

/**
 * Small migration script to modify the total_mined column type
 */
async function migrateTotalMined() {
  try {
    console.log("Starting migration...");
    
    // First check if we need to convert the column
    const checkResult = await db.execute(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'total_mined'
    `);
    
    const dataType = checkResult.rows[0]?.data_type;
    console.log(`Current total_mined data type: ${dataType}`);
    
    if (dataType === 'integer') {
      // Convert integers to text and preserve values
      console.log("Converting total_mined from integer to text...");
      await db.execute(`
        ALTER TABLE users 
        ALTER COLUMN total_mined TYPE text 
        USING total_mined::text
      `);
      console.log("Column type successfully changed to text");
    } else {
      console.log("No migration needed - column is already the correct type");
    }
    
    // Verify the change
    const verifyResult = await db.execute(`
      SELECT data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'total_mined'
    `);
    
    console.log(`New total_mined data type: ${verifyResult.rows[0]?.data_type}`);
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    //process.exit(0); //Removed to allow both migrations to run
  }
}


/**
 * Migration script to add new authentication fields
 */
async function migrateAuthFields() {
  try {
    console.log("Starting migration...");

    // Add email column if it doesn't exist
    const emailCheck = await db.execute(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'email'
    `);

    if (!emailCheck.rows.length) {
      console.log("Adding email column...");
      await db.execute(`
        ALTER TABLE users 
        ADD COLUMN email text UNIQUE,
        ADD COLUMN kyc_name text,
        ADD COLUMN date_of_birth date,
        ADD COLUMN email_verified boolean DEFAULT false,
        ADD COLUMN otp_secret text,
        ADD COLUMN otp_expiry timestamp
      `);
      console.log("Added new authentication columns");
    }

    // Verify the changes
    const verifyColumns = await db.execute(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'users'
    `);

    console.log("Updated table structure:", verifyColumns.rows);
    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

/**
 * Migration script to add referral system tables and fields
 */
async function migrateReferralSystem() {
  try {
    console.log("Starting referral system migration...");

    // Add referral fields to users table
    await db.execute(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS referral_count integer DEFAULT 0,
      ADD COLUMN IF NOT EXISTS referral_tier text,
      ADD COLUMN IF NOT EXISTS total_referral_rewards text DEFAULT '0'
    `);

    // Create referral_codes table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS referral_codes (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id),
        code text NOT NULL UNIQUE,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create referrals table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS referrals (
        id serial PRIMARY KEY,
        referrer_id integer NOT NULL REFERENCES users(id),
        referred_id integer NOT NULL REFERENCES users(id),
        tier text NOT NULL,
        reward_amount text NOT NULL,
        status text NOT NULL DEFAULT 'pending',
        created_at timestamp DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log("Referral system migration completed successfully!");
  } catch (error) {
    console.error("Referral system migration failed:", error);
  }
}

/**
 * Migration script to add airdrop-related fields and tables
 */
async function migrateAirdropSystem() {
  try {
    console.log("Starting airdrop system migration...");

    // Add new fields to users table
    await db.execute(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS wallet_address text UNIQUE,
      ADD COLUMN IF NOT EXISTS telegram_verified boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS twitter_verified boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS instagram_verified boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS facebook_verified boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS reddit_verified boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS airdrop_claimed boolean DEFAULT false,
      ADD COLUMN IF NOT EXISTS airdrop_amount text DEFAULT '0',
      ADD COLUMN IF NOT EXISTS registration_number serial
    `);

    // Create airdrop_claims table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS airdrop_claims (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id),
        claim_amount text NOT NULL,
        claim_type text NOT NULL,
        timestamp timestamp DEFAULT CURRENT_TIMESTAMP,
        status text NOT NULL,
        wallet_address text NOT NULL
      )
    `);

    // Create social_verification table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS social_verification (
        id serial PRIMARY KEY,
        user_id integer NOT NULL REFERENCES users(id),
        platform text NOT NULL,
        platform_user_id text,
        username text,
        verified boolean DEFAULT false,
        verified_at timestamp,
        UNIQUE(user_id, platform)
      )
    `);

    console.log("Airdrop system migration completed successfully!");
  } catch (error) {
    console.error("Airdrop system migration failed:", error);
    throw error;
  }
}

// Run all migrations
async function runMigrations() {
  await migrateAirdropSystem();
  await migrateTotalMined();
  await migrateAuthFields();
  await migrateReferralSystem();
}

// Export migrations
export {
  migrateAirdropSystem,
  migrateTotalMined,
  migrateAuthFields,
  migrateReferralSystem,
  runMigrations
};

// Run migrations
runMigrations();