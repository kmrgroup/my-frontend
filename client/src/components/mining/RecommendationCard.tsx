import { useQuery } from "@tanstack/react-query";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Activity, Users } from "lucide-react";
import { recommendationEngine } from "@/lib/recommendation-engine";
import { Link } from "wouter";
import type { User } from "@shared/schema";

export default function RecommendationCard() {
  const { data: user } = useQuery<User>({
    queryKey: ["/api/users/1"],
    refetchInterval: 2000,
  });

  const recommendations = user ? recommendationEngine.getRecommendations(user.id) : [];

  const getIcon = (type: string) => {
    switch (type) {
      case 'learning':
        return <Brain className="h-5 w-5 text-blue-500" />;
      case 'mining':
        return <Activity className="h-5 w-5 text-green-500" />;
      case 'social':
        return <Users className="h-5 w-5 text-purple-500" />;
      default:
        return null;
    }
  };

  if (!recommendations.length) return null;

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Recommended Actions</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 transition-colors"
          >
            {getIcon(rec.type)}
            <div className="flex-1 space-y-1">
              <h4 className="font-medium">{rec.title}</h4>
              <p className="text-sm text-muted-foreground">{rec.description}</p>
            </div>
            {rec.actionUrl && (
              <Link href={rec.actionUrl}>
                <Button variant="outline" size="sm">
                  Start
                </Button>
              </Link>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
