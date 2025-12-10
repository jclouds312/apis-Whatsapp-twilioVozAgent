import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Bot, Mic, Play, Pause, Settings2, Volume2, Sparkles,
  MessageSquare, BarChart3, Zap, Globe, Phone
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const agents = [
  { id: "1", name: "Sales Assistant", voice: "Rachel", language: "English (US)", model: "GPT-4o", status: "Active" },
  { id: "2", name: "Support Bot", voice: "Josh", language: "Spanish (ES)", model: "GPT-3.5", status: "Inactive" },
  { id: "3", name: "Booking Agent", voice: "Emily", language: "French (FR)", model: "GPT-4", status: "Active" },
];

export default function Retell() {
  const [selectedAgent, setSelectedAgent] = useState(agents[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Agents List */}
      <div className="col-span-1 space-y-6">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Agents
            </CardTitle>
            <CardDescription>Manage your voice agents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
              <Sparkles className="h-4 w-4 mr-2" />
              Create New Agent
            </Button>
            <div className="space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3 rounded-lg border transition-all cursor-pointer ${
                    selectedAgent.id === agent.id
                      ? "bg-primary/10 border-primary/30 shadow-[0_0_10px_rgba(var(--primary),0.1)]"
                      : "bg-background/50 border-border hover:bg-muted/50"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{agent.name}</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {agent.voice} • {agent.language}
                      </p>
                    </div>
                    <Badge variant={agent.status === "Active" ? "default" : "secondary"} className="text-[10px]">
                      {agent.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
                <CardTitle>Usage Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Minutes</span>
                        <span className="font-medium">2,450 / 5,000</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[49%] bg-gradient-to-r from-blue-500 to-purple-500" />
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Concurrent Calls</span>
                        <span className="font-medium">12 / 20</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full w-[60%] bg-gradient-to-r from-green-500 to-emerald-500" />
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      {/* Agent Configuration */}
      <div className="col-span-1 lg:col-span-2">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10 h-full">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{selectedAgent.name}</CardTitle>
              <CardDescription>Configuration & Settings</CardDescription>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Advanced
                </Button>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Deploy
                </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* LLM Configuration */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">LLM Configuration</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Model</Label>
                  <Select defaultValue={selectedAgent.model}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GPT-4o">GPT-4o</SelectItem>
                      <SelectItem value="GPT-4">GPT-4 Turbo</SelectItem>
                      <SelectItem value="GPT-3.5">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="Claude-3">Claude 3 Opus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Temperature</Label>
                  <div className="flex items-center gap-4">
                    <Slider defaultValue={[0.7]} max={1} step={0.1} className="flex-1" />
                    <span className="w-8 text-sm font-mono text-center">0.7</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>System Prompt</Label>
                <textarea
                  className="flex min-h-[120px] w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 font-mono"
                  defaultValue="You are a helpful sales assistant for Acme Corp. Your goal is to qualify leads and schedule demos. Be professional, concise, and friendly."
                />
              </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Voice Configuration */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Voice Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Voice ID</Label>
                  <Select defaultValue="eleven_labs_rachel">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="eleven_labs_rachel">Rachel (American, Calm)</SelectItem>
                      <SelectItem value="eleven_labs_josh">Josh (American, Deep)</SelectItem>
                      <SelectItem value="eleven_labs_emily">Emily (Australian, Energetic)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Preview Voice</Label>
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setIsPlaying(!isPlaying)}
                  >
                    {isPlaying ? (
                        <Pause className="h-4 w-4 mr-2 text-red-500" />
                    ) : (
                        <Play className="h-4 w-4 mr-2 text-green-500" />
                    )}
                    {isPlaying ? "Stop Preview" : "Play Sample"}
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Speed</Label>
                    <Slider defaultValue={[1]} min={0.5} max={2} step={0.1} />
                 </div>
                 <div className="space-y-2">
                    <Label>Stability</Label>
                    <Slider defaultValue={[0.5]} max={1} step={0.1} />
                 </div>
              </div>
            </div>

             <div className="h-px bg-border/50" />

             {/* Integration */}
             <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Integrations</h3>
                <div className="flex items-center justify-between p-4 border border-primary/10 rounded-lg bg-background/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <Phone className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                            <p className="font-medium">Twilio Phone Number</p>
                            <p className="text-xs text-muted-foreground">Connect this agent to a phone number</p>
                        </div>
                    </div>
                    <Switch />
                </div>
                <div className="flex items-center justify-between p-4 border border-primary/10 rounded-lg bg-background/30">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Globe className="h-5 w-5 text-purple-500" />
                        </div>
                        <div>
                            <p className="font-medium">Web Widget</p>
                            <p className="text-xs text-muted-foreground">Enable web calling for this agent</p>
                        </div>
                    </div>
                    <Switch defaultChecked />
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
