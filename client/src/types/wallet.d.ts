import { Buffer } from 'buffer';

declare global {
  interface Window {
    Buffer: typeof Buffer;
  }
}

export interface StoredWallet {
  encryptedPrivateKey: string;
  publicKey: string;
  address: string;
}

export interface WalletGenerationResult {
  mnemonic: string;
  address: string;
  publicKey: string;
}

export interface WalletRecoveryResult {
  address: string;
  publicKey: string;
}
