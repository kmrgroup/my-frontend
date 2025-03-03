import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Twitter } from "lucide-react";

export default function TwitterPost() {
  const tweetText = encodeURIComponent(
    "🚀 Excited to join the NEURA Network Airdrop! \n\n" +
    "🎁 Rewards:\n" +
    "• First 50K users: 1000 NEURA\n" +
    "• Next 100K users: 500 NEURA\n" +
    "• Social Media Bonus: +250 NEURA\n\n" +
    "Join now at: [Your Landing Page URL] 🌟\n\n" +
    "#NEURA #Blockchain #Airdrop #Web3"
  );

  const handleShare = () => {
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}`, '_blank');
  };

  return (
    <div className="container max-w-2xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <h1 className="text-3xl font-bold text-center">Share NEURA Airdrop</h1>
          <p className="text-muted-foreground text-center">
            Help spread the word about NEURA Network's airdrop
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted/50 p-6 rounded-lg space-y-4">
            <h2 className="text-xl font-semibold">Airdrop Details</h2>
            <div className="space-y-2">
              <p className="text-sm">🎯 Tier 1: First 50,000 users get 1000 NEURA</p>
              <p className="text-sm">🎯 Tier 2: Next 100,000 users get 500 NEURA</p>
              <p className="text-sm">🌟 Complete social tasks for +250 NEURA bonus</p>
              <p className="text-sm">💫 Features: AI-powered POW-FNN mining</p>
              <p className="text-sm">🤝 Multi-tier referral system</p>
            </div>
          </div>

          <Button 
            className="w-full flex items-center justify-center gap-2" 
            onClick={handleShare}
          >
            <Twitter className="h-5 w-5" />
            Share on Twitter
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            Share with your network and help build the NEURA community!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
