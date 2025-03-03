import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Activity, Globe, Cpu, Users, ArrowUpRight } from "lucide-react";

export default function Mainnet() {
  // Placeholder data - in a real app, this would come from an API
  const networkStats = {
    activeNodes: 1234,
    totalStaked: "1,234,567 NC",
    networkHealth: "98.5%",
    activeUsers: "45.2K"
  };

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold">Neura Mainnet</h1>
        <p className="text-muted-foreground">Network Status and Statistics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Nodes</p>
                <p className="text-2xl font-bold">{networkStats.activeNodes}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Cpu className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Total Staked</p>
                <p className="text-2xl font-bold">{networkStats.totalStaked}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Globe className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Network Health</p>
                <p className="text-2xl font-bold">{networkStats.networkHealth}</p>
              </div>
              <div className="bg-green-500/10 p-3 rounded-full">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-2xl font-bold">{networkStats.activeUsers}</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-full">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Network Activity</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <ArrowUpRight className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Transaction #{Math.floor(Math.random() * 1000000)}</p>
                    <p className="text-sm text-muted-foreground">
                      {Math.floor(Math.random() * 100)} NC transferred • {Math.floor(Math.random() * 60)} seconds ago
                    </p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  Success
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}