import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { 
  Bot, 
  Mic2, 
  BrainCircuit, 
  Sparkles, 
  Play, 
  Save,
  Volume2
} from "lucide-react";

export default function RetellPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Bot className="h-6 w-6 text-purple-500" />
            Retell AI Agents
          </h2>
          <p className="text-muted-foreground">Configure LLM-powered voice agents for your calls.</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create New Agent
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Sidebar List */}
        <Card className="lg:col-span-1 bg-card/50 border-border/50 h-fit">
          <CardHeader>
            <CardTitle className="text-sm uppercase text-muted-foreground">Your Agents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 cursor-pointer">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-primary">Customer Support V1</span>
                <Badge className="bg-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20 border-0">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Model: GPT-4o • Voice: Rachel</p>
            </div>
            
            <div className="p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/50 cursor-pointer transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium">Sales Outbound</span>
                <Badge variant="outline" className="text-zinc-500 border-zinc-800">Draft</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Model: Claude 3.5 • Voice: Josh</p>
            </div>
            
            <div className="p-3 rounded-lg hover:bg-muted/50 border border-transparent hover:border-border/50 cursor-pointer transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium">Appointment Booking</span>
                <Badge variant="outline" className="text-zinc-500 border-zinc-800">Inactive</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Model: GPT-3.5 • Voice: Bella</p>
            </div>
          </CardContent>
        </Card>

        {/* Editor Area */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader>
              <CardTitle>Agent Configuration</CardTitle>
              <CardDescription>Customize the personality and capabilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Agent Name</Label>
                  <Input defaultValue="Customer Support V1" />
                </div>
                <div className="space-y-2">
                  <Label>LLM Model</Label>
                  <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option>GPT-4o (Recommended)</option>
                    <option>Claude 3.5 Sonnet</option>
                    <option>GPT-3.5 Turbo</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>System Prompt</Label>
                <div className="relative">
                  <Textarea 
                    className="min-h-[200px] font-mono text-sm leading-relaxed" 
                    defaultValue={`You are a helpful customer support agent for Nexus Core. 
Your goal is to assist users with their API integration issues.
Be polite, concise, and professional.
If you don't know the answer, offer to escalate to a human.`} 
                  />
                  <Button size="sm" variant="ghost" className="absolute bottom-2 right-2 text-muted-foreground hover:text-purple-500">
                    <Sparkles className="h-4 w-4 mr-1" /> Enhance
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic2 className="h-4 w-4 text-purple-500" />
                    <Label className="text-base">Voice Settings</Label>
                  </div>
                  <Button variant="outline" size="sm">
                    <Volume2 className="h-4 w-4 mr-2" />
                    Preview Voice
                  </Button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Voice Provider</Label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>ElevenLabs</option>
                      <option>OpenAI</option>
                      <option>Deepgram</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Voice ID</Label>
                    <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <option>Rachel (American, Female)</option>
                      <option>Josh (American, Male)</option>
                      <option>Bella (American, Female)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Responsiveness</Label>
                      <span className="text-xs text-muted-foreground">0.8s</span>
                    </div>
                    <Slider defaultValue={[80]} max={100} step={1} className="[&_.range-thumb]:bg-purple-500" />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label>Stability</Label>
                      <span className="text-xs text-muted-foreground">High</span>
                    </div>
                    <Slider defaultValue={[60]} max={100} step={1} className="[&_.range-thumb]:bg-purple-500" />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline">Discard Changes</Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Save className="h-4 w-4 mr-2" />
                  Save Agent
                </Button>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Plus({ className }: { className?: string }) {
    return (
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
      >
        <path d="M5 12h14" />
        <path d="M12 5v14" />
      </svg>
    )
  }
