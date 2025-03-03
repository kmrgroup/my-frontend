import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Trophy, Gift, AlertCircle, Loader2, Check, 
  Twitter, MessageSquare, Share2 
} from "lucide-react";
import { SiTelegram, SiReddit, SiFacebook, SiInstagram } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";
import { queryClient } from "@/lib/queryClient";
import { useState } from "react";

export default function Airdrop() {
  const { toast } = useToast();
  const [walletAddress, setWalletAddress] = useState("");

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

  // Mutations for social media verification
  const verifyMutation = useMutation({
    mutationFn: async ({ platform, username }: { platform: string; username: string }) => {
      const res = await fetch("/api/social/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platform, username })
      });
      if (!res.ok) throw new Error("Verification failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/airdrop/eligibility"] });
      toast({
        title: "Verification successful",
        description: "Your social media account has been verified",
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

  // Mutation for claiming airdrop
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
    },
    onError: (error) => {
      toast({
        title: "Claim failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    }
  });

  // Loading state
  if (statsLoading || eligibilityLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold">NEURA Airdrop</h1>
        <p className="text-muted-foreground">Join our community and earn NEURA tokens</p>
      </div>

      <div className="grid gap-6">
        {/* Reward Tiers */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Reward Tiers</h2>
            <p className="text-sm text-muted-foreground">
              Early participants get higher rewards!
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Tier 1 */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Tier 1 (First 50,000 Users)</p>
                    <p className="text-2xl font-bold">1000 NEURA</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Spots Remaining</span>
                    <span>{airdropStats?.remainingTier1.toLocaleString()}</span>
                  </div>
                  <Progress value={(50000 - airdropStats?.remainingTier1) / 500} />
                </div>
              </div>

              {/* Tier 2 */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Tier 2 (Next 100,000 Users)</p>
                    <p className="text-2xl font-bold">500 NEURA</p>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Spots Remaining</span>
                    <span>{airdropStats?.remainingTier2.toLocaleString()}</span>
                  </div>
                  <Progress value={(100000 - airdropStats?.remainingTier2) / 1000} />
                </div>
              </div>

              {/* Social Media Bonus */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Share2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Social Media Bonus</p>
                    <p className="text-2xl font-bold">+250 NEURA</p>
                    <p className="text-sm text-muted-foreground">
                      Complete all social media tasks for bonus tokens
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Participants */}
              <div className="p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MessageSquare className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">Total Participants</p>
                    <p className="text-2xl font-bold">{airdropStats?.totalParticipants.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tasks */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Eligibility Tasks</h2>
            <p className="text-sm text-muted-foreground">
              {eligibility?.eligible 
                ? `You are eligible to claim ${eligibility.amount} NEURA tokens!`
                : "Complete all tasks to claim your airdrop"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Telegram */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <SiTelegram className="h-6 w-6" />
                  <span>Join Telegram</span>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => verifyMutation.mutate({ platform: 'telegram', username: 'user' })}
                  disabled={eligibility?.telegramVerified}
                >
                  {eligibility?.telegramVerified ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : "Verify"}
                </Button>
              </div>

              {/* Twitter */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Twitter className="h-6 w-6" />
                  <span>Follow on Twitter</span>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => verifyMutation.mutate({ platform: 'twitter', username: 'user' })}
                  disabled={eligibility?.twitterVerified}
                >
                  {eligibility?.twitterVerified ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : "Verify"}
                </Button>
              </div>

              {/* Instagram */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <SiInstagram className="h-6 w-6" />
                  <span>Follow on Instagram</span>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => verifyMutation.mutate({ platform: 'instagram', username: 'user' })}
                  disabled={eligibility?.instagramVerified}
                >
                  {eligibility?.instagramVerified ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : "Verify"}
                </Button>
              </div>

              {/* Facebook */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <SiFacebook className="h-6 w-6" />
                  <span>Follow on Facebook</span>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => verifyMutation.mutate({ platform: 'facebook', username: 'user' })}
                  disabled={eligibility?.facebookVerified}
                >
                  {eligibility?.facebookVerified ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : "Verify"}
                </Button>
              </div>

              {/* Reddit */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <SiReddit className="h-6 w-6" />
                  <span>Join Reddit</span>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => verifyMutation.mutate({ platform: 'reddit', username: 'user' })}
                  disabled={eligibility?.redditVerified}
                >
                  {eligibility?.redditVerified ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : "Verify"}
                </Button>
              </div>

              {/* Referrals */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-6 w-6" />
                  <div>
                    <span>Refer 5 Friends</span>
                    <p className="text-sm text-muted-foreground">
                      {eligibility?.referralCount || 0}/5 referrals
                    </p>
                  </div>
                </div>
                {eligibility?.referralCount >= 5 ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <span className="text-sm text-muted-foreground">In Progress</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Claim Section */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Claim Airdrop</h2>
            <p className="text-sm text-muted-foreground">
              {eligibility?.eligible 
                ? `You are eligible to claim ${eligibility.amount} NEURA tokens!`
                : eligibility?.reason || "Complete all tasks to become eligible"}
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Wallet Address</label>
                <Input
                  placeholder="Enter your ERC20 wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
              </div>
              <Button
                className="w-full"
                disabled={!eligibility?.eligible || !walletAddress || claimMutation.isPending}
                onClick={() => claimMutation.mutate()}
              >
                {claimMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                {eligibility?.eligible ? "Claim Airdrop" : "Complete Tasks to Claim"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}