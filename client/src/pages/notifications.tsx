import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Bell, MessageSquare, Mail, Globe } from "lucide-react";

export default function Notifications() {
  const notificationSettings = [
    {
      title: "Push Notifications",
      description: "Receive notifications on your device",
      icon: Bell,
      categories: [
        { name: "Transaction Updates", enabled: true },
        { name: "Security Alerts", enabled: true },
        { name: "Mining Rewards", enabled: true },
        { name: "Network Status", enabled: false }
      ]
    },
    {
      title: "Email Notifications",
      description: "Receive updates via email",
      icon: Mail,
      categories: [
        { name: "Weekly Summary", enabled: true },
        { name: "Account Activity", enabled: true },
        { name: "Newsletter", enabled: false },
        { name: "Marketing Updates", enabled: false }
      ]
    },
    {
      title: "Platform Updates",
      description: "Stay informed about Neura Network",
      icon: Globe,
      categories: [
        { name: "Network Updates", enabled: true },
        { name: "New Features", enabled: true },
        { name: "Maintenance Alerts", enabled: true },
        { name: "Community Events", enabled: false }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-16 md:pb-0">
      <div>
        <h1 className="text-3xl font-bold">Notifications</h1>
        <p className="text-muted-foreground">Manage your notification preferences</p>
      </div>

      <div className="grid gap-6">
        {notificationSettings.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center gap-2">
                <section.icon className="h-5 w-5 text-primary" />
                <div>
                  <h2 className="text-xl font-semibold">{section.title}</h2>
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {section.categories.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="flex items-center justify-between">
                    <span>{category.name}</span>
                    <Switch defaultChecked={category.enabled} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
