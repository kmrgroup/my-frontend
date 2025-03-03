import { useEffect } from "react";
import { useLocation } from "wouter";
import { ClaimAirdrop } from "@/components/airdrop/ClaimAirdrop";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function PostLogin() {
  const [, setLocation] = useLocation();

  const handleComplete = () => {
    // Redirect to dashboard after claiming or skipping
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Welcome to Neura!</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            You're just in time for our exclusive airdrop
          </p>
        </div>

        <ClaimAirdrop onComplete={handleComplete} />
      </div>
    </div>
  );
}