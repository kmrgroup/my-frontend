import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Menu, X, User, Settings, LogOut, Network, Wrench, Shield, 
  Server, HelpCircle, FileText, Users, Bell, Key, Wallet,
  Clock, Award, UserPlus, Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type MenuItem = {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description?: string;
  iconColor?: string;
};

type MenuGroup = {
  title: string;
  items: MenuItem[];
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    sessionStorage.clear();
    toast({
      title: "Logged out successfully",
      duration: 2000,
    });
    window.location.href = "/welcome";
  };

  const menuGroups: MenuGroup[] = [
    {
      title: "Navigation",
      items: [
        { 
          href: "/", 
          icon: Home, 
          label: "Home",
          description: "Return to dashboard",
          iconColor: "text-primary"
        },
      ]
    },
    {
      title: "Account",
      items: [
        { 
          href: "/profile", 
          icon: User, 
          label: "My Profile",
          description: "View and edit your profile information",
          iconColor: "text-blue-500"
        },
        { 
          href: "/notifications", 
          icon: Bell, 
          label: "Notifications",
          description: "Manage your notification preferences",
          iconColor: "text-yellow-500"
        },
        { 
          href: "/security", 
          icon: Key, 
          label: "Security",
          description: "Update security settings and 2FA",
          iconColor: "text-green-500"
        },
        { 
          href: "/wallet", 
          icon: Wallet, 
          label: "Wallet",
          description: "Manage your NeuraCoin wallet",
          iconColor: "text-purple-500"
        }
      ]
    },
    {
      title: "Activity",
      items: [
        { 
          href: "/history", 
          icon: Clock, 
          label: "Transaction History",
          description: "View your past transactions",
          iconColor: "text-orange-500"
        },
        { 
          href: "/achievements", 
          icon: Award, 
          label: "Achievements",
          description: "Track your network milestones",
          iconColor: "text-pink-500"
        },
        { 
          href: "/referrals", 
          icon: UserPlus, 
          label: "Referrals",
          description: "Invite friends and earn rewards",
          iconColor: "text-cyan-500"
        }
      ]
    },
    {
      title: "Platform",
      items: [
        { 
          href: "/mainnet", 
          icon: Network, 
          label: "Mainnet",
          description: "Access the Neura Network mainnet",
          iconColor: "text-blue-500"
        },
        { 
          href: "/utilities", 
          icon: Wrench, 
          label: "Neura Utilities",
          description: "Tools and utilities for the network",
          iconColor: "text-purple-500"
        },
        { 
          href: "/roles", 
          icon: Shield, 
          label: "Neura Roles",
          description: "Manage network roles and permissions",
          iconColor: "text-green-500"
        },
        { 
          href: "/node", 
          icon: Server, 
          label: "Neura Node",
          description: "Node management and status",
          iconColor: "text-orange-500"
        }
      ]
    },
    {
      title: "Resources",
      items: [
        { 
          href: "/faq", 
          icon: HelpCircle, 
          label: "FAQ",
          description: "Frequently asked questions",
          iconColor: "text-cyan-500"
        },
        { 
          href: "/whitepaper", 
          icon: FileText, 
          label: "Whitepaper",
          description: "Technical documentation",
          iconColor: "text-yellow-500"
        },
        { 
          href: "/core-team", 
          icon: Users, 
          label: "Neura Core Team",
          description: "Meet the team behind Neura",
          iconColor: "text-pink-500"
        }
      ]
    }
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <aside
        className={`fixed top-0 left-0 h-full bg-background border-r border-border w-64 transform transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 z-40 overflow-y-auto`}
      >
        <div className="flex flex-col space-y-6 p-4 pt-16">
          {menuGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-sm font-medium text-muted-foreground mb-3 px-4">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex flex-col gap-1 px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                        location === item.href
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className={`h-5 w-5 ${item.iconColor || ""}`} />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      {item.description && (
                        <span className="text-xs text-muted-foreground pl-7">
                          {item.description}
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              {groupIndex < menuGroups.length - 1 && (
                <div className="h-px bg-border my-4" />
              )}
            </div>
          ))}

          <div className="h-px bg-border" />

          <Button 
            variant="ghost" 
            className="flex items-center gap-2 px-4 py-2 w-full justify-start hover:bg-muted text-red-500 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}