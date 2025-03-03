import { Link, useLocation } from "wouter";
import { Home, Brain, Users, Activity } from "lucide-react";

export default function Navbar() {
  const [location] = useLocation();

  const links = [
    { href: "/", icon: Home, label: "Dashboard" },
    { href: "/mining-game", icon: Activity, label: "Mining" },
    { href: "/social", icon: Users, label: "Social" },
    { href: "/ai-chat", icon: Brain, label: "AI Support" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex justify-around py-3">
          {links.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <div
                className={`flex flex-col items-center space-y-1 cursor-pointer ${
                  location === href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-6 w-6" />
                <span className="text-xs">{label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}