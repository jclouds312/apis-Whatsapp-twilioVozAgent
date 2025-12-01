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
  Globe
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: "Overview", path: "/" },
    { icon: MessageSquare, label: "WhatsApp Manager", path: "/whatsapp" },
    { icon: Phone, label: "Twilio Voice", path: "/twilio" },
    { icon: ShieldCheck, label: "Twilio Verify", path: "/verify" },
    { icon: Bot, label: "Retell AI Agents", path: "/retell" },
    { icon: Users, label: "CRM", path: "/crm" },
    { icon: Zap, label: "Function Connect", path: "/function-connect" },
    { icon: Sparkles, label: "Workflow Suggester", path: "/workflow-suggester" },
    { icon: Key, label: "API Key Manager", path: "/api-key-manager" },
    { icon: Zap, label: "Twilio Voice+SMS", path: "/twilio-voice" },
    { icon: Users, label: "CRM Integration", path: "/crm-integration" },
    { icon: Terminal, label: "Embed Widgets", path: "/embed-widgets" },
    { icon: Terminal, label: "API Console", path: "/api-console" },
    { icon: ScrollText, label: "System Logs", path: "/logs" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <div className="min-h-screen bg-background flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/40 bg-sidebar text-sidebar-foreground h-screen sticky top-0">
        <div className="p-6 flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <Cpu className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">NEXUS<span className="text-primary">CORE</span></span>
        </div>
        
        <Separator className="opacity-10" />

        <nav className="flex-1 py-6 px-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path}>
                <div 
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer group
                    ${isActive 
                      ? "bg-primary/10 text-primary shadow-[0_0_0_1px_rgba(59,130,246,0.1)]" 
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    }
                  `}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="rounded-lg bg-muted/30 p-4 border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <CloudLightning className="h-4 w-4 text-green-500" />
              <span className="text-xs font-semibold text-muted-foreground">SYSTEM STATUS</span>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">API Gateway</span>
                <span className="text-green-500">Operational</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Webhooks</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" className="w-full mt-4 justify-start text-muted-foreground hover:text-destructive">
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
