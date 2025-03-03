import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";
import { offchainStorage } from "@/lib/offchain-storage";

export default function StatsCard() {
  const userId = sessionStorage.getItem("userId");
  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    queryFn: getQueryFn({ on401: "throw" }),
    refetchInterval: 2000,
    staleTime: 1000,
    enabled: !!userId,
  });

  // Get activity stats
  const activityStats = user ? offchainStorage.getActivityStats(user.id) : null;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Mining Stats</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Mined</p>
            <p className="text-2xl font-bold text-primary">
              {user?.totalMined !== undefined && user?.totalMined !== null 
                ? Number(user.totalMined).toFixed(8) 
                : "0.00000000"}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Hash Rate</p>
            <p className="text-2xl font-bold text-primary">{user?.currentHashRate || 0} H/s</p>
          </div>
        </div>

        {activityStats && (
          <>
            <div className="h-px bg-border my-4" />
            <div className="space-y-3">
              <h4 className="font-medium">Activity Summary</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Learning Modules Completed</span>
                  <span className="font-medium">{activityStats.learningModulesCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Social Engagements</span>
                  <span className="font-medium">{activityStats.socialEngagements}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Activity Score</span>
                  <span className="font-medium text-primary">
                    {activityStats.activityScore.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="h-px bg-border my-4" />
            <div className="space-y-3">
              <h4 className="font-medium">Recent Transactions</h4>
              <div className="space-y-2">
                {offchainStorage.getUserTransactions(user.id).slice(0, 5).map((tx, i) => (
                  <div key={i} className="text-sm flex justify-between items-start">
                    <div>
                      <p className="font-medium">
                        {tx.type === 'mining_reward' ? 'Mining Reward' :
                         tx.type === 'learning_reward' ? 'Learning Reward' :
                         tx.type === 'social_reward' ? 'Social Reward' : 'Transfer'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <span className="font-medium text-primary">
                      +{tx.amount.toFixed(8)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}