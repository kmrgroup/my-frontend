import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";
import type { Achievement } from "@shared/schema";

export default function AchievementCard() {
  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements/1"],
  });

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Recent Achievements</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements?.slice(0, 3).map((achievement) => (
          <div key={achievement.id} className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-medium">{achievement.type}</p>
              <p className="text-sm text-muted-foreground">
                {achievement.progress}%
              </p>
            </div>
            <Progress value={achievement.progress} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
