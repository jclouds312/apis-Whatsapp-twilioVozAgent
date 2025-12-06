import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Bot, 
  MessageSquareText, 
  Settings, 
  LogOut, 
  Activity,
  Bell,
  Menu,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import aiAvatar from "@assets/generated_images/futuristic_ai_agent_avatar.png";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Agent Control", href: "/agent", icon: Bot },
    { name: "Message Logs", href: "/logs", icon: MessageSquareText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const NavContent = () => (
    <div className="flex h-full flex-col gap-4 py-4">
      <div className="flex items-center gap-3 px-6 mb-6">
        <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-primary/20 shadow-[0_0_15px_-3px_hsl(var(--primary)/0.3)]">
          <img src={aiAvatar} alt="Nexus AI" className="h-full w-full object-cover" />
        </div>
        <div>
          <h1 className="font-bold text-lg tracking-tight">NEXUS</h1>
          <p className="text-xs text-muted-foreground font-mono">v2.4.0-RC</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-primary/10 text-primary shadow-[0_0_10px_-3px_hsl(var(--primary)/0.2)] border border-primary/10"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className={cn("h-4 w-4", isActive && "text-primary animate-pulse")} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 mt-auto">
        <div className="rounded-xl bg-card/50 border border-border/50 p-4 mb-4 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_hsl(160,80%,50%)]" />
            <span className="text-xs font-medium text-muted-foreground">System Operational</span>
          </div>
          <div className="mt-3 space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>CPU</span>
              <span>12%</span>
            </div>
            <div className="h-1 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 w-[12%]" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2 py-2">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium">Admin User</p>
            <p className="truncate text-xs text-muted-foreground">admin@nexus.ai</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans text-foreground selection:bg-primary/20">
      {/* Mobile Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg border border-primary/20 overflow-hidden">
             <img src={aiAvatar} alt="Nexus AI" className="h-full w-full object-cover" />
          </div>
          <span className="font-bold">NEXUS</span>
        </div>
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 border-r border-border bg-background">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex h-screen overflow-hidden pt-16 lg:pt-0">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-sidebar/50 backdrop-blur-xl z-40">
          <NavContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[url(@assets/generated_images/abstract_tech_background.png)] bg-cover bg-center bg-no-repeat bg-fixed">
          <div className="min-h-full bg-background/90 backdrop-blur-[2px]">
            <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/50 backdrop-blur-md px-6 lg:px-8">
              <div className="flex items-center gap-4">
                 {/* Breadcrumbs or Page Title could go here */}
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                </Button>
                <Button variant="outline" size="sm" className="hidden sm:flex gap-2 border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary transition-all">
                  <Activity className="h-4 w-4" />
                  <span>Live Status</span>
                </Button>
              </div>
            </header>
            <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}