import { useState } from "react";
import { Plus, X, Settings, MessageSquare, Mic, ArrowRight, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

// Simple Mock Flow Designer
export default function FlowDesigner() {
  const [nodes, setNodes] = useState([
    { id: 1, type: 'trigger', label: 'Incoming Call', x: 50, y: 50, icon: Mic },
    { id: 2, type: 'action', label: 'Retell AI Agent', x: 250, y: 50, icon: MessageSquare },
    { id: 3, type: 'condition', label: 'User Intent?', x: 450, y: 50, icon: Settings },
  ]);

  return (
    <div className="h-[600px] bg-zinc-950 border border-border/50 rounded-lg overflow-hidden relative flex flex-col">
      {/* Toolbar */}
      <div className="h-12 border-b border-border/50 bg-card/50 flex items-center px-4 justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-muted-foreground">Flow:</span>
          <span className="text-sm font-mono text-primary">Customer_Onboarding_V2</span>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" className="h-8 text-xs">
            <Plus className="h-3 w-3 mr-1" /> Add Node
          </Button>
          <Button size="sm" className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
            <Save className="h-3 w-3 mr-1" /> Save Flow
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:16px_16px] p-8 overflow-auto">
        
        {/* Connection Lines (Mocked with SVG) */}
        <svg className="absolute inset-0 pointer-events-none w-full h-full">
          <path d="M 200 80 L 250 80" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
          <path d="M 400 80 L 450 80" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
          <path d="M 600 80 L 650 80" stroke="hsl(var(--border))" strokeWidth="2" fill="none" />
        </svg>

        {/* Nodes */}
        <div className="relative flex items-start gap-12">
          {nodes.map((node) => (
            <div 
              key={node.id}
              className="w-48 bg-card border border-border shadow-lg rounded-lg p-0 flex flex-col group hover:border-primary/50 transition-colors cursor-move z-10"
            >
              <div className="h-2 rounded-t-lg bg-muted-foreground/20 group-hover:bg-primary/50 transition-colors" />
              <div className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded bg-primary/10 text-primary">
                    <node.icon className="h-4 w-4" />
                  </div>
                  <span className="font-medium text-sm">{node.label}</span>
                </div>
                <div className="text-xs text-muted-foreground font-mono">ID: node_{node.id}</div>
              </div>
              
              {/* Ports */}
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-muted border border-border hover:bg-primary hover:border-primary cursor-pointer" />
              {node.id !== 1 && (
                <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-muted border border-border hover:bg-primary hover:border-primary cursor-pointer" />
              )}
            </div>
          ))}

          {/* Ghost Node for visual hint */}
          <div className="w-48 h-24 border-2 border-dashed border-border/50 rounded-lg flex items-center justify-center text-muted-foreground/50 text-xs">
            Drag actions here
          </div>
        </div>

      </div>
      
      {/* Properties Panel (Mock) */}
      <div className="absolute right-4 top-16 w-64 bg-card/90 backdrop-blur border border-border/50 rounded-lg shadow-xl p-4">
        <h3 className="text-xs font-bold uppercase text-muted-foreground mb-3">Properties</h3>
        <div className="space-y-3">
          <div className="h-8 bg-muted/50 rounded w-full animate-pulse" />
          <div className="h-20 bg-muted/50 rounded w-full animate-pulse" />
          <div className="flex gap-2">
            <div className="h-8 bg-muted/50 rounded w-1/2 animate-pulse" />
            <div className="h-8 bg-muted/50 rounded w-1/2 animate-pulse" />
          </div>
        </div>
      </div>

    </div>
  );
}
