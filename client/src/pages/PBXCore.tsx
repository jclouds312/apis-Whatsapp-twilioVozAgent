import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Network,
  ArrowRight,
  Shield,
  Users,
  Menu,
  PhoneCall,
  Globe,
  Plus,
  Trash2,
  Edit,
  Save,
  Clock,
  Music,
  GitBranch,
  PhoneIncoming,
  PhoneOutgoing
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock Data
const inboundRoutes = [
  { id: 1, did: "+15550001", dest: "IVR-Main", cid: "Any" },
  { id: 2, did: "+15550002", dest: "Ext-201", cid: "VIP" },
  { id: 3, did: "+15550003", dest: "Queue-Sales", cid: "Any" },
];

const outboundRoutes = [
  { id: 1, name: "Domestic", pattern: "1NXXNXXXXXX", trunks: ["Twilio-SIP"], seq: 0 },
  { id: 2, name: "International", pattern: "011.", trunks: ["VoIP-Provider-B"], seq: 1 },
];

const queues = [
  { id: 100, name: "Sales", agents: 3, strategy: "ringall", music: "default" },
  { id: 200, name: "Support", agents: 5, strategy: "rrmemory", music: "rock" },
];

const ivrMenus = [
  { id: 1, name: "Main-Greeting", options: 4, timeout: "10s" },
  { id: 2, name: "After-Hours", options: 2, timeout: "5s" },
];

export default function PBXCorePage() {
  const [activeTab, setActiveTab] = useState("routes");

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Network className="h-8 w-8 text-blue-600" />
            </div>
            Core PBX Engine
          </h1>
          <p className="text-muted-foreground mt-1">
            Advanced routing, queue management, and IVR configuration.
          </p>
        </div>
        <div className="flex items-center gap-4">
            <Button variant="outline">
                <Save className="h-4 w-4 mr-2" /> Apply Changes
            </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <TabsList>
            <TabsTrigger value="routes" className="gap-2"><GitBranch className="h-4 w-4" /> Call Routing</TabsTrigger>
            <TabsTrigger value="queues" className="gap-2"><Users className="h-4 w-4" /> Queues</TabsTrigger>
            <TabsTrigger value="ivr" className="gap-2"><Menu className="h-4 w-4" /> IVR Menus</TabsTrigger>
            <TabsTrigger value="firewall" className="gap-2"><Shield className="h-4 w-4" /> Firewall</TabsTrigger>
          </TabsList>
        </div>

        {/* Routes Tab */}
        <TabsContent value="routes" className="flex-1 overflow-auto space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Inbound Routes */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <PhoneIncoming className="h-5 w-5 text-green-500"/>
                                    Inbound Routes
                                </CardTitle>
                                <CardDescription>Handle incoming calls to your DIDs</CardDescription>
                            </div>
                            <Button size="sm" variant="ghost"><Plus className="h-4 w-4"/></Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>DID Number</TableHead>
                                    <TableHead>Destination</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {inboundRoutes.map((route) => (
                                    <TableRow key={route.id}>
                                        <TableCell className="font-mono">{route.did}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">{route.dest}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Outbound Routes */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <PhoneOutgoing className="h-5 w-5 text-blue-500"/>
                                    Outbound Routes
                                </CardTitle>
                                <CardDescription>Manage outgoing call patterns</CardDescription>
                            </div>
                            <Button size="sm" variant="ghost"><Plus className="h-4 w-4"/></Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Dial Pattern</TableHead>
                                    <TableHead>Trunk</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {outboundRoutes.map((route) => (
                                    <TableRow key={route.id}>
                                        <TableCell className="font-medium">{route.name}</TableCell>
                                        <TableCell className="font-mono text-xs">{route.pattern}</TableCell>
                                        <TableCell>{route.trunks[0]}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4"/></Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* Queues Tab */}
        <TabsContent value="queues" className="flex-1 overflow-auto">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Call Queues</CardTitle>
                            <CardDescription>Automatic Call Distribution (ACD) strategies</CardDescription>
                        </div>
                        <Button><Plus className="h-4 w-4 mr-2"/> Add Queue</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Queue Name</TableHead>
                                <TableHead>Strategy</TableHead>
                                <TableHead>Music on Hold</TableHead>
                                <TableHead>Agents</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {queues.map((q) => (
                                <TableRow key={q.id}>
                                    <TableCell className="font-bold">{q.id} - {q.name}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{q.strategy}</Badge>
                                    </TableCell>
                                    <TableCell className="flex items-center gap-2">
                                        <Music className="h-4 w-4 text-muted-foreground"/> {q.music}
                                    </TableCell>
                                    <TableCell>{q.agents} Assigned</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="sm">Manage Agents</Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4"/></Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        {/* IVR Tab */}
        <TabsContent value="ivr" className="flex-1 overflow-auto">
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>IVR Menus</CardTitle>
                            <CardDescription>Interactive Voice Response flows</CardDescription>
                        </div>
                        <Button><Plus className="h-4 w-4 mr-2"/> Create IVR</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ivrMenus.map((ivr) => (
                            <Card key={ivr.id} className="bg-muted/30">
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">{ivr.name}</CardTitle>
                                    <CardDescription>Timeout: {ivr.timeout}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Options Configured:</span>
                                            <span className="font-bold">{ivr.options}</span>
                                        </div>
                                        <Button className="w-full" variant="secondary">Visual Editor</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Firewall Tab */}
         <TabsContent value="firewall" className="flex-1 overflow-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Network Security & Firewall</CardTitle>
                    <CardDescription>Protect your PBX from unauthorized access</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-green-500/10 border-green-500/20">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-500 rounded-full">
                                <Shield className="h-6 w-6 text-white"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Firewall Active</h3>
                                <p className="text-sm text-muted-foreground">Rules updated 2 hours ago</p>
                            </div>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold">Banned IPs (Fail2Ban)</h3>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>IP Address</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Date Banned</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="font-mono">192.168.55.22</TableCell>
                                    <TableCell>SSH Brute Force</TableCell>
                                    <TableCell>Today, 10:42 AM</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-red-500">Unban</Button>
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="font-mono">203.0.113.45</TableCell>
                                    <TableCell>SIP Registration Failures</TableCell>
                                    <TableCell>Yesterday</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" className="text-red-500">Unban</Button>
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
