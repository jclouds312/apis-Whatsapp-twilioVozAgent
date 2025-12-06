import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, PlayCircle, GitBranch, MessageSquare, PhoneCall, Clock, Settings2, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

// Mock data for workflows
const workflows = [
  { id: 1, name: "Inbound Sales Lead", status: "active", steps: 12, triggers: "Incoming Call", lastRun: "2m ago" },
  { id: 2, name: "Appointment Reminder", status: "active", steps: 5, triggers: "Schedule API", lastRun: "15m ago" },
  { id: 3, name: "After-Hours Support", status: "paused", steps: 8, triggers: "Time Condition", lastRun: "1d ago" },
  { id: 4, name: "Survey & Feedback", status: "draft", steps: 4, triggers: "Manual", lastRun: "Never" },
];

export default function Workflows() {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Visual Flow Builder</h2>
          <p className="text-muted-foreground">Design conversational logic and agent behaviors visually.</p>
        </div>
        <Button className="gap-2 shadow-lg shadow-primary/20">
          <Plus className="h-4 w-4" />
          New Workflow
        </Button>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Workflow List */}
        <Card className="glass-panel lg:col-span-1 flex flex-col overflow-hidden">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Your Workflows</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="flex flex-col divide-y divide-border/50">
              {workflows.map((wf) => (
                <button 
                  key={wf.id}
                  className="flex flex-col gap-2 p-4 text-left hover:bg-accent/50 transition-colors"
                >
                  <div className="flex justify-between items-start w-full">
                    <span className="font-medium text-sm">{wf.name}</span>
                    <Badge variant="outline" className={
                      wf.status === 'active' ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' : 
                      wf.status === 'paused' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10' :
                      'text-muted-foreground'
                    }>{wf.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><GitBranch className="h-3 w-3" /> {wf.steps} steps</span>
                    <span>{wf.lastRun}</span>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Visual Editor Canvas (Mockup) */}
        <Card className="glass-panel lg:col-span-3 flex flex-col overflow-hidden border-primary/20 relative bg-black/20">
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:20px_20px] opacity-20"></div>
          
          {/* Toolbar */}
          <div className="relative z-10 p-2 border-b border-border/50 bg-background/80 backdrop-blur-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
               <Badge variant="secondary" className="rounded-sm font-mono text-xs">Inbound Sales Lead</Badge>
               <span className="text-xs text-muted-foreground">v1.2</span>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost"><PlayCircle className="h-4 w-4 mr-2 text-emerald-500" /> Test Run</Button>
              <Button size="sm" variant="default">Publish Changes</Button>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="relative flex-1 overflow-hidden p-8">
            {/* Mock Nodes */}
            <div className="relative w-full h-full">
              {/* Start Node */}
              <div className="absolute top-10 left-1/2 -translate-x-1/2 w-48 bg-card border border-emerald-500/50 rounded-lg shadow-lg p-3 z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-6 w-6 rounded bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <PhoneCall className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium">Incoming Call</span>
                </div>
                <div className="text-xs text-muted-foreground">Trigger: +1 (555) 000-0000</div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full border-2 border-card"></div>
              </div>

              {/* Connector Line 1 */}
              <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
                <path d="M 50% 100 L 50% 160" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
              </svg>

              {/* Action Node 1 */}
              <div className="absolute top-40 left-1/2 -translate-x-1/2 w-64 bg-card border border-border rounded-lg shadow-lg p-3 z-10">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-blue-500/20 flex items-center justify-center text-blue-500">
                      <MessageSquare className="h-3 w-3" />
                    </div>
                    <span className="text-sm font-medium">AI Greeting</span>
                  </div>
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </div>
                <div className="text-xs bg-muted/50 p-2 rounded text-muted-foreground font-mono">
                  "Hello, thanks for calling Nexus. How can I help you today?"
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-border rounded-full border-2 border-card"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full border-2 border-card"></div>
              </div>

              {/* Connector Line 2 (Split) */}
              <svg className="absolute inset-0 pointer-events-none" style={{ overflow: 'visible' }}>
                <path d="M 50% 230 L 50% 260 L 30% 260 L 30% 300" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
                <path d="M 50% 230 L 50% 260 L 70% 260 L 70% 300" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
              </svg>

               {/* Logic Node Left */}
              <div className="absolute top-[300px] left-[30%] -translate-x-1/2 w-48 bg-card border border-border rounded-lg shadow-lg p-3 z-10">
                <div className="flex items-center gap-2 mb-2">
                   <div className="h-6 w-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-500">
                    <GitBranch className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium">Intent: Sales</span>
                </div>
                <div className="text-xs text-muted-foreground">Keywords: buy, price, cost</div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-border rounded-full border-2 border-card"></div>
              </div>

               {/* Logic Node Right */}
              <div className="absolute top-[300px] left-[70%] -translate-x-1/2 w-48 bg-card border border-border rounded-lg shadow-lg p-3 z-10">
                <div className="flex items-center gap-2 mb-2">
                   <div className="h-6 w-6 rounded bg-purple-500/20 flex items-center justify-center text-purple-500">
                    <GitBranch className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-medium">Intent: Support</span>
                </div>
                <div className="text-xs text-muted-foreground">Keywords: help, broken, issue</div>
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-border rounded-full border-2 border-card"></div>
              </div>

            </div>
          </div>
          
          {/* Floating Controls */}
          <div className="absolute bottom-4 right-4 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="rounded-full shadow-md">+</Button>
            <Button size="icon" variant="secondary" className="rounded-full shadow-md">-</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}