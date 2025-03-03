import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Achievement } from "@shared/schema";

const ACHIEVEMENT_IMAGES = [
  "https://images.unsplash.com/photo-1548126466-4470dfd3a209",
  "https://images.unsplash.com/photo-1571008840902-28bf8f9cd71a",
  "https://images.unsplash.com/photo-1571008592377-e362723e8998",
  "https://images.unsplash.com/photo-1552035509-b247fe8e5078",
  "https://images.unsplash.com/photo-1548051718-3acad2d13740",
  "https://images.unsplash.com/photo-1536682984-f6086a5e8004",
];

export default function Achievements() {
  const { data: achievements } = useQuery<Achievement[]>({
    queryKey: ["/api/achievements/1"],
  });

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <h1 className="text-3xl font-bold">Achievements</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements?.map((achievement, index) => (
          <Card key={achievement.id}>
            <CardHeader className="relative h-48">
              <img
                src={ACHIEVEMENT_IMAGES[index % ACHIEVEMENT_IMAGES.length]}
                alt={achievement.type}
                className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
              />
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <h3 className="text-lg font-semibold">{achievement.type}</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Progress</span>
                  <span className="text-sm font-medium">{achievement.progress}%</span>
                </div>
                <Progress value={achievement.progress} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
