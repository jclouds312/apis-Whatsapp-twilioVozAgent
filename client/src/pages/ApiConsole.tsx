import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Terminal, Play, Copy, Check, Globe, Lock } from "lucide-react";

export default function ApiConsolePage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Terminal className="h-6 w-6 text-blue-500" />
            Exposed API Console
          </h2>
          <p className="text-muted-foreground">Document, test, and expose your internal APIs.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            Download OpenAPI Spec
          </Button>
          <Button>
            <Globe className="h-4 w-4 mr-2" />
            Publish Changes
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1 bg-card/50 border-border/50 h-fit">
          <CardContent className="p-4 space-y-1">
            <h3 className="font-semibold text-sm px-2 py-2 text-muted-foreground uppercase">Endpoints</h3>
            {['Send WhatsApp', 'Initiate Call', 'Verify Code', 'List Agents', 'Get Metrics'].map((item, i) => (
              <div key={i} className={`
                px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-muted/50 flex items-center gap-2
                ${i === 0 ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground'}
              `}>
                <Badge variant="outline" className={`text-[10px] h-5 px-1 ${i % 2 === 0 ? 'text-emerald-500 border-emerald-500/30' : 'text-blue-500 border-blue-500/30'}`}>
                  {i % 2 === 0 ? 'POST' : 'GET'}
                </Badge>
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Main Documentation Area */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="bg-card border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className="bg-emerald-500 text-white hover:bg-emerald-600">POST</Badge>
                  <CardTitle className="font-mono text-lg">/v1/whatsapp/send</CardTitle>
                </div>
                <Badge variant="secondary" className="gap-1">
                  <Lock className="h-3 w-3" />
                  Authenticated
                </Badge>
              </div>
              <CardDescription className="mt-2">
                Sends a template message to a specific phone number using the configured WhatsApp Business account.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <Tabs defaultValue="params">
                <TabsList className="w-full justify-start border-b border-border/50 rounded-none bg-transparent p-0 h-auto">
                  <TabsTrigger value="params" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Parameters</TabsTrigger>
                  <TabsTrigger value="responses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Responses</TabsTrigger>
                  <TabsTrigger value="playground" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2">Playground</TabsTrigger>
                </TabsList>
                
                <TabsContent value="params" className="pt-4 space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-sm font-medium text-muted-foreground border-b border-border/50 pb-2">
                    <div className="col-span-3">Field</div>
                    <div className="col-span-2">Type</div>
                    <div className="col-span-7">Description</div>
                  </div>
                  
                  {[
                    { name: 'to', type: 'string', desc: 'Destination phone number with country code (e.g., +1555...)' },
                    { name: 'template_name', type: 'string', desc: 'The name of the approved WhatsApp template to send.' },
                    { name: 'language', type: 'string', desc: 'Language code (e.g., en_US). Defaults to en_US.' },
                    { name: 'variables', type: 'object', desc: 'Key-value pairs to replace placeholders in the template.' },
                  ].map((param, i) => (
                    <div key={i} className="grid grid-cols-12 gap-4 text-sm py-2 border-b border-border/50 last:border-0">
                      <div className="col-span-3 font-mono text-primary">{param.name}</div>
                      <div className="col-span-2 text-muted-foreground italic">{param.type}</div>
                      <div className="col-span-7 text-muted-foreground">{param.desc}</div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="playground" className="pt-4">
                  <div className="bg-[#1e1e1e] rounded-lg border border-border/50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3e3e42]">
                      <span className="text-xs text-muted-foreground">cURL Example</span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="p-4 overflow-x-auto">
                      <pre className="font-mono text-sm text-[#d4d4d4]">
{`curl -X POST https://api.nexus-core.com/v1/whatsapp/send \\
  -H "Authorization: Bearer pk_live_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "to": "+15551234567",
    "template_name": "welcome_msg",
    "variables": {
      "name": "John"
    }
  }'`}
                      </pre>
                    </div>
                    <div className="border-t border-[#3e3e42] p-4 bg-[#1e1e1e]">
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                        <Play className="h-3 w-3 mr-2" />
                        Run Request
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
