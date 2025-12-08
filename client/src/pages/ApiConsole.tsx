import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Play, Trash2, Save, Copy, Check, ChevronRight,
  Terminal as TerminalIcon, Code2, Database, Globe, Layers, RefreshCw
} from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const endpoints = [
  { method: "POST", path: "/v1/messages", description: "Send a WhatsApp message" },
  { method: "GET", path: "/v1/contacts", description: "List all contacts" },
  { method: "POST", path: "/v1/voice/call", description: "Initiate a voice call" },
  { method: "GET", path: "/v1/analytics/usage", description: "Get usage statistics" },
];

export default function ApiConsole() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(endpoints[0]);
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRun = () => {
    setIsLoading(true);
    setResponse(null);
    // Mock API call
    setTimeout(() => {
      setResponse(JSON.stringify({
        status: "success",
        data: {
          id: "msg_" + Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          status: "queued"
        },
        meta: {
          processing_time: "45ms"
        }
      }, null, 2));
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Sidebar: Endpoints */}
      <Card className="col-span-1 flex flex-col bg-card/50 backdrop-blur-sm border-primary/10 h-full">
        <CardHeader className="pb-4 border-b border-primary/10">
          <CardTitle className="flex items-center gap-2">
            <TerminalIcon className="h-5 w-5 text-primary" />
            API Explorer
          </CardTitle>
          <CardDescription>Select an endpoint to test</CardDescription>
        </CardHeader>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {endpoints.map((endpoint) => (
              <button
                key={endpoint.path}
                onClick={() => setSelectedEndpoint(endpoint)}
                className={`w-full text-left p-3 rounded-lg text-sm transition-all hover:bg-muted/50 ${
                  selectedEndpoint.path === endpoint.path ? "bg-primary/10 border border-primary/20" : ""
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className={`
                    ${endpoint.method === 'GET' ? 'text-blue-400 border-blue-400/20 bg-blue-400/10' : 
                      endpoint.method === 'POST' ? 'text-green-400 border-green-400/20 bg-green-400/10' : 
                      'text-orange-400 border-orange-400/20 bg-orange-400/10'}
                  `}>
                    {endpoint.method}
                  </Badge>
                  <span className="font-mono text-xs text-muted-foreground">{endpoint.path}</span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{endpoint.description}</p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Main: Request/Response */}
      <div className="col-span-1 lg:col-span-2 flex flex-col gap-6 h-full">
        <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm border-primary/10">
          <Tabs defaultValue="params" className="flex-1 flex flex-col">
            <div className="p-4 border-b border-primary/10 flex items-center justify-between bg-muted/20">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-500 text-white hover:bg-green-600">{selectedEndpoint.method}</Badge>
                <code className="text-sm bg-background px-2 py-1 rounded border border-border font-mono">
                  https://api.nexuscore.com{selectedEndpoint.path}
                </code>
              </div>
              <Button onClick={handleRun} disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                Send Request
              </Button>
            </div>

            <div className="px-4 pt-4">
                <TabsList>
                    <TabsTrigger value="params">Params</TabsTrigger>
                    <TabsTrigger value="headers">Headers</TabsTrigger>
                    <TabsTrigger value="body">Body</TabsTrigger>
                </TabsList>
            </div>

            <TabsContent value="params" className="flex-1 p-4">
                <div className="text-center text-muted-foreground py-8 text-sm">
                    No query parameters required for this endpoint.
                </div>
            </TabsContent>
             <TabsContent value="headers" className="flex-1 p-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground">Authorization</label>
                        <div className="p-2 bg-muted/30 rounded border border-border text-sm font-mono truncate">
                            Bearer sk_test_...
                        </div>
                    </div>
                    <div className="space-y-1">
                         <label className="text-xs font-medium text-muted-foreground">Content-Type</label>
                        <div className="p-2 bg-muted/30 rounded border border-border text-sm font-mono">
                            application/json
                        </div>
                    </div>
                </div>
            </TabsContent>
             <TabsContent value="body" className="flex-1 p-4">
                 <div className="h-full relative">
                     <textarea 
                        className="w-full h-full min-h-[200px] bg-slate-950 text-slate-300 font-mono text-sm p-4 rounded-lg border border-primary/20 resize-none focus:outline-none focus:ring-1 focus:ring-primary/50"
                        defaultValue={`{\n  "to": "+1234567890",\n  "template": "hello_world",\n  "language": "en_US"\n}`}
                     />
                 </div>
            </TabsContent>
          </Tabs>
        </Card>

        <Card className="h-1/2 bg-card/50 backdrop-blur-sm border-primary/10 flex flex-col">
            <CardHeader className="py-3 border-b border-primary/10 min-h-[50px]">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Response</CardTitle>
                    {response && (
                        <div className="flex items-center gap-2">
                             <Badge variant="outline" className="text-green-500 border-green-500/20 bg-green-500/10 text-[10px]">200 OK</Badge>
                             <span className="text-[10px] text-muted-foreground">45ms</span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent className="flex-1 p-0 relative overflow-hidden bg-slate-950">
                {response ? (
                    <ScrollArea className="h-full w-full p-4">
                        <pre className="text-xs font-mono text-green-400 leading-relaxed">
                            {response}
                        </pre>
                    </ScrollArea>
                ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                        Click "Send Request" to see the response
                    </div>
                )}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
