import { useState, useEffect } from "react";
import { AlertTriangle, HelpCircle, Battery, Cpu, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { calculateMiningReward, getMiningSummary } from "@/lib/mining";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { miningService } from "@/lib/mining/miningService";
import type { User } from "@shared/schema";

// Simple UUID generator without crypto dependency
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export default function MiningControls() {
  const userId = sessionStorage.getItem("userId");
  const [isParticipating, setIsParticipating] = useState(false);
  const [cooldownTime, setCooldownTime] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [lastReward, setLastReward] = useState<number | null>(null);
  const [powerMode, setPowerMode] = useState<'efficient' | 'balanced' | 'performance'>('balanced');

  const deviceInfo = {
    isMobile: miningService.isDeviceMobile(),
    stats: miningService.getStats()
  };

  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    refetchInterval: 2000,
    enabled: !!userId,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (cooldownTime > 0) {
        setCooldownTime(time => Math.max(0, time - 1000));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownTime]);

  const handleParticipate = async () => {
    if (!userId) {
      setError("User session expired. Please login again.");
      return;
    }

    if (cooldownTime > 0) {
      setError("Please wait for the cooldown period to end");
      return;
    }

    setIsParticipating(true);
    setError(null);

    try {
      const userIdNum = parseInt(userId, 10);
      if (isNaN(userIdNum) || userIdNum <= 0) {
        throw new Error("Invalid user ID. Please log out and log in again.");
      }

      const reward = calculateMiningReward(user?.totalMined);
      if (reward > 0) {
        const miningData = {
          mined: reward.toFixed(8),
          hashRate: Math.floor(Math.random() * 100) + 50,
          modelHash: generateUUID(),
          accuracy: "0.85",
          loss: "0.15",
          difficulty: "1.0"
        };

        console.log("Mining data payload:", miningData);

        const response = await fetch(`/api/mining/${userIdNum}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(miningData)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to update mining progress');
        }

        const updatedUser = await response.json();
        setLastReward(reward);
        queryClient.setQueryData([`/api/users/${userId}`], updatedUser);
        await queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}`] });
        setError(null);

        setCooldownTime(5000);
      }
    } catch (error) {
      console.error('Participation update failed:', error);
      setError(error instanceof Error ? error.message : "Failed to update participation rewards");
    } finally {
      setIsParticipating(false);
    }
  };

  const handlePowerModeChange = (value: 'efficient' | 'balanced' | 'performance') => {
    setPowerMode(value);
    miningService.setPowerMode(value);
  };

  const miningSummary = user?.totalMined ? getMiningSummary(user.totalMined) : null;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">Network Participation</h2>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <HelpCircle className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-primary text-primary-foreground animate-in zoom-in-50 duration-300">
                  <p>Participate in the network to earn rewards.</p>
                  <p className="text-xs opacity-90 mt-1">Rewards halve every 0.001 units mined!</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Button
            onClick={handleParticipate}
            size="lg"
            disabled={isParticipating || cooldownTime > 0 || !userId}
            className="w-32"
          >
            {isParticipating ? "Processing..." : "Participate"}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Device Type</span>
                <Badge variant="outline">
                  {deviceInfo.isMobile ? "Mobile" : "Desktop"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Power Mode</span>
                <Select value={powerMode} onValueChange={handlePowerModeChange}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efficient">Efficient</SelectItem>
                    <SelectItem value="balanced">Balanced</SelectItem>
                    <SelectItem value="performance">Performance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Battery className="h-4 w-4" />
                <span>Optimizes for battery life</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4" />
                    <span className="text-sm">CPU Usage</span>
                  </div>
                  <span>{deviceInfo.stats.cpuUsage.toFixed(1)}%</span>
                </div>
                <Progress value={deviceInfo.stats.cpuUsage} className="h-2" />

                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-4 w-4" />
                    <span className="text-sm">Temperature</span>
                  </div>
                  <span>{deviceInfo.stats.temperature.toFixed(1)}°C</span>
                </div>
                <Progress 
                  value={(deviceInfo.stats.temperature / (deviceInfo.isMobile ? 65 : 75)) * 100} 
                  className="h-2" 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <div className="flex items-center gap-2">
              <span>Cooldown Period</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary text-primary-foreground animate-in zoom-in-50 duration-300">
                    Wait time between participations to maintain network stability
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span>{formatTimeRemaining(cooldownTime)}</span>
          </div>
          <Progress
            value={Math.max(0, 100 - (cooldownTime / 5000 * 100))}
            className="h-2"
          />
        </div>

        <div className="grid gap-4 p-4 bg-primary/5 rounded-lg">
          <div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Total Mined</label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="bg-primary text-primary-foreground animate-in zoom-in-50 duration-300">
                    Your total earned NeuraCoin from network participation
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <p className="text-2xl font-bold text-primary mt-1">
              {user?.totalMined !== undefined && user?.totalMined !== null
                ? Number(user.totalMined).toFixed(8)
                : "0.00000000"}
            </p>
          </div>

          {miningSummary && (
            <>
              <div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium">Current Reward</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="bg-primary text-primary-foreground animate-in zoom-in-50 duration-300">
                        Current mining reward after {miningSummary.currentHalving} halvings
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xl font-bold text-primary mt-1">
                  {miningSummary.currentReward.toFixed(8)}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress to Next Halving</span>
                  <span>{miningSummary.nextHalvingAt.toFixed(6)}</span>
                </div>
                <Progress value={miningSummary.progress} className="h-2" />
              </div>
            </>
          )}

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-500">
              <AlertTriangle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

const formatTimeRemaining = (ms: number) => {
  if (ms <= 0) return "Ready to participate";
  const seconds = Math.ceil(ms / 1000);
  return `Next participation in ${seconds}s`;
};