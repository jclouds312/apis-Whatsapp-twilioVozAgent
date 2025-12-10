import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  Key,
  Code,
  Globe,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  FileJson,
  PhoneCall,
  Smartphone,
  Video,
  Mic,
  Activity
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";

// Mock Data
const applications = [
  { id: "app-1", name: "Voice Support Center", type: "Voice", id_str: "v-8392-...", webhook: "https://api.nexuscore.com/voice/answer" },
  { id: "app-2", name: "2FA Service", type: "Verify", id_str: "v-1234-...", webhook: "https://api.nexuscore.com/verify/callback" },
];

const numbers = [
  { number: "12015550123", country: "US", type: "Mobile", features: ["VOICE", "SMS"] },
  { number: "447700900123", country: "GB", type: "Mobile", features: ["VOICE", "SMS", "MMS"] },
];

const calls = [
  { id: "call_1", from: "12015550123", to: "12015559999", status: "completed", duration: "45s", cost: "0.0120" },
  { id: "call_2", from: "Unknown", to: "12015550123", status: "busy", duration: "0s", cost: "0.0000" },
];

export default function VonagePage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [nccoJson, setNccoJson] = useState(`[
  {
    "action": "talk",
    "text": "Welcome to Nexus Core. Please wait while we connect you."
  },
  {
    "action": "connect",
    "endpoint": [
      {
        "type": "phone",
        "number": "12015550123"
      }
    ]
  }
]`);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-slate-900 rounded-lg text-white">
              <span className="font-bold text-xl tracking-tighter">V</span>
            </div>
            Vonage Communication API
          </h1>
          <p className="text-muted-foreground mt-1">
            Voice, SMS, Verify and Video API Management.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-slate-100 text-slate-800 border-slate-300">
                Balance: €24.50
            </Badge>
            <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2"/> Sync</Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <TabsList>
            <TabsTrigger value="dashboard" className="gap-2"><Activity className="h-4 w-4" /> Dashboard</TabsTrigger>
            <TabsTrigger value="apps" className="gap-2"><Code className="h-4 w-4" /> Applications</TabsTrigger>
            <TabsTrigger value="numbers" className="gap-2"><Smartphone className="h-4 w-4" /> Numbers</TabsTrigger>
            <TabsTrigger value="ncco" className="gap-2"><FileJson className="h-4 w-4" /> NCCO Builder</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Key className="h-4 w-4" /> Credentials</TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="flex-1 overflow-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Calls Today</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">142</div>
                        <p className="text-xs text-green-500 flex items-center gap-1">
                            <Activity className="h-3 w-3" /> +12% from yesterday
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">SMS Sent</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">8,932</div>
                        <p className="text-xs text-muted-foreground">Delivered: 98.5%</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Verify Conversions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">84%</div>
                        <p className="text-xs text-muted-foreground">Avg. time: 12s</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Spend</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">€124.50</div>
                        <p className="text-xs text-muted-foreground">This month</p>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Voice Logs</CardTitle>
                    <CardDescription>Latest inbound and outbound calls</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Status</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {calls.map((call) => (
                                <TableRow key={call.id}>
                                    <TableCell>
                                        <Badge variant={call.status === 'completed' ? 'default' : 'secondary'}>
                                            {call.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{call.from}</TableCell>
                                    <TableCell>{call.to}</TableCell>
                                    <TableCell>{call.duration}</TableCell>
                                    <TableCell>€{call.cost}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Details</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Applications Tab */}
        <TabsContent value="apps" className="flex-1 overflow-auto">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Applications</CardTitle>
                            <CardDescription>Manage your Vonage Applications and Webhooks</CardDescription>
                        </div>
                        <Button><Plus className="h-4 w-4 mr-2"/> Create New App</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>App ID</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Webhook</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.map((app) => (
                                <TableRow key={app.id}>
                                    <TableCell className="font-bold">{app.name}</TableCell>
                                    <TableCell className="font-mono text-xs">{app.id_str}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            {app.type === 'Voice' ? <Phone className="h-4 w-4"/> : <ShieldCheck className="h-4 w-4"/>}
                                            {app.type}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                                        {app.webhook}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon"><Key className="h-4 w-4"/></Button>
                                            <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        {/* NCCO Builder Tab */}
        <TabsContent value="ncco" className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                <Card className="flex flex-col">
                    <CardHeader>
                        <CardTitle>NCCO Editor</CardTitle>
                        <CardDescription>Define Call Control Objects (JSON)</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                        <Textarea 
                            className="font-mono text-sm h-full min-h-[400px]" 
                            value={nccoJson}
                            onChange={(e) => setNccoJson(e.target.value)}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Visual Flow</CardTitle>
                        <CardDescription>Representation of your call logic</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 border rounded-lg bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <Mic className="h-5 w-5 text-blue-600"/>
                                    <span className="font-bold">Action: Talk</span>
                                </div>
                                <p className="text-sm text-muted-foreground">"Welcome to Nexus Core..."</p>
                            </div>
                            <div className="flex justify-center">
                                <div className="h-6 w-0.5 bg-border"></div>
                            </div>
                            <div className="p-4 border rounded-lg bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                                <div className="flex items-center gap-2 mb-2">
                                    <PhoneCall className="h-5 w-5 text-green-600"/>
                                    <span className="font-bold">Action: Connect</span>
                                </div>
                                <p className="text-sm text-muted-foreground">To: 12015550123</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* Numbers Tab */}
        <TabsContent value="numbers" className="flex-1 overflow-auto">
            <Card>
                 <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Your Numbers</CardTitle>
                            <CardDescription>Manage virtual numbers for Voice and SMS</CardDescription>
                        </div>
                        <Button><Plus className="h-4 w-4 mr-2"/> Buy Number</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Number</TableHead>
                                <TableHead>Country</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Capabilities</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {numbers.map((num, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-mono font-bold">{num.number}</TableCell>
                                    <TableCell>{num.country}</TableCell>
                                    <TableCell>{num.type}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1">
                                            {num.features.map(f => (
                                                <Badge key={f} variant="secondary" className="text-[10px]">{f}</Badge>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm">Configure</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="flex-1 overflow-auto">
             <Card>
                <CardHeader>
                    <CardTitle>API Credentials</CardTitle>
                    <CardDescription>Configure your Vonage API keys.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>API Key</Label>
                            <Input placeholder="e.g. 7d3f8..." />
                        </div>
                        <div className="space-y-2">
                            <Label>API Secret</Label>
                            <Input type="password" placeholder="••••••••••••" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label>Private Key (Application)</Label>
                        <Textarea placeholder="-----BEGIN PRIVATE KEY-----..." className="font-mono text-xs min-h-[150px]" />
                    </div>
                    <Button>Save Credentials</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
