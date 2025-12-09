import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  MessageSquare,
  Phone,
  Settings,
  Activity,
  Bot,
  Menu,
  X,
  LogOut,
  Cpu,
  CloudLightning,
  ShieldCheck,
  Key,
  Terminal,
  ScrollText,
  Users,
  User,
  Zap,
  Sparkles,
  Globe,
  Rocket,
  Megaphone,
  BarChart,
  GitBranch,
  Database,
  Lock,
  Search,
  Bell
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navGroups = [
    {
      title: "Core Operations",
      items: [
        { icon: LayoutDashboard, label: "Overview", path: "/", badge: "v4.0" },
        { icon: MessageSquare, label: "WhatsApp Marketing", path: "/whatsapp", badge: "Pro" },
        { icon: Phone, label: "Twilio Voice Center", path: "/twilio-voice" },
        { icon: Bot, label: "AI Agents (Retell)", path: "/retell", badge: "Beta" },
      ]
    },
    {
      title: "Marketing & CRM",
      items: [
        { icon: Users, label: "CRM", path: "/crm" },
        { icon: Megaphone, label: "Campaigns", path: "/crm-integration" },
        { icon: Globe, label: "Facebook SDK", path: "/facebook-integration" },
      ]
    },
    {
      title: "Developer Tools",
      items: [
        { icon: Rocket, label: "API Generator", path: "/api-key-generator", badge: "New" },
        { icon: Key, label: "API Keys", path: "/api-key-manager" },
        { icon: Terminal, label: "API Console", path: "/api-console" },
        { icon: GitBranch, label: "Workflows", path: "/workflow-suggester" },
      ]
    },
    {
      title: "System",
      items: [
        { icon: ShieldCheck, label: "Security & Auth", path: "/verify" },
        { icon: ScrollText, label: "System Logs", path: "/logs" },
        { icon: Settings, label: "Settings", path: "/settings" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex font-sans selection:bg-primary/20 selection:text-primary">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 bg-card/30 backdrop-blur-xl border-r border-border/40 h-screen sticky top-0 overflow-hidden">
        {/* Brand */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary via-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20 ring-1 ring-white/10">
              <Cpu className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
                NEXUS
              </h1>
              <div className="text-[10px] uppercase tracking-wider font-semibold text-primary/80">Enterprise v4.0</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-6 overflow-y-auto scrollbar-hide py-4">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="px-3 text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location === item.path;
                  return (
                    <Link key={item.path} href={item.path}>
                      <div
                        className={`
                          flex items-center justify-between gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer group relative overflow-hidden
                          ${isActive
                            ? "bg-primary/10 text-primary border border-primary/20 shadow-sm"
                            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                          }
                        `}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-l-lg" />
                        )}
                        <div className="flex items-center gap-3 z-10">
                          <item.icon className={`h-4 w-4 transition-colors ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                          {item.label}
                        </div>
                        {item.badge && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold transition-all z-10 ${
                            isActive
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground"
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 mt-auto border-t border-border/40 bg-card/20 backdrop-blur-sm">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                <Avatar className="h-9 w-9 border border-border/50">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Admin User</p>
                  <p className="text-xs text-muted-foreground truncate">admin@nexus.com</p>
                </div>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 glass-panel">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
              <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
              <DropdownMenuItem><Lock className="mr-2 h-4 w-4" /> Security</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-400"><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between border-b border-border/40">
          <span className="font-bold text-xl">NEXUS</span>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="px-4 py-4 space-y-6 overflow-y-auto h-[calc(100vh-5rem)]">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-2">
               <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {group.title}
              </h3>
              {group.items.map((item) => (
                <Link key={item.path} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                  <div className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium ${location === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-background to-background">
        {/* Header */}
        <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-background/50 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            
            {/* Breadcrumb / Search */}
            <div className="hidden md:flex items-center gap-4 bg-muted/30 px-3 py-1.5 rounded-lg border border-border/40 text-sm text-muted-foreground w-64 hover:bg-muted/50 transition-colors">
              <Search className="h-4 w-4" />
              <span>Search modules...</span>
              <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background" />
            </Button>
            
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-500">System Stable</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 animate-in fade-in zoom-in-95 duration-500">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
