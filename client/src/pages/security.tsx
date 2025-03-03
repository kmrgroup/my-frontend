import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Key, Smartphone, Lock } from "lucide-react";

export default function Security() {
  const securityMethods = [
    {
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      icon: Shield,
      status: "Enabled",
      action: "Configure"
    },
    {
      title: "Password",
      description: "Change your account password",
      icon: Key,
      status: "Last changed 30 days ago",
      action: "Update"
    },
    {
      title: "Recovery Options",
      description: "Set up account recovery methods",
      icon: Smartphone,
      status: "Phone number verified",
      action: "Manage"
    },
    {
      title: "Login History",
      description: "Monitor recent account activity",
      icon: Lock,
      status: "5 active sessions",
      action: "View All"
    }
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold">Security Settings</h1>
        <p className="text-muted-foreground">Manage your account security and authentication</p>
      </div>

      <div className="grid gap-6">
        {securityMethods.map((method, index) => (
          <Card key={index}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <method.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">{method.title}</h3>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <p className="text-sm text-primary mt-1">{method.status}</p>
                  </div>
                </div>
                <Button variant="outline">{method.action}</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
