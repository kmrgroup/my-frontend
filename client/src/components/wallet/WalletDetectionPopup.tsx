import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BsWallet2 } from "react-icons/bs";
import { ethers } from 'ethers';
import detectEthereumProvider from '@metamask/detect-provider';

interface WalletDetectionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletConnect: (address: string) => void;
}

export function WalletDetectionPopup({ isOpen, onClose, onWalletConnect }: WalletDetectionPopupProps) {
  const [detectedWallets, setDetectedWallets] = useState<string[]>([]);
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);

  useEffect(() => {
    if (isOpen) {
      detectWallets();
      checkStoredWallet();
    }
  }, [isOpen]);

  // Listen for wallet events
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('connect', handleConnect);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('connect', handleConnect);
      }
    };
  }, []);

  const handleAccountsChanged = async (accounts: string[]) => {
    if (accounts.length > 0) {
      const address = accounts[0];
      localStorage.setItem('walletAddress', address);
      onWalletConnect(address);
      onClose();
    } else {
      localStorage.removeItem('walletAddress');
    }
  };

  const handleConnect = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_accounts", []);
      if (accounts.length > 0) {
        handleAccountsChanged(accounts);
      }
    } catch (error) {
      console.warn('Connection check failed:', error);
    }
  };

  const checkStoredWallet = async () => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress && window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.includes(storedAddress)) {
          onWalletConnect(storedAddress);
          onClose();
        } else {
          localStorage.removeItem('walletAddress');
        }
      } catch (error) {
        console.warn('Stored wallet check failed:', error);
        localStorage.removeItem('walletAddress');
      }
    }
  };

  const detectWallets = async () => {
    try {
      const wallets: string[] = [];

      // Check if we're in a wallet's built-in browser
      const isWalletBrowser = window.ethereum?.isMetaMask || 
                             window.ethereum?.isTrust ||
                             window.ethereum?.isCoinbaseWallet;

      if (isWalletBrowser) {
        // We're in a wallet browser, just detect which one
        if (window.ethereum?.isMetaMask) wallets.push('metamask');
        if (window.ethereum?.isTrust) wallets.push('trust');
        if (window.ethereum?.isCoinbaseWallet) wallets.push('coinbase');
      } else {
        // We're in a regular browser, detect injected providers
        const provider = await detectEthereumProvider({ silent: true });
        if (provider) {
          if (window.ethereum?.isMetaMask) wallets.push('metamask');
          if (window.ethereum?.isTrust) wallets.push('trust');
          if (window.ethereum?.isCoinbaseWallet) wallets.push('coinbase');
        }
      }

      setDetectedWallets(wallets);
    } catch (error) {
      console.warn('Wallet detection error:', error);
      setDetectedWallets([]);
    }
  };

  const handleWalletConnect = async (walletType: string) => {
    try {
      if (!window.ethereum) {
        if (isMobile) {
          // Store current URL for deep linking return
          localStorage.setItem('walletConnectReturnUrl', window.location.href);

          // Handle mobile deep linking
          const dappUrl = window.location.href;
          let walletUrl = '';

          switch (walletType) {
            case 'metamask':
              walletUrl = `https://metamask.app.link/dapp/${dappUrl}`;
              break;
            case 'trust':
              walletUrl = `trust://open_url?url=${dappUrl}`;
              break;
          }

          if (walletUrl) {
            window.location.href = walletUrl;
          }
        }
        return;
      }

      // Request account access
      try {
        // First request ethereum accounts access
        const accounts = await window.ethereum.request({ 
          method: 'eth_requestAccounts' 
        });

        if (accounts && accounts.length > 0) {
          handleAccountsChanged(accounts);
        } else {
          throw new Error('No accounts returned after permission granted');
        }
      } catch (permissionError) {
        console.error('Permission request failed:', permissionError);
        throw permissionError;
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
    }
  };

  const getWalletIcon = (walletType: string) => {
    return <BsWallet2 className="h-6 w-6" />;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            {detectedWallets.length > 0
              ? "Choose your preferred wallet to connect"
              : "Install a wallet to continue"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {detectedWallets.length > 0 ? (
            detectedWallets.map((wallet) => (
              <Button
                key={wallet}
                variant="outline"
                className="flex items-center justify-start gap-3 h-14"
                onClick={() => handleWalletConnect(wallet)}
              >
                {getWalletIcon(wallet)}
                <span className="capitalize">{wallet} Wallet</span>
              </Button>
            ))
          ) : (
            <div className="space-y-4">
              <a
                href={isMobile ? "https://metamask.app.link/dapp/" : "https://metamask.io/download/"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full flex items-center justify-start gap-3 h-14">
                  {getWalletIcon('metamask')}
                  <div className="text-left">
                    <div>Get MetaMask</div>
                    <div className="text-sm text-muted-foreground">
                      {isMobile ? "Popular mobile wallet" : "Popular browser wallet"}
                    </div>
                  </div>
                </Button>
              </a>
              {isMobile && (
                <a
                  href="https://link.trustwallet.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" className="w-full flex items-center justify-start gap-3 h-14">
                    {getWalletIcon('trust')}
                    <div className="text-left">
                      <div>Get Trust Wallet</div>
                      <div className="text-sm text-muted-foreground">
                        Secure mobile wallet
                      </div>
                    </div>
                  </Button>
                </a>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}