import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Server, Cpu, HardDrive, Activity, Network, Clock, AlertCircle } from "lucide-react";

export default function NeuraNode() {
  // Placeholder data - in a real app, this would come from an API
  const nodeStats = {
    status: "Online",
    uptime: "99.98%",
    lastSync: "2 minutes ago",
    version: "v1.2.3",
    peers: 128,
    diskUsage: 75,
    cpuUsage: 45,
    memoryUsage: 60,
    bandwidth: "1.2 GB/s"
  };

  const recentEvents = [
    {
      type: "info",
      message: "Successfully validated block #1234567",
      time: "2 minutes ago"
    },
    {
      type: "warning",
      message: "High network latency detected",
      time: "15 minutes ago"
    },
    {
      type: "info",
      message: "New peer connection established",
      time: "1 hour ago"
    }
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Neura Node</h1>
          <p className="text-muted-foreground">Node Management and Monitoring</p>
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Server className="h-4 w-4" />
          Update Node
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-2xl font-bold text-green-500">{nodeStats.status}</p>
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
                <p className="text-sm text-muted-foreground">Connected Peers</p>
                <p className="text-2xl font-bold">{nodeStats.peers}</p>
              </div>
              <div className="bg-blue-500/10 p-3 rounded-full">
                <Network className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Uptime</p>
                <p className="text-2xl font-bold">{nodeStats.uptime}</p>
              </div>
              <div className="bg-purple-500/10 p-3 rounded-full">
                <Clock className="h-6 w-6 text-purple-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Version</p>
                <p className="text-2xl font-bold">{nodeStats.version}</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Server className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">System Resources</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>CPU Usage</span>
                  <span>{nodeStats.cpuUsage}%</span>
                </div>
                <Progress value={nodeStats.cpuUsage} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Memory Usage</span>
                  <span>{nodeStats.memoryUsage}%</span>
                </div>
                <Progress value={nodeStats.memoryUsage} />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Disk Usage</span>
                  <span>{nodeStats.diskUsage}%</span>
                </div>
                <Progress value={nodeStats.diskUsage} />
              </div>
              <div className="pt-2 flex items-center justify-between text-sm">
                <span>Network Bandwidth</span>
                <span>{nodeStats.bandwidth}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Events</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-muted/50"
                >
                  <div className={`p-2 rounded-full bg-${event.type === 'warning' ? 'yellow' : 'blue'}-500/10`}>
                    <AlertCircle className={`h-4 w-4 text-${event.type === 'warning' ? 'yellow' : 'blue'}-500`} />
                  </div>
                  <div>
                    <p className="font-medium">{event.message}</p>
                    <p className="text-sm text-muted-foreground">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
