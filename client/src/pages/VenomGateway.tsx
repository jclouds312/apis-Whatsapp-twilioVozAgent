import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Key,
  Database,
  HardDrive,
  Plus,
  Trash2,
  Copy,
  RefreshCw,
  Shield,
  Smartphone,
  Server,
  FileText,
  Image as ImageIcon,
  Video,
  Eye,
  Terminal
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

// Mock Data
const apiKeys = [
  { id: 1, name: "Production App", key: "sk_live_51Mz...", created: "2023-10-01", status: "Active", permissions: "Full Access" },
  { id: 2, name: "Dev Test", key: "sk_test_42Kx...", created: "2023-10-15", status: "Active", permissions: "Read Only" },
  { id: 3, name: "Legacy System", key: "sk_live_99Rp...", created: "2023-01-20", status: "Revoked", permissions: "Full Access" },
];

const sessions = [
  { id: "session_a", phone: "5215512345678", status: "Connected", battery: 85, platform: "Venom-Bot" },
  { id: "session_b", phone: "5215598765432", status: "Scanning QR", battery: null, platform: "Venom-Bot" },
];

const files = [
  { id: 1, name: "invoice_2023.pdf", type: "document", size: "1.2 MB", date: "Today 10:23 AM" },
  { id: 2, name: "welcome_video.mp4", type: "video", size: "15.4 MB", date: "Yesterday" },
  { id: 3, name: "promo_banner.jpg", type: "image", size: "450 KB", date: "Oct 24" },
];

export default function VenomGatewayPage() {
  const [activeTab, setActiveTab] = useState("apikeys");

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-yellow-500/10 rounded-lg">
              <Terminal className="h-8 w-8 text-yellow-600" />
            </div>
            Venom API Gateway
          </h1>
          <p className="text-muted-foreground mt-1">
            High-performance WhatsApp API Gateway based on Venom-Bot.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-200">
                v4.3.7-stable
            </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <TabsList>
            <TabsTrigger value="apikeys" className="gap-2"><Key className="h-4 w-4" /> API Keys</TabsTrigger>
            <TabsTrigger value="sessions" className="gap-2"><Smartphone className="h-4 w-4" /> Sessions</TabsTrigger>
            <TabsTrigger value="storage" className="gap-2"><HardDrive className="h-4 w-4" /> Storage</TabsTrigger>
            <TabsTrigger value="database" className="gap-2"><Database className="h-4 w-4" /> Database</TabsTrigger>
          </TabsList>
        </div>

        {/* API Keys Tab */}
        <TabsContent value="apikeys" className="flex-1 overflow-auto space-y-6">
            <Alert className="bg-blue-500/10 border-blue-500/20">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertTitle>Secure Storage</AlertTitle>
                <AlertDescription>
                    API Keys are encrypted at rest using AES-256 before being stored in the database.
                </AlertDescription>
            </Alert>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>API Credentials</CardTitle>
                            <CardDescription>Manage access tokens for external applications</CardDescription>
                        </div>
                        <Button><Plus className="h-4 w-4 mr-2"/> Generate Key</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Token</TableHead>
                                <TableHead>Permissions</TableHead>
                                <TableHead>Created</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {apiKeys.map((key) => (
                                <TableRow key={key.id}>
                                    <TableCell className="font-medium">{key.name}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {key.key}
                                    </TableCell>
                                    <TableCell>{key.permissions}</TableCell>
                                    <TableCell>{key.created}</TableCell>
                                    <TableCell>
                                        <Badge variant={key.status === 'Active' ? 'default' : 'secondary'}>
                                            {key.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Copy className="h-4 w-4"/></Button>
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

        {/* Sessions Tab */}
        <TabsContent value="sessions" className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sessions.map((session) => (
                    <Card key={session.id}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 dark:bg-green-900 rounded-full">
                                        <Smartphone className="h-5 w-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-base">{session.id}</CardTitle>
                                        <CardDescription>{session.platform}</CardDescription>
                                    </div>
                                </div>
                                <Badge variant={session.status === 'Connected' ? 'default' : 'outline'} className={session.status === 'Connected' ? 'bg-green-500' : 'text-yellow-600 border-yellow-200'}>
                                    {session.status}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mt-4 space-y-4">
                                <div className="flex justify-between text-sm border-b pb-2">
                                    <span className="text-muted-foreground">Phone Number</span>
                                    <span className="font-mono">{session.phone}</span>
                                </div>
                                <div className="flex justify-between text-sm border-b pb-2">
                                    <span className="text-muted-foreground">Battery Level</span>
                                    <span>{session.battery ? `${session.battery}%` : 'N/A'}</span>
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <Button variant="outline" size="sm" className="flex-1"><RefreshCw className="h-3 w-3 mr-2"/> Restart</Button>
                                    <Button variant="outline" size="sm" className="flex-1 text-red-500 hover:text-red-600">Kill Session</Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                
                <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer min-h-[200px]">
                   <div className="p-4 rounded-full bg-background border shadow-sm mb-4">
                     <Plus className="h-6 w-6 text-muted-foreground" />
                   </div>
                   <h3 className="text-lg font-semibold">Start New Session</h3>
                   <p className="text-sm text-muted-foreground max-w-xs mt-2">
                     Launch a new Venom-Bot instance.
                   </p>
                </Card>
            </div>
        </TabsContent>

        {/* Storage Tab */}
        <TabsContent value="storage" className="flex-1 overflow-auto">
             <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Media Storage</CardTitle>
                            <CardDescription>Files received and sent through the Gateway</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Input placeholder="Search files..." className="w-64" />
                            <Button variant="outline"><RefreshCw className="h-4 w-4 mr-2"/> Scan</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Filename</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {files.map((file) => (
                                <TableRow key={file.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        {file.type === 'image' && <ImageIcon className="h-4 w-4 text-purple-500"/>}
                                        {file.type === 'video' && <Video className="h-4 w-4 text-blue-500"/>}
                                        {file.type === 'document' && <FileText className="h-4 w-4 text-orange-500"/>}
                                        {file.name}
                                    </TableCell>
                                    <TableCell className="capitalize">{file.type}</TableCell>
                                    <TableCell className="font-mono text-xs">{file.size}</TableCell>
                                    <TableCell>{file.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm"><Eye className="h-4 w-4 mr-2"/> Preview</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </TabsContent>

        {/* Database Tab */}
         <TabsContent value="database" className="flex-1 overflow-auto">
            <Card>
                <CardHeader>
                    <CardTitle>Database Connection</CardTitle>
                    <CardDescription>Configure where API keys and session data are stored</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Database Type</Label>
                            <Input value="MongoDB" readOnly />
                        </div>
                        <div className="space-y-2">
                            <Label>Host</Label>
                            <Input value="cluster0.mongodb.net" />
                        </div>
                        <div className="space-y-2">
                            <Label>Database Name</Label>
                            <Input value="venom_gateway_prod" />
                        </div>
                        <div className="space-y-2">
                            <Label>Port</Label>
                            <Input value="27017" />
                        </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                        <div className="flex items-center gap-4">
                            <div className="p-2 bg-green-500 rounded-full">
                                <Database className="h-6 w-6 text-white"/>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">Connection Healthy</h3>
                                <p className="text-sm text-muted-foreground">Latency: 45ms</p>
                            </div>
                        </div>
                        <Button variant="outline">Test Connection</Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
