import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Globe,
  Plus,
  Server,
  Users,
  Settings,
  Activity,
  Shield,
  Search,
  MoreVertical,
  BarChart3,
  Globe2,
  Mail,
  Phone
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

// Mock Data
const domains = [
  { id: 1, name: "customer1.sip.com", status: "Active", users: 12, concurrent_calls: 3, plan: "Pro" },
  { id: 2, name: "office-ny.voip.net", status: "Active", users: 45, concurrent_calls: 12, plan: "Enterprise" },
  { id: 3, name: "test-env.dev.local", status: "Maintenance", users: 5, concurrent_calls: 0, plan: "Basic" },
];

const users = [
  { id: 101, name: "John Doe", extension: "1001", domain: "customer1.sip.com", status: "Online" },
  { id: 102, name: "Jane Smith", extension: "1002", domain: "customer1.sip.com", status: "Offline" },
  { id: 201, name: "Support Desk", extension: "2000", domain: "office-ny.voip.net", status: "Busy" },
];

export default function VoIPDomainPage() {
  const [activeTab, setActiveTab] = useState("domains");

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-6rem)]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <Globe2 className="h-8 w-8 text-indigo-600" />
            </div>
            VoIP Domain Manager
          </h1>
          <p className="text-muted-foreground mt-1">
            Multi-tenant SIP domain hosting and subscriber management.
          </p>
        </div>
        <div className="flex items-center gap-2">
            <Button>
                <Plus className="h-4 w-4 mr-2" /> New Domain
            </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between border-b pb-4 mb-4">
          <TabsList>
            <TabsTrigger value="domains" className="gap-2"><Globe className="h-4 w-4" /> Domains</TabsTrigger>
            <TabsTrigger value="subscribers" className="gap-2"><Users className="h-4 w-4" /> Subscribers</TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2"><BarChart3 className="h-4 w-4" /> Analytics</TabsTrigger>
            <TabsTrigger value="settings" className="gap-2"><Settings className="h-4 w-4" /> Global Settings</TabsTrigger>
          </TabsList>
        </div>

        {/* Domains Tab */}
        <TabsContent value="domains" className="flex-1 overflow-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {domains.map((domain) => (
                    <Card key={domain.id} className="hover:border-indigo-500/50 transition-colors cursor-pointer">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <div className="p-2 bg-muted rounded-full">
                                    <Server className="h-5 w-5 text-indigo-500" />
                                </div>
                                <Badge variant={domain.status === 'Active' ? 'default' : 'secondary'} className={domain.status === 'Active' ? 'bg-green-500' : ''}>
                                    {domain.status}
                                </Badge>
                            </div>
                            <CardTitle className="mt-4 text-lg">{domain.name}</CardTitle>
                            <CardDescription>{domain.plan} Plan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Users</p>
                                        <p className="font-semibold">{domain.users}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Active Calls</p>
                                        <p className="font-semibold">{domain.concurrent_calls}</p>
                                    </div>
                                </div>
                                <div className="pt-4 border-t flex gap-2">
                                    <Button variant="outline" size="sm" className="flex-1">Configure</Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4"/></Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                
                <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center bg-muted/20 hover:bg-muted/30 transition-colors min-h-[200px] cursor-pointer">
                   <div className="p-4 rounded-full bg-background border shadow-sm mb-4">
                     <Plus className="h-6 w-6 text-muted-foreground" />
                   </div>
                   <h3 className="text-lg font-semibold">Add Tenant</h3>
                   <p className="text-sm text-muted-foreground max-w-xs mt-2">
                     Provision a new SIP domain environment.
                   </p>
                </Card>
            </div>
        </TabsContent>

        {/* Subscribers Tab */}
        <TabsContent value="subscribers" className="flex-1 overflow-auto">
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Global Subscriber List</CardTitle>
                            <CardDescription>Manage users across all domains</CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search user or extension..." className="pl-8 w-64" />
                            </div>
                            <Button><Plus className="h-4 w-4 mr-2"/> Add User</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Extension</TableHead>
                                <TableHead>Domain</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        {user.name}
                                    </TableCell>
                                    <TableCell className="font-mono">{user.extension}</TableCell>
                                    <TableCell>{user.domain}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${
                                                user.status === 'Online' ? 'bg-green-500' : 
                                                user.status === 'Busy' ? 'bg-orange-500' : 'bg-gray-300'
                                            }`} />
                                            {user.status}
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

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="flex-1 overflow-auto">
             <Card>
                <CardHeader>
                    <CardTitle>Platform Usage</CardTitle>
                    <CardDescription>Aggregate statistics across all tenants</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Total Concurrent Calls (15 / 100)</span>
                                <span className="text-muted-foreground">15%</span>
                            </div>
                            <Progress value={15} className="h-2" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Registered Endpoints (62 / 500)</span>
                                <span className="text-muted-foreground">12.4%</span>
                            </div>
                            <Progress value={12.4} className="h-2" />
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span>Bandwidth Usage (45 Mbps)</span>
                                <span className="text-muted-foreground">Normal</span>
                            </div>
                            <Progress value={45} className="h-2" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
