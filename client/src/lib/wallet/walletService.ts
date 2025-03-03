import { ethers } from 'ethers';
import * as bip39 from 'bip39';
import * as CryptoJS from 'crypto-js';
import { Buffer } from 'buffer';
import type { StoredWallet, WalletGenerationResult, WalletRecoveryResult } from '@/types/wallet';

// Make Buffer available globally
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

class WalletService {
  private static readonly WALLET_STORAGE_KEY = 'neura_wallet';
  private static readonly ENCRYPTION_KEY = 'NEURA_WALLET_KEY'; // Will be replaced with user-provided password

  // Step 1: User clicks "Create Wallet"
  static async generateWallet(): Promise<WalletGenerationResult> {
    try {
      // Initialize Buffer if not already done
      if (typeof window !== 'undefined' && !window.Buffer) {
        window.Buffer = Buffer;
      }

      // Check if wallet already exists
      const existingWallet = this.getStoredWallet();
      if (existingWallet) {
        try {
          // Validate existing wallet data
          if (!existingWallet.address || !existingWallet.publicKey) {
            console.log("Found corrupted wallet data, clearing...");
            this.clearWallet();
          } else {
            console.log("Wallet exists, returning stored wallet data");
            return {
              mnemonic: '', // Never return mnemonic for existing wallet
              address: existingWallet.address,
              publicKey: existingWallet.publicKey
            };
          }
        } catch (error) {
          console.error("Error validating existing wallet:", error);
          this.clearWallet();
        }
      }

      console.log("Starting wallet generation process...");

      // Generate BIP-39 mnemonic
      const mnemonic = bip39.generateMnemonic(128); // 12 words
      if (!mnemonic) {
        throw new Error("Failed to generate mnemonic");
      }
      console.log("Mnemonic generated successfully");

      // Create wallet from mnemonic
      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      if (!wallet || !wallet.address || !wallet.publicKey) {
        throw new Error("Failed to create valid wallet from mnemonic");
      }
      console.log("Wallet created from mnemonic");

      // Get wallet details
      const address = wallet.address;
      const publicKey = wallet.publicKey;

      console.log("Generated wallet with address:", address);

      return {
        mnemonic,
        address,
        publicKey
      };
    } catch (error) {
      console.error('Wallet generation error details:', {
        error: error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });

      throw new Error(`Failed to create wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Step 5: Complete wallet setup - encrypt and store
  static completeWalletSetup(mnemonic: string): {
    address: string;
  } {
    try {
      // Create wallet from mnemonic
      const wallet = ethers.Wallet.fromPhrase(mnemonic);
      if (!wallet) {
        throw new Error("Failed to create wallet from mnemonic");
      }

      // Get wallet details
      const address = wallet.address;
      const publicKey = wallet.publicKey;

      if (!address || !publicKey) {
        throw new Error("Wallet creation returned incomplete data");
      }

      // Encrypt private key
      const encryptedPrivateKey = this.encryptPrivateKey(wallet.privateKey);

      // Store wallet data
      const walletData: StoredWallet = {
        encryptedPrivateKey,
        publicKey,
        address
      };

      // Store in localStorage with persistance
      try {
        localStorage.setItem(WalletService.WALLET_STORAGE_KEY, JSON.stringify(walletData));
        console.log("Wallet setup completed and stored locally");
      } catch (storageError) {
        console.error("Failed to store wallet data:", storageError);
        throw new Error("Failed to store wallet data locally");
      }

      return {
        address
      };
    } catch (error) {
      console.error('Wallet setup error:', error);
      throw new Error(`Failed to complete wallet setup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get stored wallet info with validation
  static getStoredWallet(): StoredWallet | null {
    try {
      const storedData = localStorage.getItem(WalletService.WALLET_STORAGE_KEY);
      if (!storedData) return null;

      const parsedData = JSON.parse(storedData) as StoredWallet;

      // Validate wallet data
      if (!parsedData.address || !parsedData.publicKey || !parsedData.encryptedPrivateKey) {
        console.error('Invalid wallet data found');
        this.clearWallet();
        return null;
      }

      return parsedData;
    } catch (error) {
      console.error('Error getting stored wallet:', error);
      this.clearWallet();
      return null;
    }
  }

  // Clear wallet data safely
  static clearWallet(): void {
    try {
      localStorage.removeItem(WalletService.WALLET_STORAGE_KEY);
      console.log('Wallet data cleared successfully');
    } catch (error) {
      console.error('Error clearing wallet data:', error);
    }
  }

  // Private helper methods
  private static encryptPrivateKey(privateKey: string): string {
    return CryptoJS.AES.encrypt(privateKey, WalletService.ENCRYPTION_KEY).toString();
  }

  private static decryptPrivateKey(encryptedPrivateKey: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, WalletService.ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Recover wallet from mnemonic (BIP-39)
  static async recoverWallet(mnemonic: string): Promise<WalletRecoveryResult> {
    try {
      // Validate BIP-39 mnemonic
      if (!bip39.validateMnemonic(mnemonic)) {
        throw new Error('Invalid mnemonic phrase. Please check your seed words and try again.');
      }

      console.log("Valid BIP-39 mnemonic provided, recovering wallet...");

      // Create wallet from mnemonic using BIP-44 derivation path
      const path = "m/44'/60'/0'/0/0"; // Standard Ethereum BIP-44 derivation path
      const wallet = ethers.Wallet.fromPhrase(mnemonic);

      console.log("Derived private key and public address using BIP-44");

      // Get wallet details
      const address = await wallet.getAddress();
      const publicKey = wallet.publicKey;

      // Encrypt and store private key
      const encryptedPrivateKey = this.encryptPrivateKey(wallet.privateKey);
      console.log("Private key encrypted successfully");

      // Store wallet data
      const walletData: StoredWallet = {
        encryptedPrivateKey,
        publicKey,
        address
      };

      localStorage.setItem(WalletService.WALLET_STORAGE_KEY, JSON.stringify(walletData));
      console.log("Wallet recovery complete and stored locally");

      return {
        address,
        publicKey
      };
    } catch (error) {
      console.error('Wallet recovery error:', error);
      throw new Error(`Failed to recover wallet: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Sign a transaction
  static async signTransaction(to: string, amount: string): Promise<string> {
    const storedWallet = this.getStoredWallet();
    if (!storedWallet) {
      throw new Error('No wallet found');
    }

    const decryptedPrivateKey = this.decryptPrivateKey(storedWallet.encryptedPrivateKey);
    const wallet = new ethers.Wallet(decryptedPrivateKey);

    const transaction = {
      to,
      value: ethers.parseEther(amount),
      gasLimit: "21000", // Basic transaction gas limit
      gasPrice: ethers.parseUnits("20", "gwei")
    };

    const signedTx = await wallet.signTransaction(transaction);
    return signedTx;
  }
}

// Add event listener for page unload to ensure wallet data is saved
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const wallet = WalletService.getStoredWallet();
    if (wallet) {
      try {
        localStorage.setItem(WalletService.WALLET_STORAGE_KEY, JSON.stringify(wallet));
      } catch (error) {
        console.error('Error saving wallet data before unload:', error);
      }
    }
  });
}

export { WalletService };