import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Share2, Gift, Twitter, Mail, MessageSquare, Loader2, AlertCircle, Trophy, Target, Star } from "lucide-react";
import { SiWhatsapp, SiTelegram, SiInstagram } from "react-icons/si";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Progress } from "@/components/ui/progress";

export default function Referrals() {
  const { toast } = useToast();
  const { data: referralData, isLoading, error } = useQuery({
    queryKey: ["/api/referrals/stats"],
    queryFn: async () => {
      const res = await fetch("/api/referrals/stats");
      if (!res.ok) {
        if (res.status === 401) {
          throw new Error("Please log in to view your referral code");
        }
        throw new Error("Failed to fetch referral stats");
      }
      return res.json();
    },
    retry: 1,
    refetchOnWindowFocus: false
  });

  // Calculate progress to next tier
  const calculateProgress = () => {
    const referralCount = referralData?.stats.totalReferrals || 0;
    if (referralData?.stats.currentTier === 'GOLD') return 100;
    if (referralData?.stats.currentTier === 'PLATINUM') return 100;
    if (referralData?.stats.currentTier === 'SILVER') return 100;
    return Math.min((referralCount / 5) * 100, 100); // Progress to Silver tier (5 referrals)
  };

  // Calculate next milestone
  const getNextMilestone = () => {
    const tier = referralData?.stats.currentTier || 'NONE';
    switch (tier) {
      case 'GOLD':
        return 'You\'ve reached the highest tier!';
      case 'PLATINUM':
        return 'Next: Reach Gold tier by growing your network';
      case 'SILVER':
        return 'Next: Reach Platinum tier when your referrals start inviting others';
      default:
        return 'Next: Reach Silver tier with 5 referrals';
    }
  };

  // Loading state UI
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <p className="text-center text-red-500">
          {error instanceof Error ? error.message : "Failed to load referral data"}
        </p>
      </div>
    );
  }

  const referralCode = referralData?.code;
  if (!referralCode) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px] gap-4">
        <AlertCircle className="h-8 w-8 text-yellow-500" />
        <p className="text-center text-yellow-500">
          No referral code available. Please try logging out and logging back in.
        </p>
      </div>
    );
  }

  const referralLink = `https://neura.network/ref/${referralCode}`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Share with your friends to earn rewards!",
      duration: 2000,
    });
  };

  const shareViaWhatsApp = () => {
    const text = `Join me on Neura Network and earn rewards! Use my referral code: ${referralCode}\n${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaTelegram = () => {
    const text = `Join me on Neura Network and earn rewards! Use my referral code: ${referralCode}\n${referralLink}`;
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = `Join me on Neura Network and earn rewards! Use my referral code: ${referralCode}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const shareViaEmail = () => {
    const subject = "Join Neura Network with my referral code";
    const body = `Join me on Neura Network and earn rewards!\n\nUse my referral code: ${referralCode}\n${referralLink}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const shareViaInstagram = () => {
    const text = `Join me on Neura Network and earn rewards!\nUse my referral code: ${referralCode}\n${referralLink}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      try {
        window.location.href = `instagram://share?text=${encodeURIComponent(text)}`;
      } catch (error) {
        window.open('https://www.instagram.com', '_blank');
        navigator.clipboard.writeText(text);
        toast({
          title: "Share on Instagram",
          description: "Your referral code is ready to share!",
          duration: 3000,
        });
      }
    } else {
      window.open('https://www.instagram.com', '_blank');
      navigator.clipboard.writeText(text);
      toast({
        title: "Share on Instagram",
        description: "Your referral code is ready to share!",
        duration: 3000,
      });
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold">Referral Program</h1>
        <p className="text-muted-foreground">Invite friends and earn rewards together</p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Your Referral Code</h3>
                <div className="flex gap-2">
                  <Input value={referralCode} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(referralCode)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Share Link</h3>
                <div className="flex gap-2">
                  <Input value={referralLink} readOnly />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => copyToClipboard(referralLink)}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Share via</h3>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={shareViaWhatsApp}
                  >
                    <SiWhatsapp className="h-4 w-4" />
                    WhatsApp
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={shareViaTelegram}
                  >
                    <SiTelegram className="h-4 w-4" />
                    Telegram
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={shareViaTwitter}
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={shareViaEmail}
                  >
                    <Mail className="h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={shareViaInstagram}
                  >
                    <SiInstagram className="h-4 w-4" />
                    Instagram
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Your Progress</h2>
            <p className="text-sm text-muted-foreground">{getNextMilestone()}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress to next tier</span>
                  <span>{Math.round(calculateProgress())}%</span>
                </div>
                <Progress value={calculateProgress()} className="h-2" />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div 
                  className={`p-4 rounded-lg transition-transform hover:scale-105 cursor-pointer
                    ${referralData?.stats.currentTier === 'SILVER' 
                      ? 'bg-primary/10 border-2 border-primary' 
                      : 'bg-muted/50 hover:bg-muted/70'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full transition-colors
                      ${referralData?.stats.currentTier === 'SILVER' 
                        ? 'bg-primary/20' 
                        : 'bg-silver-500/10'}`}
                    >
                      <Trophy className={`h-6 w-6 transition-all
                        ${referralData?.stats.currentTier === 'SILVER'
                          ? 'text-primary animate-pulse'
                          : 'text-muted-foreground'}`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">Silver</p>
                      <p className="text-sm text-muted-foreground">
                        {referralData?.stats.currentTier === 'SILVER' 
                          ? '✨ Current Tier'
                          : '5 Referrals'}
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`p-4 rounded-lg transition-transform hover:scale-105 cursor-pointer
                    ${referralData?.stats.currentTier === 'PLATINUM'
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted/50 hover:bg-muted/70'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full transition-colors
                      ${referralData?.stats.currentTier === 'PLATINUM'
                        ? 'bg-primary/20'
                        : 'bg-primary/10'}`}
                    >
                      <Star className={`h-6 w-6 transition-all
                        ${referralData?.stats.currentTier === 'PLATINUM'
                          ? 'text-primary animate-pulse'
                          : 'text-muted-foreground'}`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">Platinum</p>
                      <p className="text-sm text-muted-foreground">
                        {referralData?.stats.currentTier === 'PLATINUM'
                          ? '✨ Current Tier'
                          : '10% Bonus'}
                      </p>
                    </div>
                  </div>
                </div>

                <div 
                  className={`p-4 rounded-lg transition-transform hover:scale-105 cursor-pointer
                    ${referralData?.stats.currentTier === 'GOLD'
                      ? 'bg-primary/10 border-2 border-primary'
                      : 'bg-muted/50 hover:bg-muted/70'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full transition-colors
                      ${referralData?.stats.currentTier === 'GOLD'
                        ? 'bg-primary/20'
                        : 'bg-yellow-500/10'}`}
                    >
                      <Target className={`h-6 w-6 transition-all
                        ${referralData?.stats.currentTier === 'GOLD'
                          ? 'text-primary animate-pulse'
                          : 'text-muted-foreground'}`}
                      />
                    </div>
                    <div>
                      <p className="font-semibold">Gold</p>
                      <p className="text-sm text-muted-foreground">
                        {referralData?.stats.currentTier === 'GOLD'
                          ? '✨ Current Tier'
                          : '5% Network Bonus'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Referrals</p>
                  <p className="text-2xl font-bold">{referralData?.stats.totalReferrals || 0}</p>
                </div>
                <div className="bg-primary/10 p-3 rounded-full">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Current Tier</p>
                  <p className="text-2xl font-bold">{referralData?.stats.currentTier || 'None'}</p>
                </div>
                <div className="bg-yellow-500/10 p-3 rounded-full">
                  <Gift className="h-6 w-6 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Rewards</p>
                  <p className="text-2xl font-bold">{referralData?.stats.totalRewards || '0 NC'}</p>
                </div>
                <div className="bg-green-500/10 p-3 rounded-full">
                  <Gift className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Rewards</p>
                  <p className="text-2xl font-bold">{referralData?.stats.pendingRewards || '0 NC'}</p>
                </div>
                <div className="bg-purple-500/10 p-3 rounded-full">
                  <Gift className="h-6 w-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}