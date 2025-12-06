import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Workflow, Zap, GitBranch, Box, ArrowRight,
  Settings, Play, Plus, Save
} from "lucide-react";

const functions = [
  { id: 1, name: "Process New Lead", trigger: "Webhook", status: "Active", executions: 1240 },
  { id: 2, name: "Sync Contacts to CRM", trigger: "Schedule", status: "Active", executions: 45 },
  { id: 3, name: "Send Welcome SMS", trigger: "Event", status: "Paused", executions: 890 },
];

export default function FunctionConnect() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Workflow className="h-6 w-6 text-primary" />
            Function Connect
          </h1>
          <p className="text-muted-foreground">Serverless function builder and workflow automation</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Plus className="h-4 w-4 mr-2" />
          New Function
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Functions List */}
        <Card className="col-span-1 bg-card/50 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <CardTitle>My Functions</CardTitle>
            <CardDescription>Manage your deployed serverless functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {functions.map((func) => (
              <div key={func.id} className="p-3 rounded-lg border border-primary/10 bg-background/50 hover:bg-muted/50 cursor-pointer transition-all group">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-md text-blue-500">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium text-sm group-hover:text-primary transition-colors">{func.name}</p>
                      <p className="text-xs text-muted-foreground">{func.trigger} • {func.executions} runs</p>
                    </div>
                  </div>
                  <Badge variant={func.status === "Active" ? "default" : "secondary"} className="text-[10px]">
                    {func.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Builder Area (Mock) */}
        <Card className="col-span-2 bg-slate-950 border-primary/20">
          <CardHeader className="border-b border-primary/10 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-slate-200">Process New Lead</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="h-8">
                  <Play className="h-3 w-3 mr-2" /> Test
                </Button>
                <Button size="sm" className="h-8 bg-purple-600 hover:bg-purple-700">
                  <Save className="h-3 w-3 mr-2" /> Deploy
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0 min-h-[400px] relative bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-80">
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-8 w-full max-w-lg">
                    {/* Trigger Node */}
                    <div className="w-64 p-4 bg-slate-900 border border-blue-500/50 rounded-lg shadow-[0_0_15px_rgba(59,130,246,0.2)] relative">
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-600" />
                        <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-blue-500 rounded text-white"><Zap className="h-4 w-4" /></div>
                            <div>
                                <p className="text-xs font-bold text-blue-400 uppercase">Trigger</p>
                                <p className="text-sm font-medium">Webhook Received</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Action Node */}
                    <div className="w-64 p-4 bg-slate-900 border border-purple-500/50 rounded-lg shadow-[0_0_15px_rgba(168,85,247,0.2)] relative">
                         <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0.5 h-4 bg-slate-600" />
                         <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-purple-500 rounded text-white"><Box className="h-4 w-4" /></div>
                            <div>
                                <p className="text-xs font-bold text-purple-400 uppercase">Action</p>
                                <p className="text-sm font-medium">Format Data</p>
                            </div>
                        </div>
                    </div>

                     {/* End Node */}
                     <div className="w-64 p-4 bg-slate-900 border border-green-500/50 rounded-lg shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                         <div className="flex items-center gap-3">
                            <div className="p-1.5 bg-green-500 rounded text-white"><ArrowRight className="h-4 w-4" /></div>
                            <div>
                                <p className="text-xs font-bold text-green-400 uppercase">Output</p>
                                <p className="text-sm font-medium">CRM Sync</p>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
