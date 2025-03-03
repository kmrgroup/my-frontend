import { Link, useLocation } from "wouter";
import {
  Gift,
  LayoutDashboard,
  Settings,
  Users,
  Bell,
  Shield,
  Wallet,
  History,
  Trophy,
  Share2,
  Network,
  Wrench,
  UserCheck,
  Server,
  MessageSquare,
  Users2,
  HelpCircle,
  FileText,
  UserCircle,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export function SidebarNav() {
  const [location] = useLocation();

  return (
    <nav className="grid items-start gap-2">
      <Link
        to="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start",
          location === "/" && "bg-muted hover:bg-muted"
        )}
      >
        <LayoutDashboard className="mr-2 h-4 w-4" />
        Dashboard
      </Link>

      {/* ... other navigation items ... */}

      <Link
        to="/referrals"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start",
          location === "/referrals" && "bg-muted hover:bg-muted"
        )}
      >
        <Share2 className="mr-2 h-4 w-4" />
        Referrals
      </Link>

      <Link
        to="/airdrop"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "justify-start",
          location === "/airdrop" && "bg-muted hover:bg-muted"
        )}
      >
        <Gift className="mr-2 h-4 w-4" />
        Airdrop
      </Link>

      {/* ... rest of the navigation items ... */}
    </nav>
  );
}
