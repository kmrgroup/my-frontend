import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

// Password hashing function
export async function hashPassword(password: string): Promise<string> {
  try {
    const salt = randomBytes(16).toString("hex");
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString("hex")}.${salt}`;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Failed to hash password");
  }
}

// Password verification function
export async function verifyPassword(suppliedPassword: string, storedPassword: string): Promise<boolean> {
  try {
    const [hashedPassword, salt] = storedPassword.split(".");

    if (!hashedPassword || !salt) {
      console.error("Invalid stored password format");
      return false;
    }

    const storedBuf = Buffer.from(hashedPassword, "hex");
    const suppliedBuf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    const result = timingSafeEqual(storedBuf, suppliedBuf);
    return result;
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
}

// Generate 6-digit OTP
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate OTP expiry time (10 minutes from now)
export function generateOTPExpiry(): Date {
  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 10);
  return expiry;
}

// Verify OTP is valid and not expired
export function isOTPValid(storedOTP: string | null, suppliedOTP: string, expiry: Date | null): boolean {
  if (!storedOTP || !expiry) return false;
  return storedOTP === suppliedOTP && new Date() < expiry;
}