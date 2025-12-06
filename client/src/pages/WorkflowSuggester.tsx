import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles, ArrowRight, Check, Plus, Wand2, Zap,
  MessageSquare, Phone, Users
} from "lucide-react";

const suggestions = [
  {
    id: 1,
    title: "Lead Qualification Bot",
    description: "Automatically qualify incoming WhatsApp leads using AI and sync valid prospects to CRM.",
    tags: ["AI", "WhatsApp", "CRM"],
    complexity: "Medium",
    steps: ["Webhook Trigger", "AI Analysis", "CRM Update", "Notify Sales"]
  },
  {
    id: 2,
    title: "Missed Call Follow-up",
    description: "Send an SMS with booking link immediately after a missed call.",
    tags: ["Voice", "SMS"],
    complexity: "Simple",
    steps: ["Missed Call Event", "Wait 1 min", "Send SMS"]
  },
  {
    id: 3,
    title: "Voice Appointment Reminder",
    description: "Call customers 24h before appointment with AI voice agent confirmation.",
    tags: ["Voice AI", "Schedule"],
    complexity: "Advanced",
    steps: ["Schedule Trigger", "Retell AI Call", "Update Status"]
  }
];

export default function WorkflowSuggester() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8 border border-white/10">
        <div className="absolute top-0 right-0 p-12 opacity-10">
            <Wand2 className="h-64 w-64 text-white" />
        </div>
        <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur-md mb-4">
                <Sparkles className="mr-2 h-3 w-3 text-yellow-300" />
                AI Powered Suggestions
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Workflow Suggester</h1>
            <p className="text-indigo-100 text-lg mb-6">
                Let our AI analyze your usage patterns and suggest automation workflows to optimize your business processes.
            </p>
            <Button size="lg" className="bg-white text-purple-900 hover:bg-indigo-50">
                <Zap className="mr-2 h-4 w-4" /> Generate New Ideas
            </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {suggestions.map((workflow) => (
          <Card key={workflow.id} className="flex flex-col bg-card/50 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all group">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="flex gap-2">
                    {workflow.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] bg-primary/5 hover:bg-primary/10 border-primary/10">
                            {tag}
                        </Badge>
                    ))}
                </div>
                <Badge variant="outline" className={
                    workflow.complexity === "Simple" ? "text-green-500 border-green-500/20" :
                    workflow.complexity === "Medium" ? "text-yellow-500 border-yellow-500/20" :
                    "text-purple-500 border-purple-500/20"
                }>
                    {workflow.complexity}
                </Badge>
              </div>
              <CardTitle className="group-hover:text-primary transition-colors">{workflow.title}</CardTitle>
              <CardDescription className="line-clamp-2">{workflow.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
                <div className="space-y-3 mb-6">
                    {workflow.steps.map((step, i) => (
                        <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                            <div className="h-6 w-6 rounded-full bg-muted/50 flex items-center justify-center text-[10px] font-mono">
                                {i + 1}
                            </div>
                            <span>{step}</span>
                            {i < workflow.steps.length - 1 && (
                                <div className="ml-auto h-4 w-px bg-border" />
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
            <div className="p-6 pt-0 mt-auto">
                <Button className="w-full bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20">
                    <Plus className="h-4 w-4 mr-2" />
                    Use Template
                </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
