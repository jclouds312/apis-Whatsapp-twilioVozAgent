import { useState } from "react";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  MessageSquare, Users, Send, BarChart3, Settings, 
  Plus, Search, Phone, MoreVertical, FileText, 
  Image as ImageIcon, Paperclip, Smile,
  Filter, Calendar, ArrowUpRight, TrendingUp,
  LayoutGrid, List, CheckCircle2, AlertCircle, RefreshCw,
  Building2, Shield, UserPlus, Mail, CreditCard, LogOut,
  Briefcase, Check
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useClients, useCampaigns, useContacts, useConversations } from "@/hooks/useWhatsAppData";

const teamMembers = [
  { id: 1, name: "John Doe", role: "Admin", email: "john@nexus.com", status: "active", clients: ["All"] },
  { id: 2, name: "Sarah Smith", role: "Manager", email: "sarah@nexus.com", status: "active", clients: ["Acme Corp", "TechStart"] },
  { id: 3, name: "Mike Johnson", role: "Agent", email: "mike@nexus.com", status: "offline", clients: ["Global Marketing"] },
];

export default function WhatsAppPage() {
  const [selectedClient, setSelectedClient] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("dashboard");
  
  const { data: clients = [], isLoading: loadingClients } = useClients();
  const { data: campaigns = [], isLoading: loadingCampaigns } = useCampaigns(selectedClient !== "all" ? selectedClient : undefined);
  const { data: contacts = [] } = useContacts(selectedClient !== "all" ? selectedClient : undefined);
  const { data: conversations = [] } = useConversations(selectedClient !== "all" ? selectedClient : undefined);

  return (
    <div className="space-y-6">
      {/* Top Bar: Client Context */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card/50 p-4 rounded-xl border border-primary/10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">WhatsApp Marketing Hub</h1>
            <p className="text-xs text-muted-foreground">Platform Administration & Client Management</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-muted/30 px-3 py-1.5 rounded-lg border border-primary/10">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Current View:</span>
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="w-[200px] h-8 bg-transparent border-none focus:ring-0">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Global Admin View</SelectItem>
                <DropdownMenuSeparator />
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20">
            <Plus className="h-4 w-4 mr-2" /> New Campaign
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="border-b border-primary/10">
          <TabsList className="bg-transparent h-auto p-0 gap-6">
            <TabsTrigger value="dashboard" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="clients" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Client Management
            </TabsTrigger>
            <TabsTrigger value="team" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Team & Agents
            </TabsTrigger>
            <TabsTrigger value="inbox" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Unified Inbox
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Campaigns
            </TabsTrigger>
            <TabsTrigger value="settings" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-2 py-3">
              Platform Settings
            </TabsTrigger>
          </TabsList>
        </div>

        {/* DASHBOARD CONTENT */}
        <TabsContent value="dashboard" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Messages</CardTitle>
                <Send className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2.4M</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Clients</CardTitle>
                <Building2 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">142</div>
                <p className="text-xs text-muted-foreground">+8 new this week</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">System Revenue</CardTitle>
                <CreditCard className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231</div>
                <p className="text-xs text-muted-foreground">+20.1% vs last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-card to-muted/20 border-primary/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Agents</CardTitle>
                <Users className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">Currently online</p>
              </CardContent>
            </Card>
           </div>
           
           <div className="grid md:grid-cols-2 gap-6">
             <Card className="border-primary/10">
               <CardHeader>
                 <CardTitle>Recent Client Activity</CardTitle>
                 <CardDescription>Latest actions across all tenants</CardDescription>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   {[
                     { client: "Acme Corp", action: "Started Campaign 'Summer Sale'", time: "10 mins ago" },
                     { client: "TechStart", action: "Added new agent", time: "1 hour ago" },
                     { client: "Global Mkt", action: "Topped up 5000 credits", time: "2 hours ago" },
                     { client: "Acme Corp", action: "Updated WhatsApp Template", time: "5 hours ago" },
                   ].map((log, i) => (
                     <div key={i} className="flex items-center justify-between text-sm border-b border-primary/5 last:border-0 pb-2 last:pb-0">
                        <div>
                          <span className="font-medium text-primary">{log.client}</span>
                          <p className="text-muted-foreground">{log.action}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{log.time}</span>
                     </div>
                   ))}
                 </div>
               </CardContent>
             </Card>

             <Card className="border-primary/10">
               <CardHeader>
                 <CardTitle>Platform Health</CardTitle>
                 <CardDescription>System status overview</CardDescription>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>API Latency</span>
                      <span className="text-green-500">45ms</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Message Queue</span>
                      <span className="text-blue-500">120 pending</span>
                    </div>
                    <Progress value={30} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Webhook Success Rate</span>
                      <span className="text-green-500">99.9%</span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
               </CardContent>
             </Card>
           </div>
        </TabsContent>

        {/* CLIENTS MANAGEMENT TAB */}
        <TabsContent value="clients" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Client Directory</h2>
              <p className="text-sm text-muted-foreground">Manage companies, subscriptions, and quotas.</p>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button><Building2 className="mr-2 h-4 w-4" /> Onboard Client</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Onboard New Client</DialogTitle>
                  <DialogDescription>Create a new workspace for a client company.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Company</Label>
                    <Input id="name" className="col-span-3" placeholder="Acme Inc." />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">Plan</Label>
                    <Select defaultValue="pro">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select plan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter ($99/mo)</SelectItem>
                        <SelectItem value="pro">Pro ($299/mo)</SelectItem>
                        <SelectItem value="enterprise">Enterprise (Custom)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label className="text-right">WhatsApp #</Label>
                    <Input id="phone" className="col-span-3" placeholder="+1..." />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create Workspace</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <Card className="border-primary/10">
            <div className="rounded-md">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium text-sm bg-muted/30 border-b border-primary/10">
                <div className="col-span-3">Company</div>
                <div className="col-span-2">Plan</div>
                <div className="col-span-2">WhatsApp Number</div>
                <div className="col-span-2">Credits</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2 text-right">Actions</div>
              </div>
              <div className="max-h-[600px] overflow-auto">
                {loadingClients ? (
                  <div className="p-8 text-center text-muted-foreground">Loading clients...</div>
                ) : clients.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No clients yet. Create your first client above.</div>
                ) : (
                  clients.map((client) => (
                    <div key={client.id} className="grid grid-cols-12 gap-4 p-4 text-sm items-center hover:bg-muted/10 transition-colors border-b border-primary/5 last:border-0">
                      <div className="col-span-3 font-medium flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {client.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          {client.name}
                          <div className="text-xs text-muted-foreground">Active</div>
                        </div>
                      </div>
                      <div className="col-span-2">
                        <Badge variant="outline" className="font-normal capitalize">{client.plan || 'starter'}</Badge>
                      </div>
                      <div className="col-span-2 text-muted-foreground font-mono text-xs">
                        {client.phoneNumber || 'Not set'}
                      </div>
                      <div className="col-span-2">
                         <span className={parseInt(client.credits || '0') < 500 ? "text-red-500 font-bold" : ""}>
                           {parseInt(client.credits || '0').toLocaleString()}
                         </span>
                      </div>
                      <div className="col-span-1">
                        <Badge 
                          variant={client.status === 'active' ? 'default' : client.status === 'inactive' ? 'secondary' : 'destructive'} 
                          className="text-[10px]"
                        >
                          {client.status}
                        </Badge>
                      </div>
                      <div className="col-span-2 text-right flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem><UserPlus className="mr-2 h-4 w-4" /> Add User</DropdownMenuItem>
                            <DropdownMenuItem><CreditCard className="mr-2 h-4 w-4" /> Add Credits</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-500"><LogOut className="mr-2 h-4 w-4" /> Suspend</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* TEAM MANAGEMENT TAB */}
        <TabsContent value="team" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">Team & Agents</h2>
              <p className="text-sm text-muted-foreground">Manage support agents and their access permissions.</p>
            </div>
            <Button><UserPlus className="mr-2 h-4 w-4" /> Add Team Member</Button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
             {teamMembers.map((member) => (
               <Card key={member.id} className="border-primary/10 overflow-hidden group">
                 <div className="h-2 bg-gradient-to-r from-primary to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <CardContent className="p-6">
                   <div className="flex items-start justify-between mb-4">
                     <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-primary/20">
                          <AvatarFallback>{member.name.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{member.name}</h3>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {member.email}
                          </p>
                        </div>
                     </div>
                     <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>{member.role}</Badge>
                   </div>
                   
                   <div className="space-y-3">
                     <div>
                       <div className="text-xs text-muted-foreground mb-1">Assigned Clients</div>
                       <div className="flex flex-wrap gap-1">
                         {member.clients.map((c, i) => (
                           <Badge key={i} variant="outline" className="text-[10px] bg-muted/50">{c}</Badge>
                         ))}
                       </div>
                     </div>
                   </div>

                   <div className="mt-6 flex gap-2">
                     <Button variant="outline" size="sm" className="flex-1">Edit Access</Button>
                     <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-500/10"><LogOut className="h-4 w-4" /></Button>
                   </div>
                 </CardContent>
               </Card>
             ))}
             
             {/* Add New Card Placeholder */}
             <Card className="border-primary/10 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/10 transition-colors min-h-[200px]">
               <div className="text-center space-y-2">
                 <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center mx-auto">
                   <Plus className="h-6 w-6 text-muted-foreground" />
                 </div>
                 <p className="font-medium text-muted-foreground">Add New Agent</p>
               </div>
             </Card>
          </div>
        </TabsContent>
        
        {/* INBOX TAB (Reused but context-aware) */}
        <TabsContent value="inbox" className="h-[600px] flex gap-4 animate-in fade-in zoom-in-95 duration-300">
           {/* Reusing existing inbox structure for simplicity, in a real app this would be more complex */}
           <Card className="w-80 flex flex-col border-primary/10">
             <div className="p-4 border-b border-primary/10">
               <h3 className="font-semibold mb-2">Unified Inbox</h3>
               <Input placeholder="Search global messages..." className="bg-muted/30" />
             </div>
             <ScrollArea className="flex-1">
               {conversations.map(chat => (
                  <div key={chat.id} className="p-3 hover:bg-muted/50 cursor-pointer border-b border-primary/5">
                    <div className="flex justify-between">
                      <span className="font-medium">{chat.name}</span>
                      <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1">{chat.lastMsg}</p>
                    <div className="flex justify-between items-center mt-2">
                      <Badge variant="outline" className="text-[10px]">{chat.status}</Badge>
                      <span className="text-[10px] text-muted-foreground">Agent: {chat.agent}</span>
                    </div>
                  </div>
               ))}
             </ScrollArea>
           </Card>
           
           <Card className="flex-1 flex items-center justify-center border-primary/10 bg-muted/5">
             <div className="text-center text-muted-foreground">
               <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-20" />
               <p>Select a conversation to start chatting</p>
               <p className="text-xs mt-2">You are viewing the unified inbox for {selectedClient === 'all' ? 'All Clients' : clients.find(c => c.id.toString() === selectedClient)?.name}</p>
             </div>
           </Card>
        </TabsContent>

        {/* SETTINGS TAB (SaaS Admin) */}
        <TabsContent value="settings" className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
           <div className="grid gap-6 md:grid-cols-2">
             <div className="space-y-6">
                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-primary" />
                      Platform White-Labeling
                    </CardTitle>
                    <CardDescription>Customize the branding for your sub-clients.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Platform Name</Label>
                      <Input defaultValue="Nexus Marketing" />
                    </div>
                    <div className="space-y-2">
                      <Label>Custom Domain (CNAME)</Label>
                      <div className="flex gap-2">
                        <Input defaultValue="app.nexus-marketing.com" />
                        <Button variant="outline">Verify</Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                       <div className="space-y-0.5">
                         <Label>Show "Powered by"</Label>
                         <p className="text-xs text-muted-foreground">Remove footer branding</p>
                       </div>
                       <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-green-500" />
                      Reseller Pricing & Billing
                    </CardTitle>
                    <CardDescription>Set your margins and billing rules.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                         <Label>Cost per Message (Base)</Label>
                         <Input disabled value="$0.005" className="bg-muted" />
                       </div>
                       <div className="space-y-2">
                         <Label>Your Markup (%)</Label>
                         <Input defaultValue="150" type="number" />
                       </div>
                     </div>
                     <div className="p-3 bg-muted/30 rounded-lg text-sm">
                       <div className="flex justify-between mb-1">
                         <span>Final Client Price:</span>
                         <span className="font-bold text-green-500">$0.0125 / msg</span>
                       </div>
                       <div className="flex justify-between">
                         <span>Estimated Profit/10k:</span>
                         <span className="font-bold text-green-500">$75.00</span>
                       </div>
                     </div>
                  </CardContent>
                </Card>
             </div>

             <div className="space-y-6">
                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-purple-500" />
                      API Distribution Controls
                    </CardTitle>
                    <CardDescription>Manage global API access policies.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default Rate Limit (RPM)</Label>
                      <Select defaultValue="1000">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value="100">100 req/min (Starter)</SelectItem>
                           <SelectItem value="1000">1,000 req/min (Pro)</SelectItem>
                           <SelectItem value="10000">10,000 req/min (Enterprise)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Global Webhook Endpoint</Label>
                      <Input defaultValue="https://api.nexus.com/v1/webhooks/router" />
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Allow Client API Keys</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Require IP Whitelisting</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>Sandbox Mode Access</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20">
                      <RefreshCw className="mr-2 h-4 w-4" /> Sync Policies
                    </Button>
                  </CardFooter>
                </Card>
             </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
