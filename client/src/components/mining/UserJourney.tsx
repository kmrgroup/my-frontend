import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Brain, Star, Users, Award, Trophy } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { offchainStorage } from "@/lib/offchain-storage";

interface Milestone {
  id: number;
  title: string;
  description: string;
  icon: typeof Brain;
  completed: boolean;
  date?: Date;
}

export default function UserJourney() {
  const userId = sessionStorage.getItem("userId");
  const { data: user } = useQuery<User>({
    queryKey: [`/api/users/${userId}`],
    refetchInterval: 2000,
    enabled: !!userId,
  });

  const [milestones, setMilestones] = useState<Milestone[]>([]);

  useEffect(() => {
    if (!user || !userId) return;

    const transactions = offchainStorage.getUserTransactions(parseInt(userId));
    const stats = offchainStorage.getActivityStats(parseInt(userId));

    const userMilestones: Milestone[] = [
      {
        id: 1,
        title: "Journey Begins",
        description: "Welcome to NeuraCoin",
        icon: Brain,
        completed: true,
        date: new Date(transactions[0]?.timestamp || Date.now())
      },
      {
        id: 2,
        title: "First Mining Reward",
        description: "Started contributing to the network",
        icon: Star,
        completed: stats.totalMined > 0,
        date: transactions.find(t => t.type === 'mining_reward')?.timestamp 
          ? new Date(transactions.find(t => t.type === 'mining_reward')!.timestamp)
          : undefined
      },
      {
        id: 3,
        title: "Learning Pioneer",
        description: "Completed first learning module",
        icon: Brain,
        completed: stats.learningModulesCompleted > 0,
        date: transactions.find(t => t.type === 'learning_reward')?.timestamp
          ? new Date(transactions.find(t => t.type === 'learning_reward')!.timestamp)
          : undefined
      },
      {
        id: 4,
        title: "Community Member",
        description: "First social engagement",
        icon: Users,
        completed: stats.socialEngagements > 0,
        date: transactions.find(t => t.type === 'social_reward')?.timestamp
          ? new Date(transactions.find(t => t.type === 'social_reward')!.timestamp)
          : undefined
      },
      {
        id: 5,
        title: "Active Contributor",
        description: "Achieved significant activity score",
        icon: Award,
        completed: stats.activityScore > 50,
        date: transactions.find(t => t.activityScore && t.activityScore > 50)?.timestamp
          ? new Date(transactions.find(t => t.activityScore && t.activityScore > 50)!.timestamp)
          : undefined
      }
    ];

    setMilestones(userMilestones);
  }, [user, userId]);

  if (!userId || !user) return null;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Your Journey</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <motion.div
                key={milestone.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative pl-12"
              >
                <motion.div
                  initial={false}
                  animate={{
                    scale: milestone.completed ? [1, 1.2, 1] : 1,
                    backgroundColor: milestone.completed ? "rgb(var(--primary))" : "rgb(var(--muted))"
                  }}
                  transition={{ duration: 0.3 }}
                  className={`absolute left-2 w-5 h-5 rounded-full border-2 border-background 
                    ${milestone.completed ? 'bg-primary' : 'bg-muted'}`}
                >
                  {milestone.completed && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 bg-primary/20 rounded-full animate-ping"
                    />
                  )}
                </motion.div>

                <div className={`space-y-1 ${milestone.completed ? 'opacity-100' : 'opacity-50'}`}>
                  <div className="flex items-center gap-2">
                    <milestone.icon className="h-4 w-4 text-primary" />
                    <h4 className="font-medium">{milestone.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  {milestone.date && (
                    <p className="text-xs text-muted-foreground">
                      {milestone.date.toLocaleDateString()}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}