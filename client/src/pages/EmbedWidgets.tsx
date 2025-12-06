import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Code2, MessageSquare, Phone, Bot, Layers, Copy, ExternalLink,
  Palette, Layout, Type
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function EmbedWidgets() {
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [borderRadius, setBorderRadius] = useState([8]);
  const [showGreeting, setShowGreeting] = useState(true);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Widget Builder</h1>
          <p className="text-muted-foreground">Customize and embed chat widgets for your website.</p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
                <CardTitle className="text-lg">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Widget Type</Label>
                        <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" className="bg-primary/10 border-primary/20 text-primary">
                                <MessageSquare className="h-4 w-4 mr-2" /> Chat
                            </Button>
                            <Button variant="outline">
                                <Phone className="h-4 w-4 mr-2" /> Voice
                            </Button>
                            <Button variant="outline">
                                <Bot className="h-4 w-4 mr-2" /> AI Agent
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                            {["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"].map((color) => (
                                <button
                                    key={color}
                                    onClick={() => setPrimaryColor(color)}
                                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                                        primaryColor === color ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                            <Input 
                                type="color" 
                                value={primaryColor}
                                onChange={(e) => setPrimaryColor(e.target.value)}
                                className="w-8 h-8 p-0 border-none rounded-full overflow-hidden cursor-pointer" 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Border Radius</Label>
                            <span className="text-xs text-muted-foreground">{borderRadius}px</span>
                        </div>
                        <Slider 
                            value={borderRadius} 
                            onValueChange={setBorderRadius} 
                            max={24} 
                            step={2} 
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <Label>Show Greeting Message</Label>
                        <Switch checked={showGreeting} onCheckedChange={setShowGreeting} />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-slate-950 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between py-3 bg-muted/10 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-blue-400" />
                    <span className="text-sm font-medium text-slate-300">Embed Code</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8">
                    <Copy className="h-3 w-3 mr-2" /> Copy
                </Button>
            </CardHeader>
            <CardContent className="p-4 font-mono text-xs text-slate-400 leading-relaxed">
                {`<script>\n  window.NexusWidget = {\n    id: "wid_8x29s...",\n    color: "${primaryColor}",\n    radius: ${borderRadius[0]},\n    greeting: ${showGreeting}\n  };\n</script>\n<script src="https://cdn.nexuscore.com/widget.js" async></script>`}
            </CardContent>
        </Card>
      </div>

      {/* Preview Area */}
      <div className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-xl border border-primary/10 p-8 flex items-center justify-center min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        
        {/* Mock Website Content */}
        <div className="w-full max-w-md space-y-4 opacity-30 blur-[1px] select-none pointer-events-none">
            <div className="h-8 w-32 bg-slate-700 rounded" />
            <div className="h-64 bg-slate-800 rounded-lg" />
            <div className="space-y-2">
                <div className="h-4 w-full bg-slate-700 rounded" />
                <div className="h-4 w-2/3 bg-slate-700 rounded" />
            </div>
        </div>

        {/* The Widget */}
        <div className="absolute bottom-8 right-8 flex flex-col items-end gap-4">
            {showGreeting && (
                <div className="bg-white text-slate-900 px-4 py-3 rounded-lg shadow-xl rounded-br-none animate-in fade-in slide-in-from-bottom-2 mb-2 max-w-[250px]">
                    <p className="text-sm font-medium">👋 Hi there! How can we help you today?</p>
                </div>
            )}
            
            <button
                className="h-14 w-14 rounded-full shadow-2xl flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
                style={{ 
                    backgroundColor: primaryColor,
                    borderRadius: `${borderRadius}px` // Actually standard widgets are usually round or rounded-xl, but using the slider for demo
                }}
            >
                <MessageSquare className="h-7 w-7" />
            </button>
        </div>
      </div>
    </div>
  );
}
