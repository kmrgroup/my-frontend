import MiningControls from "@/components/mining/MiningControls";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { CacheService } from "@/lib/cacheService";
import { motion } from "framer-motion";
import { Brain, ChevronUp, Activity, Network } from "lucide-react";

const StatCard = ({ title, value, icon: Icon, trend = 0 }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-background via-background/80 to-primary/5 p-6 shadow-lg backdrop-blur-lg border border-primary/10"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 backdrop-blur-3xl" />
    <div className="relative z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        {trend !== 0 && (
          <div className={`flex items-center gap-1 text-sm ${trend > 0 ? 'text-green-500' : 'text-red-500'}`}>
            <ChevronUp className={`h-4 w-4 ${trend < 0 ? 'rotate-180' : ''}`} />
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold text-primary mt-1">{value}</p>
    </div>
    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0" />
  </motion.div>
);

export default function Dashboard() {
  const userId = sessionStorage.getItem("userId");
  const { data: user, error: userError } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    refetchInterval: 2000,
    enabled: !!userId && userId !== "null" && !isNaN(parseInt(userId, 10)),
    retry: 3,
    retryDelay: 1000,
    staleTime: 30000,
  });

  const { toast } = useToast();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!userId || userId === "null" || isNaN(parseInt(userId, 10))) {
      toast({
        title: "Session expired",
        description: "Please log in again",
        duration: 3000,
      });
      sessionStorage.removeItem("userId");
      setLocation("/welcome");
    }
  }, [userId, toast, setLocation]);

  const handleLogout = () => {
    const userId = sessionStorage.getItem("userId");
    if (userId) {
      CacheService.clearProfileCache(userId);
    }
    sessionStorage.clear();
    toast({
      title: "Logged out successfully",
      duration: 2000,
    });
    setLocation("/welcome");
  };

  const stats = [
    {
      title: "Hash Rate",
      value: `${user?.currentHashRate || 0} H/s`,
      icon: Brain,
      trend: 5
    },
    {
      title: "Total Mined",
      value: user?.totalMined !== undefined && user?.totalMined !== null
        ? Number(user.totalMined).toFixed(8)
        : "0.00000000",
      icon: Activity,
      trend: 12
    },
    {
      title: "Network Status",
      value: "Active",
      icon: Network,
    }
  ];

  return (
    <div className="space-y-8 pb-16 md:pb-0">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/50">
            Welcome, {user?.displayName || user?.username || 'Miner'}!
          </h1>
          <p className="text-muted-foreground">Your Mining Dashboard</p>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border-primary/20 hover:border-primary/40 transition-all"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </motion.div>

      <div className="grid gap-6">
        <MiningControls />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Mining Activity</h2>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Activity Graph Coming Soon
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-background to-primary/5 border-primary/10">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Network Overview</h2>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Network Stats Coming Soon
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}