import { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export default function MiningGame() {
  const [isMining, setIsMining] = useState(false);
  const userId = sessionStorage.getItem("userId");

  const { data: user, refetch } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    enabled: !!userId,
    refetchInterval: 2000,
  });

  const handleStartMining = async () => {
    if (!userId) return;
    setIsMining(true);

    try {
      // Mining animation for 10 seconds
      setTimeout(async () => {
        const mined = 0.00002;
        await apiRequest("POST", `/api/mining/${userId}`, {
          mined,
          hashRate: 0
        });

        setIsMining(false);
        refetch();
      }, 10000);
    } catch (error) {
      console.error("Mining error:", error);
      setIsMining(false);
    }
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Neural Mining</h1>
          <p className="text-muted-foreground">Mine NeuraCoin by training neural networks</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Mining Status</h2>
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                <span className="font-medium">{user?.totalMined || "0.00000000"} NC</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isMining ? (
              <div className="p-6 rounded-lg bg-primary/5 border border-primary/10">
                <div className="flex flex-col items-center space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <Brain className="h-16 w-16 text-primary animate-bounce relative z-10" />
                  </div>
                  <p className="text-sm font-medium animate-pulse">Mining in Progress...</p>
                  <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-full bg-primary animate-pulse"
                        style={{
                          animationDelay: `${i * 0.1}s`
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Button 
                className="w-full" 
                onClick={handleStartMining}
                disabled={isMining}
              >
                <Activity className="w-4 h-4 mr-2" />
                Participate in Mining
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}