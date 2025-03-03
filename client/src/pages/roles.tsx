import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Shield, Star, Lock, Users, Award } from "lucide-react";

export default function NeuraRoles() {
  const roles = [
    {
      name: "Validator",
      icon: Shield,
      level: "Advanced",
      status: "Active",
      progress: 85,
      requirements: [
        "Minimum 10,000 NC staked",
        "99.9% uptime",
        "Hardware requirements met"
      ]
    },
    {
      name: "Data Provider",
      icon: Star,
      level: "Intermediate",
      status: "Available",
      progress: 60,
      requirements: [
        "Minimum 5,000 NC staked",
        "Verified identity",
        "API endpoint active"
      ]
    },
    {
      name: "Network Guardian",
      icon: Lock,
      level: "Expert",
      status: "Locked",
      progress: 30,
      requirements: [
        "Minimum 50,000 NC staked",
        "Community vote required",
        "Previous validator experience"
      ]
    }
  ];

  const achievements = [
    {
      title: "Early Adopter",
      description: "Joined during network genesis",
      icon: Award,
      earned: true
    },
    {
      title: "Community Leader",
      description: "Contributed to network governance",
      icon: Users,
      earned: true
    },
    {
      title: "Security Expert",
      description: "Identified and reported vulnerabilities",
      icon: Shield,
      earned: false
    }
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Neura Roles</h1>
          <p className="text-muted-foreground">Network Roles and Permissions</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Available Roles</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {roles.map((role, index) => (
                <div key={index} className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <role.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{role.name}</p>
                          <Badge variant={role.status === "Active" ? "default" : "secondary"}>
                            {role.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Level: {role.level}</p>
                      </div>
                    </div>
                    <Button
                      variant={role.status === "Active" ? "outline" : "default"}
                      disabled={role.status === "Locked"}
                    >
                      {role.status === "Active" ? "Manage" : "Apply"}
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{role.progress}%</span>
                    </div>
                    <Progress value={role.progress} />
                  </div>
                  <div className="pl-4 border-l-2 border-border">
                    <p className="text-sm font-medium mb-2">Requirements:</p>
                    <ul className="space-y-1">
                      {role.requirements.map((req, i) => (
                        <li key={i} className="text-sm text-muted-foreground">
                          • {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {index < roles.length - 1 && <div className="h-px bg-border" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Your Achievements</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    achievement.earned
                      ? "bg-primary/5 border-primary/20"
                      : "bg-muted border-border"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <achievement.icon
                      className={`h-5 w-5 ${
                        achievement.earned ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <p className="font-medium">{achievement.title}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
