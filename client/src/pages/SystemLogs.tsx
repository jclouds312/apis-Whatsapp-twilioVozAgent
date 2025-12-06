import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Terminal, Search, Filter, Download, Pause, Play, Trash2,
  AlertCircle, Info, CheckCircle2, AlertTriangle
} from "lucide-react";

type LogLevel = "info" | "warn" | "error" | "success";

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  details?: string;
}

const generateLog = (): LogEntry => {
  const services = ["WhatsApp", "Twilio", "Facebook", "System", "CRM"];
  const levels: LogLevel[] = ["info", "info", "info", "success", "warn", "error"];
  const messages = [
    "Webhook event received",
    "Message delivered successfully",
    "Connection established",
    "API rate limit warning",
    "Failed to sync contact",
    "Authentication successful",
    "Voice call initiated",
    "Agent status updated"
  ];

  const level = levels[Math.floor(Math.random() * levels.length)];
  
  return {
    id: Math.random().toString(36).substring(7),
    timestamp: new Date().toLocaleTimeString(),
    level,
    service: services[Math.floor(Math.random() * services.length)],
    message: messages[Math.floor(Math.random() * messages.length)],
    details: Math.random() > 0.7 ? "Request ID: req_" + Math.random().toString(36).substring(7) : undefined
  };
};

export default function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: "1", timestamp: "10:42:15 AM", level: "success", service: "System", message: "Dashboard initialized successfully" },
    { id: "2", timestamp: "10:42:18 AM", level: "info", service: "WhatsApp", message: "Connected to WhatsApp Business API v18.0" },
    { id: "3", timestamp: "10:42:20 AM", level: "info", service: "Twilio", message: "Voice capabilities initialized" },
  ]);
  const [isPaused, setIsPaused] = useState(false);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setLogs(prev => [generateLog(), ...prev].slice(0, 100));
    }, 3000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const getLevelColor = (level: LogLevel) => {
    switch (level) {
      case "info": return "text-blue-400";
      case "success": return "text-green-400";
      case "warn": return "text-amber-400";
      case "error": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level) {
      case "info": return <Info className="h-3 w-3" />;
      case "success": return <CheckCircle2 className="h-3 w-3" />;
      case "warn": return <AlertTriangle className="h-3 w-3" />;
      case "error": return <AlertCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Terminal className="h-6 w-6 text-primary" />
            System Logs
          </h1>
          <p className="text-muted-foreground">Real-time system events and debugging</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setIsPaused(!isPaused)}>
            {isPaused ? <Play className="h-4 w-4 mr-2" /> : <Pause className="h-4 w-4 mr-2" />}
            {isPaused ? "Resume" : "Pause Live Stream"}
          </Button>
          <Button variant="outline" size="sm" onClick={() => setLogs([])}>
            <Trash2 className="h-4 w-4 mr-2" />
            Clear
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Logs
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col bg-slate-950 border-primary/20 overflow-hidden">
        <div className="p-2 bg-slate-900/50 border-b border-primary/10 flex items-center gap-2">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2 top-2.5 h-3 w-3 text-muted-foreground" />
            <Input
              placeholder="Filter logs..."
              className="pl-8 h-8 text-xs font-mono bg-slate-900 border-primary/10"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
          <div className="flex gap-2 ml-auto">
            {["info", "warn", "error"].map(l => (
                <Badge key={l} variant="outline" className="text-[10px] cursor-pointer hover:bg-muted/20 uppercase">
                    {l}
                </Badge>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 p-4 font-mono text-xs">
          <div className="space-y-1">
            {logs
              .filter(log => 
                log.message.toLowerCase().includes(filter.toLowerCase()) || 
                log.service.toLowerCase().includes(filter.toLowerCase())
              )
              .map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-1 hover:bg-white/5 rounded group">
                <span className="text-slate-500 shrink-0 w-20">{log.timestamp}</span>
                <span className={`shrink-0 w-20 font-bold ${getLevelColor(log.level)} flex items-center gap-1.5`}>
                  {getLevelIcon(log.level)}
                  {log.level.toUpperCase()}
                </span>
                <span className="shrink-0 w-24 text-purple-400">[{log.service}]</span>
                <span className="text-slate-300 flex-1">{log.message}</span>
                {log.details && (
                    <span className="text-slate-600 shrink-0 group-hover:text-slate-400 transition-colors">
                        {log.details}
                    </span>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
