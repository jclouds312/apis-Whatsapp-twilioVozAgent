import { useState } from "react";
import { Link } from "wouter";
import {
  LayoutDashboard,
  MessageSquare,
  Phone,
  Users,
  Settings,
  Key,
  Zap,
  BarChart3,
  Cloud,
  ScrollText,
  Workflow,
  Database,
  GitBranch,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", section: "main" },
  { icon: MessageSquare, label: "WhatsApp", href: "/whatsapp", section: "messaging", color: "bg-green-500/10 text-green-500" },
  { icon: Phone, label: "Twilio Voice", href: "/twilio", section: "communication", color: "bg-red-500/10 text-red-500" },
  { icon: Users, label: "CRM", href: "/crm", section: "business", color: "bg-blue-500/10 text-blue-500" },
  { icon: Key, label: "API Keys", href: "/api-keys", section: "security", color: "bg-amber-500/10 text-amber-500" },
  { icon: Database, label: "API Console", href: "/api-console", section: "development", color: "bg-indigo-500/10 text-indigo-500" },
  { icon: ScrollText, label: "Logs", href: "/logs", section: "monitoring", color: "bg-slate-500/10 text-slate-500" },
  { icon: Workflow, label: "Workflows", href: "/workflow-suggester", section: "automation", color: "bg-orange-500/10 text-orange-500" },
  { icon: Cloud, label: "Deployment", href: "/deployment", section: "infrastructure", color: "bg-cyan-500/10 text-cyan-500" },
  { icon: BarChart3, label: "Admin", href: "/admin", section: "admin", color: "bg-purple-500/10 text-purple-500" },
  { icon: Settings, label: "Settings", href: "/settings", section: "config", color: "bg-gray-500/10 text-gray-500" },
];

export default function Sidebar() {
  const [open, setOpen] = useState(true);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed bottom-4 left-4 z-50 md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 border-r border-border/40 bg-background/50 backdrop-blur-xl transition-all duration-300 z-40 md:static md:h-[calc(100vh-4rem)]",
          !open && "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="space-y-4 overflow-y-auto p-4 h-full">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Navigation</p>
            {MENU_ITEMS.slice(0, 5).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 hover:bg-primary/10"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Tools</p>
            {MENU_ITEMS.slice(5, 9).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 hover:bg-primary/10"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">System</p>
            {MENU_ITEMS.slice(9).map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 hover:bg-primary/10"
                  onClick={() => setOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
