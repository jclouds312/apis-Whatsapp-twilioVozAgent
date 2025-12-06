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
  Zap,
  Sparkles,
  Globe,
  Server,
  Bus
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/", badge: "v2.4" },
    { icon: Zap, label: "Integrations Hub", path: "/integrations-hub", badge: "New" },
    { icon: MessageSquare, label: "WhatsApp Manager", path: "/whatsapp", badge: "API" },
    { icon: Phone, label: "Twilio Voice", path: "/twilio", badge: "Voice" },
    { icon: Server, label: "Twilio IaC", path: "/twilio-infrastructure", badge: "Terraform" },
    { icon: ShieldCheck, label: "Verify", path: "/verify", badge: "Auth" },
    { icon: Bot, label: "AI Agents", path: "/retell", badge: "Beta" },
    { icon: Users, label: "CRM", path: "/crm" },
    { icon: Globe, label: "Facebook SDK", path: "/facebook-integration", badge: "v21" },
    { icon: Key, label: "API Key Manager", path: "/api-key-manager", badge: "Premium" },
    { icon: Terminal, label: "API Console", path: "/api-console" },
    { icon: Zap, label: "Twilio SMS", path: "/twilio-voice" },
    { icon: Terminal, label: "Widgets", path: "/embed-widgets" },
    { icon: Users, label: "CRM Pro", path: "/crm-integration" },
    { icon: Sparkles, label: "Workflows", path: "/workflow-suggester" },
    { icon: ScrollText, label: "System Logs", path: "/logs" },
    { icon: Settings, label: "Settings", path: "/settings" },
    { icon: Bus, label: "SITP Transit", path: "/sitp-transit" },
    {
      title: 'WhatsApp',
      url: '/whatsapp',
      icon: MessageSquare,
    },
    {
      title: 'WhatsApp Manager',
      url: '/whatsapp-manager',
      icon: MessageSquare,
    },
    {
      title: 'VoIP Console',
      url: '/voip-console',
      icon: Phone,
    },
  ];

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-72 border-r border-gradient-to-b from-primary/20 via-purple-500/10 to-pink-500/10 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-sidebar-foreground h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3 bg-gradient-to-r from-primary/10 to-purple-500/10 border-b border-primary/20">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
            <Cpu className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-lg tracking-tight bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent">
              NEXUSCORE
            </div>
            <div className="text-xs text-muted-foreground">Enterprise v2.4</div>
          </div>
        </div>

        <Separator className="opacity-10" />

        <nav className="flex-1 py-6 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item: any) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div
                  className={`
                    flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer group
                    ${isActive
                      ? "bg-gradient-to-r from-primary/30 via-purple-500/20 to-pink-500/10 text-primary shadow-[0_0_10px_rgba(59,130,246,0.3)] border border-primary/40"
                      : "text-muted-foreground hover:bg-muted/40 hover:text-foreground hover:shadow-md"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={`h-4 w-4 transition-all ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                    {item.label}
                  </div>
                  {item.badge && (
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold transition-all ${
                      isActive
                        ? "bg-primary/40 text-primary"
                        : "bg-muted/50 text-muted-foreground group-hover:bg-muted"
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto space-y-3 border-t border-primary/20">
          <div className="rounded-lg bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-teal-500/10 p-3 border border-green-500/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{animationDelay: "0.2s"}} />
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" style={{animationDelay: "0.4s"}} />
              </div>
              <span className="text-xs font-bold text-green-400">SYSTEM ONLINE</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">API Latency</span>
                <span className="text-green-400 font-mono">45ms</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Uptime</span>
                <span className="text-green-400 font-mono">99.99%</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all">
            <LogOut className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/80 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-sidebar border-r border-border transform transition-transform duration-300 ease-in-out md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <span className="font-bold text-xl">NEXUS</span>
          <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="px-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
              <div className={`flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium ${location === item.path ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}>
                <item.icon className="h-5 w-5" />
                {item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
        {/* Header */}
        <header className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <h1 className="font-semibold text-lg hidden md:block">
                {navItems.find(i => i.path === location)?.label || "Dashboard"}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-medium text-emerald-500">Operational</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
              NC
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8 animate-in-fade">
          {children}
        </div>
      </main>
    </div>
  );
}