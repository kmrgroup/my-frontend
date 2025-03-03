import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Trophy, Gift, AlertCircle, Loader2, Check, 
  Share2
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { SiTelegram, SiInstagram } from "react-icons/si";
import { WalletDetectionPopup } from "../wallet/WalletDetectionPopup";

export function ClaimAirdrop({ onComplete }: { onComplete?: () => void }) {
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkExistingWallet = async () => {
      const storedAddress = localStorage.getItem('walletAddress');
      if (storedAddress && window.ethereum) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []);
          if (accounts.includes(storedAddress)) {
            setWalletAddress(storedAddress);
          } else {
            localStorage.removeItem('walletAddress');
          }
        } catch (error) {
          console.warn('Existing wallet check failed:', error);
          localStorage.removeItem('walletAddress');
        }
      }
    };

    checkExistingWallet();
  }, []);

  // Listen for wallet events
  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          localStorage.setItem('walletAddress', accounts[0]);
        } else {
          setWalletAddress("");
          localStorage.removeItem('walletAddress');
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      };
    }
  }, []);

  // Fetch airdrop stats and eligibility
  const { data: airdropStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/airdrop/stats"],
    queryFn: async () => {
      const res = await fetch("/api/airdrop/stats");
      if (!res.ok) throw new Error("Failed to fetch airdrop stats");
      return res.json();
    }
  });

  const { data: eligibility, isLoading: eligibilityLoading } = useQuery({
    queryKey: ["/api/airdrop/eligibility"],
    queryFn: async () => {
      const res = await fetch("/api/airdrop/eligibility");
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Please log in to check eligibility");
        }
        throw new Error("Failed to check eligibility");
      }
      return res.json();
    }
  });

  // Social media verification mutation
  const verifyMutation = useMutation({
    mutationFn: async ({ platform, url }: { platform: string; url: string }) => {
      window.open(url, '_blank');

      const res = await fetch("/api/social/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform })
      });

      if (!res.ok) throw new Error("Verification failed");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/airdrop/eligibility"] });
      toast({
        title: "Verification initiated",
        description: `Please complete verification on ${variables.platform}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  });

  // Claim mutation
  const claimMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/airdrop/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress })
      });
      if (!res.ok) throw new Error("Failed to claim airdrop");
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/airdrop/eligibility"] });
      toast({
        title: "Airdrop claimed!",
        description: `Successfully claimed ${data.amount} NEURA`,
      });
      if (onComplete) {
        sessionStorage.setItem("hasSeenAirdrop", "true");
        onComplete();
      }
    },
    onError: (error) => {
      toast({
        title: "Claim failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  });

  // Connect wallet with improved mobile support
  const handleWalletConnect = async () => {
    setIsConnecting(true);
    setIsWalletPopupOpen(true);
  };

  const onWalletConnected = (address: string) => {
    setWalletAddress(address);
    setIsConnecting(false);
    toast({
      title: "Wallet connected",
      description: "Your wallet has been connected successfully",
    });
  };

  const handleSkip = () => {
    if (onComplete) {
      sessionStorage.setItem("hasSeenAirdrop", "true");
      onComplete();
    }
  };

  // Loading state
  if (statsLoading || eligibilityLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const socialTasks = [
    { 
      icon: SiTelegram, 
      name: "Telegram", 
      verified: eligibility?.telegramVerified,
      url: "https://t.me/neuranetwork",
      description: "Join our Telegram community",
      instructions: "Join our Telegram group and follow the verification process"
    },
    { 
      icon: SiInstagram, 
      name: "Instagram", 
      verified: eligibility?.instagramVerified,
      url: "https://instagram.com/neuranetwork",
      description: "Follow us on Instagram",
      instructions: "Follow our Instagram account and complete verification"
    }
  ];

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <h2 className="text-2xl font-bold text-center">Claim Your Airdrop</h2>
          <p className="text-center text-muted-foreground">
            Complete tasks to claim your NEURA tokens
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wallet Connection */}
          <div className="space-y-4">
            {!walletAddress ? (
              <Button 
                className="w-full"
                onClick={handleWalletConnect}
                disabled={isConnecting}
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Connect Wallet
              </Button>
            ) : (
              <div className="p-3 bg-muted rounded-lg break-all">
                <p className="text-xs text-muted-foreground">Connected Wallet</p>
                <p className="font-mono">{walletAddress}</p>
              </div>
            )}
          </div>

          {/* Social Media Tasks */}
          <div className="space-y-4">
            <h3 className="font-semibold">Social Media Tasks</h3>
            {socialTasks.map((task) => (
              <div key={task.name} className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <task.icon className="h-6 w-6" />
                    <div>
                      <p className="font-medium">{task.description}</p>
                      <p className="text-sm text-muted-foreground">{task.instructions}</p>
                    </div>
                  </div>
                  {task.verified ? (
                    <div className="flex items-center gap-2 text-green-500">
                      <Check className="h-4 w-4" />
                      <span>Verified</span>
                    </div>
                  ) : (
                    <Button
                      variant="default"
                      onClick={() => verifyMutation.mutate({ 
                        platform: task.name.toLowerCase(),
                        url: task.url
                      })}
                      className="min-w-[100px]"
                    >
                      Visit & Verify
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Claim Button */}
          <Button
            className="w-full"
            onClick={() => claimMutation.mutate()}
            disabled={!eligibility?.eligible || !walletAddress || claimMutation.isPending}
          >
            {claimMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            {eligibility?.eligible ? `Claim ${eligibility?.amount} NEURA` : "Complete Tasks to Claim"}
          </Button>

          {/* Skip Button */}
          <button
            onClick={handleSkip}
            className="w-full text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Skip for now
          </button>

          {/* Error Message */}
          {!eligibility?.eligible && eligibility?.reason && (
            <div className="flex items-center gap-2 p-3 text-sm bg-destructive/10 text-destructive rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <p>{eligibility.reason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <WalletDetectionPopup
        isOpen={isWalletPopupOpen}
        onClose={() => {
          setIsWalletPopupOpen(false);
          setIsConnecting(false);
        }}
        onWalletConnect={onWalletConnected}
      />
    </>
  );
}