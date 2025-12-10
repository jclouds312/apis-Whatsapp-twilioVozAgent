import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Phone,
  Activity,
  Server,
  Users,
  Settings,
  Mic,
  Voicemail,
  History,
  AlertCircle,
  CheckCircle2,
  Terminal,
  Play,
  Square,
  Volume2,
  PhoneForwarded,
  Network,
  HardDrive,
  FileAudio,
  Search,
  Download,
  Filter
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

// Mock Data for Asterisk Interface
const activeCalls = [
  { id: "167823", src: "201 (Sales)", dst: "95551234", duration: "02:14", state: "Up", codec: "ulaw" },
  { id: "167824", src: "205 (Support)", dst: "202 (Manager)", duration: "00:45", state: "Up", codec: "g722" },
  { id: "167825", src: "91234567", dst: "IVR-Main", duration: "00:12", state: "Ring", codec: "ulaw" },
];

const extensions = [
  { ext: "201", name: "Alice Johnson", dept: "Sales", status: "Online", ip: "192.168.1.101", followMe: true },
  { ext: "202", name: "Bob Smith", dept: "Management", status: "Busy", ip: "192.168.1.102", followMe: false },
  { ext: "203", name: "Charlie Brown", dept: "Support", status: "Offline", ip: "-", followMe: true },
  { ext: "204", name: "Reception", dept: "Front Desk", status: "Online", ip: "192.168.1.104", followMe: false },
  { ext: "205", name: "Tech Support", dept: "Support", status: "Online", ip: "192.168.1.105", followMe: true },
];

const trunks = [
  { name: "Twilio-SIP-Trunk", type: "PJSIP", status: "Registered", latency: "24ms" },
  { name: "Local-PSTN-Gateway", type: "SIP", status: "Unreachable", latency: "-" },
  { name: "VoIP-Provider-B", type: "IAX2", status: "Registered", latency: "45ms" },
];

const cdrLogs = [
  { date: "2023-10-27 10:45", src: "201", dst: "95551234", duration: "5m 23s", status: "ANSWERED", recording: "rec_1045.wav" },
  { date: "2023-10-27 10:30", src: "External", dst: "204", duration: "1m 12s", status: "ANSWERED", recording: "rec_1030.wav" },
  { date: "2023-10-27 10:15", src: "203", dst: "205", duration: "0s", status: "NO ANSWER", recording: null },
  { date: "2023-10-27 09:55", src: "202", dst: "External", duration: "12m 45s", status: "ANSWERED", recording: "rec_0955.wav" },
  { date: "2023-10-27 09:40", src: "External", dst: "IVR", duration: "45s", status: "BUSY", recording: null },
];

const systemStatus = {
  uptime: "14 days, 3 hours",
  activeChannels: 5,
  callsProcessed: 14502,
  loadAverage: "0.14, 0.10, 0.05",
  asteriskVersion: "Asterisk 20.5.0",
  diskUsage: 45, // %
  ramUsage: 62, // %
};

export default function AsteriskPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isConsoleConnected, setIsConsoleConnected] = useState(true);
  const [consoleOutput, setConsoleOutput] = useState([
    "Asterisk 20.5.0, Copyright (C) 1999 - 2023, Sangoma Technologies Corporation and others.",
    "Created by Mark Spencer <markster@digium.com>",
    "Asterisk is free software, distributed under the terms of the GNU General Public License.",
    "=========================================================================",
    "Connected to Asterisk 20.5.0 currently running on pbx-server (pid = 1234)",
    "[2023-10-27 10:15:23] NOTICE[1234]: res_pjsip/pjsip_distributor.c:676 log_failed_request: Request 'INVITE' from '<sip:100@192.168.1.50>' failed for '192.168.1.50:5060' (callid: 123456)",
    "  == Using SIP RTP CoS mark 5",
    "    -- Called PJSIP/201",
    "    -- PJSIP/201-00000001 is ringing",
    "    -- PJSIP/201-00000001 answered PJSIP/trunk-00000002",
    "    -- Channel PJSIP/201-00000001 joined 'simple_bridge' basic-bridge <bd123>",
  ]);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-orange-500/10 rounded-lg">
              <Server className="h-8 w-8 text-orange-600" />
            </div>
            Asterisk PBX Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Real-time control panel for Asterisk VoIP Server & Elastix API
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="px-3 py-1 bg-background">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConsoleConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            AMI Connected
          </Badge>
          <Button variant="outline" className="gap-2">
            <Terminal className="h-4 w-4" />
            CLI Console
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <TabsList>
            <TabsTrigger value="dashboard" className="gap-2"><Activity className="h-4 w-4" /> Dashboard</TabsTrigger>
            <TabsTrigger value="extensions" className="gap-2"><Users className="h-4 w-4" /> Extensions</TabsTrigger>
            <TabsTrigger value="cdr" className="gap-2"><History className="h-4 w-4" /> CDR Reports</TabsTrigger>
            <TabsTrigger value="trunks" className="gap-2"><Network className="h-4 w-4" /> Trunks</TabsTrigger>
            <TabsTrigger value="recordings" className="gap-2"><FileAudio className="h-4 w-4" /> Recordings</TabsTrigger>
          </TabsList>
        </div>

        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="flex-1 overflow-auto space-y-6">
          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Calls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{activeCalls.length}</div>
                <p className="text-xs text-muted-foreground">+2 from last hour</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Load</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-xs mb-1">
                    <span>RAM Usage</span>
                    <span>{systemStatus.ramUsage}%</span>
                </div>
                <Progress value={systemStatus.ramUsage} className="h-2 mb-3 bg-slate-100 dark:bg-slate-800" />
                <div className="flex justify-between text-xs mb-1">
                    <span>Disk Usage</span>
                    <span>{systemStatus.diskUsage}%</span>
                </div>
                <Progress value={systemStatus.diskUsage} className="h-2 bg-slate-100 dark:bg-slate-800" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold">{systemStatus.uptime}</div>
                <p className="text-xs text-muted-foreground">Load: {systemStatus.loadAverage}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Trunks Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-bold text-green-600">2 / 3 Up</div>
                <p className="text-xs text-muted-foreground">1 Unreachable</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Active Calls Table */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Live Channels</span>
                  <Badge variant="secondary" className="font-mono text-xs">Refresh: 5s</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Channel ID</TableHead>
                      <TableHead>Source</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeCalls.map((call) => (
                      <TableRow key={call.id}>
                        <TableCell className="font-mono text-xs">{call.id}</TableCell>
                        <TableCell className="font-medium">{call.src}</TableCell>
                        <TableCell>{call.dst}</TableCell>
                        <TableCell>
                          <Badge variant={call.state === "Up" ? "default" : "secondary"} className={call.state === "Up" ? "bg-green-500 hover:bg-green-600" : ""}>
                            {call.state}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">{call.duration}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                            <Square className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Server Logs / Console */}
            <Card className="lg:col-span-1 flex flex-col bg-slate-950 text-slate-50 border-slate-800">
              <CardHeader className="bg-slate-900/50 border-b border-slate-800 py-3">
                <CardTitle className="text-sm font-mono flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Asterisk CLI
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 p-0 overflow-hidden flex flex-col">
                <ScrollArea className="flex-1 p-4 font-mono text-xs space-y-1 h-[300px]">
                  {consoleOutput.map((line, i) => (
                    <div key={i} className="break-all whitespace-pre-wrap opacity-90 hover:opacity-100 transition-opacity">
                      <span className="text-slate-500 select-none mr-2">$</span>
                      {line}
                    </div>
                  ))}
                  <div className="animate-pulse text-orange-500">_</div>
                </ScrollArea>
                <div className="p-2 bg-slate-900 border-t border-slate-800 flex gap-2">
                  <Input 
                    className="h-8 bg-slate-950 border-slate-700 text-slate-50 font-mono text-xs" 
                    placeholder="Type a command (e.g., 'core show channels')"
                  />
                  <Button size="sm" variant="secondary" className="h-8">Send</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Extensions Tab */}
        <TabsContent value="extensions" className="flex-1 overflow-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>SIP Extensions</CardTitle>
                  <CardDescription>Manage PJSIP endpoints, users, and Follow Me settings</CardDescription>
                </div>
                <Button>
                  <Users className="mr-2 h-4 w-4" /> Add Extension
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Extension</TableHead>
                    <TableHead>Caller ID Name</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Follow Me</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extensions.map((ext) => (
                    <TableRow key={ext.ext}>
                      <TableCell className="font-bold">{ext.ext}</TableCell>
                      <TableCell>{ext.name}</TableCell>
                      <TableCell>{ext.dept}</TableCell>
                      <TableCell className="font-mono text-xs">{ext.ip}</TableCell>
                      <TableCell>
                          <Switch checked={ext.followMe} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            ext.status === 'Online' ? 'bg-green-500' : 
                            ext.status === 'Busy' ? 'bg-orange-500' : 'bg-gray-300'
                          }`} />
                          {ext.status}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CDR Tab */}
        <TabsContent value="cdr" className="flex-1 overflow-auto">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Call Detail Records</CardTitle>
                            <CardDescription>History of all incoming and outgoing calls</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Input placeholder="Search..." className="w-64" />
                            <Button variant="outline"><Filter className="h-4 w-4 mr-2"/> Filter</Button>
                            <Button variant="outline"><Download className="h-4 w-4 mr-2"/> Export</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date/Time</TableHead>
                                <TableHead>Source</TableHead>
                                <TableHead>Destination</TableHead>
                                <TableHead>Duration</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Recording</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cdrLogs.map((log, i) => (
                                <TableRow key={i}>
                                    <TableCell className="font-mono text-xs">{log.date}</TableCell>
                                    <TableCell>{log.src}</TableCell>
                                    <TableCell>{log.dst}</TableCell>
                                    <TableCell>{log.duration}</TableCell>
                                    <TableCell>
                                        <Badge variant={log.status === 'ANSWERED' ? 'outline' : 'destructive'} className={log.status === 'ANSWERED' ? 'text-green-600 border-green-200 bg-green-50' : ''}>
                                            {log.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        {log.recording ? (
                                            <Button variant="ghost" size="sm" className="h-8 gap-2 text-blue-600">
                                                <Play className="h-3 w-3" /> Play
                                            </Button>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">-</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Trunks Tab */}
        <TabsContent value="trunks" className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {trunks.map((trunk, index) => (
                    <Card key={index} className="overflow-hidden">
                        <div className={`h-2 w-full ${
                            trunk.status === 'Registered' ? 'bg-green-500' : 'bg-red-500'
                        }`} />
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {trunk.name}
                                <Badge variant="outline">{trunk.type}</Badge>
                            </CardTitle>
                            <CardDescription>
                                Latency: {trunk.latency}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="flex items-center gap-2 mb-4">
                                {trunk.status === 'Registered' ? (
                                    <CheckCircle2 className="text-green-500 h-5 w-5" />
                                ) : (
                                    <AlertCircle className="text-red-500 h-5 w-5" />
                                )}
                                <span className="font-medium">{trunk.status}</span>
                             </div>
                             <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                                <Button variant="outline" size="sm" className="flex-1">Reload</Button>
                             </div>
                        </CardContent>
                    </Card>
                ))}
                
                <Card className="border-dashed flex items-center justify-center bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer min-h-[200px]">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <div className="p-4 rounded-full bg-background border shadow-sm">
                            <PlusIcon className="h-6 w-6" />
                        </div>
                        <span className="font-medium">Add New Trunk</span>
                    </div>
                </Card>
            </div>
        </TabsContent>

        {/* Recordings Tab */}
        <TabsContent value="recordings" className="flex-1 overflow-auto">
            <Card>
                <CardHeader>
                    <CardTitle>System Recordings</CardTitle>
                    <CardDescription>Manage IVR prompts and voicemail greetings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-10 text-muted-foreground">
                        <HardDrive className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>No custom recordings found. Upload .wav files to manage them here.</p>
                        <Button className="mt-4" variant="outline">Upload .WAV</Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PlusIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
