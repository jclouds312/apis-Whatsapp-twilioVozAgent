import React, { useState, useEffect, useRef } from "react";
import { 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Send, 
  Play, 
  Pause, 
  RotateCcw, 
  Save, 
  Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface Message {
  id: number;
  role: "user" | "agent" | "system";
  text: string;
  timestamp: string;
}

export default function AgentControl() {
  const [isRecording, setIsRecording] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "system", text: "Agent initialized. Model: GPT-4o-Audio. Ready for interaction.", timestamp: "10:23:01" },
    { id: 2, role: "agent", text: "Hello! This is Nexus Support. How can I assist you today?", timestamp: "10:23:02" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const newUserMsg: Message = {
      id: Date.now(),
      role: "user",
      text: inputValue,
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");

    // Mock agent response
    setTimeout(() => {
      const agentMsg: Message = {
        id: Date.now() + 1,
        role: "agent",
        text: "I understand. I can help you check the status of that order immediately. One moment please...",
        timestamp: new Date().toLocaleTimeString(),
      };
      setMessages(prev => [...prev, agentMsg]);
    }, 1500);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-6">
      {/* Left Column: Live Interaction */}
      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <Card className="flex-1 flex flex-col glass-panel overflow-hidden border-primary/20 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.1)]">
          <CardHeader className="py-4 border-b border-border/50 bg-muted/20 flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("h-3 w-3 rounded-full animate-pulse", isCallActive ? "bg-red-500" : "bg-emerald-500")} />
              <div>
                <CardTitle className="text-base">Live Session #9942</CardTitle>
                <CardDescription className="text-xs">Connected via +1 (555) 019-2834</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-mono">00:04:32</Badge>
              <Button 
                size="sm" 
                variant={isCallActive ? "destructive" : "default"}
                className={cn("transition-all", !isCallActive && "bg-emerald-600 hover:bg-emerald-700")}
                onClick={() => setIsCallActive(!isCallActive)}
              >
                {isCallActive ? <PhoneOff className="h-4 w-4 mr-2" /> : <Phone className="h-4 w-4 mr-2" />}
                {isCallActive ? "End Call" : "Start Call"}
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={cn(
                  "flex w-full",
                  msg.role === "user" ? "justify-end" : "justify-start"
                )}
              >
                <div className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-3 text-sm shadow-sm",
                  msg.role === "user" 
                    ? "bg-primary text-primary-foreground rounded-tr-sm" 
                    : msg.role === "system"
                    ? "bg-muted/50 text-muted-foreground text-xs font-mono border border-dashed border-border w-full text-center py-1"
                    : "bg-card border border-border rounded-tl-sm"
                )}>
                  {msg.role !== "system" && <p>{msg.text}</p>}
                  {msg.role === "system" && <span>{msg.text}</span>}
                  {msg.role !== "system" && (
                    <p className="text-[10px] mt-1 opacity-70 text-right">{msg.timestamp}</p>
                  )}
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </CardContent>

          <CardFooter className="p-4 bg-background border-t border-border/50">
            <div className="flex gap-2 w-full">
              <Button 
                variant="outline" 
                size="icon"
                className={cn("shrink-0 transition-colors", isRecording && "text-red-500 border-red-500/50 bg-red-500/10")}
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Input 
                placeholder="Type a message to inject into the conversation..." 
                className="flex-1 bg-background/50"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <Button size="icon" onClick={handleSend}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Right Column: Controls & Analytics */}
      <div className="w-full lg:w-96 flex flex-col gap-4 min-h-0 overflow-y-auto">
        <Card className="glass-panel">
          <CardHeader className="py-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              Agent Logic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Confidence Threshold</Label>
                <span className="text-xs font-mono text-muted-foreground">0.85</span>
              </div>
              <Slider defaultValue={[85]} max={100} step={1} className="w-full" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label className="text-xs">Voice Speed</Label>
                <span className="text-xs font-mono text-muted-foreground">1.0x</span>
              </div>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-xs">Interruptible</Label>
              <Switch defaultChecked />
            </div>
            
             <div className="flex items-center justify-between">
              <Label className="text-xs">Sentiment Analysis</Label>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card className="glass-panel flex-1 flex flex-col">
          <CardHeader className="py-3">
             <CardTitle className="text-sm">Live Analysis</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-4">
            <div className="rounded-lg bg-muted/30 p-3 space-y-2 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Sentiment</p>
              <div className="flex items-center gap-2">
                <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
                  <div className="h-full w-[75%] bg-emerald-500" />
                </div>
                <span className="text-xs font-mono">Positive</span>
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-3 space-y-2 border border-border/50">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Intent Detected</p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="text-[10px]">Check Order</Badge>
                <Badge variant="secondary" className="text-[10px]">Support</Badge>
              </div>
            </div>

            <div className="rounded-lg bg-muted/30 p-3 space-y-2 border border-border/50 flex-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Debug Log</p>
              <ScrollArea className="h-[150px] w-full rounded border border-border/20 bg-black/20">
                <div className="p-2 font-mono text-[10px] space-y-1 text-muted-foreground">
                  <p><span className="text-blue-400">[INFO]</span> Audio stream connected</p>
                  <p><span className="text-blue-400">[INFO]</span> VAD detected speech</p>
                  <p><span className="text-yellow-400">[WARN]</span> Latency spike: 450ms</p>
                  <p><span className="text-blue-400">[INFO]</span> STT Result: "check status"</p>
                  <p><span className="text-green-400">[EXEC]</span> Function: getOrder(id)</p>
                  <p><span className="text-blue-400">[INFO]</span> TTS generating response...</p>
                </div>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}