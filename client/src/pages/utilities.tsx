import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, Calculator, Search, Webhook, Shield, Terminal } from "lucide-react";

export default function NeuraUtilities() {
  const tools = [
    {
      name: "Network Calculator",
      icon: Calculator,
      description: "Calculate mining rewards, staking returns, and network metrics",
      status: "Available"
    },
    {
      name: "Block Explorer",
      icon: Search,
      description: "Search and analyze blockchain transactions and smart contracts",
      status: "Available"
    },
    {
      name: "API Gateway",
      icon: Webhook,
      description: "Access Neura Network's API endpoints and documentation",
      status: "Beta"
    },
    {
      name: "Security Scanner",
      icon: Shield,
      description: "Scan smart contracts for vulnerabilities and best practices",
      status: "Coming Soon"
    },
    {
      name: "CLI Tools",
      icon: Terminal,
      description: "Command-line interface for network interaction",
      status: "Available"
    }
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Neura Utilities</h1>
          <p className="text-muted-foreground">Tools and resources for the Neura Network</p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Available Tools</h2>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {tools.map((tool, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                      <tool.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{tool.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {tool.description}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant={tool.status === "Available" ? "default" : "outline"}
                      disabled={tool.status !== "Available"}
                    >
                      {tool.status}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="calculator">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                <TabsTrigger value="calculator">Calculator</TabsTrigger>
                <TabsTrigger value="explorer">Explorer</TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>
              <TabsContent value="calculator">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Amount (NC)</label>
                    <Input type="number" placeholder="Enter amount" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Duration (days)</label>
                    <Input type="number" placeholder="Enter duration" />
                  </div>
                  <Button className="w-full">Calculate Returns</Button>
                </div>
              </TabsContent>
              <TabsContent value="explorer">
                <div className="space-y-4">
                  <Input placeholder="Search by transaction hash, address, or block" />
                  <Button className="w-full">Search</Button>
                </div>
              </TabsContent>
              <TabsContent value="api">
                <div className="space-y-4">
                  <Input placeholder="Enter API endpoint" />
                  <Button className="w-full">Test Endpoint</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
