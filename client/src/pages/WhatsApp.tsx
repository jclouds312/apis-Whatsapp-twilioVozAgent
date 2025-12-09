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
  LayoutGrid, List, CheckCircle2, AlertCircle, RefreshCw
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
} from "@/components/ui/dropdown-menu";

// Mock Data for Multi-Tenant Structure
const clients = [
  { id: 1, name: "Acme Corp", plan: "Enterprise", status: "active", credits: 50000 },
  { id: 2, name: "Global Marketing Ltd", plan: "Pro", status: "active", credits: 12400 },
  { id: 3, name: "TechStart Inc", plan: "Starter", status: "warning", credits: 150 },
];

const campaigns = [
  { id: 1, name: "Black Friday Sale", status: "active", sent: 12500, delivered: 12450, read: 9800, type: "Marketing" },
  { id: 2, name: "Welcome Series", status: "paused", sent: 3400, delivered: 3390, read: 2800, type: "Utility" },
  { id: 3, name: "Service Update", status: "scheduled", sent: 0, delivered: 0, read: 0, type: "Utility" },
];

const conversations = [
  { id: 1, name: "Alice Freeman", phone: "+1 555-0123", lastMsg: "Interested in the Enterprise plan", time: "10:42 AM", unread: 2, status: "open", agent: "Bot" },
  { id: 2, name: "Bob Smith", phone: "+1 555-0124", lastMsg: "Thanks for the help!", time: "Yesterday", unread: 0, status: "resolved", agent: "John D." },
  { id: 3, name: "Carol White", phone: "+1 555-0125", lastMsg: "When is the next webinar?", time: "Mon", unread: 1, status: "open", agent: "Sarah M." },
];

export default function WhatsAppPage() {
  const [selectedClient, setSelectedClient] = useState(clients[0].id.toString());
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="space-y-6">
      {/* Top Bar: Client Selection & Global Stats */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card/50 p-4 rounded-xl border border-primary/10 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-lg bg-green-500/20 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-green-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold">WhatsApp Marketing Hub</h1>
            <p className="text-xs text-muted-foreground">Manage campaigns, templates, and support</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex-1 md:w-64">
             <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger className="bg-background/50">
                <SelectValue placeholder="Select Client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id.toString()}>
                    <div className="flex justify-between items-center w-full gap-2">
                      <span>{client.name}</span>
                      <Badge variant={client.status === 'warning' ? 'destructive' : 'secondary'} className="text-[10px]">
                        {client.plan}
                      </Badge>
                    </div>
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
        <TabsList className="bg-card/50 border border-primary/10 p-1 h-auto grid grid-cols-2 md:inline-flex md:grid-cols-none">
          <TabsTrigger value="dashboard" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <LayoutGrid className="h-4 w-4 mr-2" /> Dashboard
          </TabsTrigger>
          <TabsTrigger value="inbox" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <MessageSquare className="h-4 w-4 mr-2" /> Team Inbox
          </TabsTrigger>
          <TabsTrigger value="campaigns" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Send className="h-4 w-4 mr-2" /> Campaigns
          </TabsTrigger>
          <TabsTrigger value="contacts" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Users className="h-4 w-4 mr-2" /> Audience
          </TabsTrigger>
          <TabsTrigger value="templates" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <FileText className="h-4 w-4 mr-2" /> Templates
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            <Settings className="h-4 w-4 mr-2" /> Configuration
          </TabsTrigger>
        </TabsList>

        {/* DASHBOARD TAB */}
        <TabsContent value="dashboard" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
                <Send className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">45,231</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">98.2%</div>
                <p className="text-xs text-muted-foreground">+1.2% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Read Rate</CardTitle>
                <ArrowUpRight className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-500">84.5%</div>
                <p className="text-xs text-muted-foreground">+4.3% from last month</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversations</CardTitle>
                <MessageSquare className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">1,203</div>
                <p className="text-xs text-muted-foreground">342 active now</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
                <CardDescription>Performance overview of last 3 blasts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {campaigns.map(camp => (
                    <div key={camp.id} className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <div className="font-medium">{camp.name}</div>
                        <div className="text-muted-foreground">{((camp.read / camp.sent) * 100).toFixed(1)}% Read Rate</div>
                      </div>
                      <Progress value={(camp.delivered / camp.sent) * 100} className="h-2 bg-muted/50" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{camp.sent.toLocaleString()} Sent</span>
                        <span>{camp.read.toLocaleString()} Read</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/10">
               <CardHeader>
                <CardTitle>System Health</CardTitle>
                <CardDescription>WhatsApp Business API Status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-500/5 border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-medium">Meta API Gateway</span>
                  </div>
                  <Badge variant="outline" className="text-green-500 border-green-500/30">Operational</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-green-500/5 border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="font-medium">Webhook Processor</span>
                  </div>
                  <Badge variant="outline" className="text-green-500 border-green-500/30">Operational</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg bg-yellow-500/5 border-yellow-500/20">
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-yellow-500" />
                    <span className="font-medium">Media Upload Server</span>
                  </div>
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500/30">High Latency</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* INBOX TAB */}
        <TabsContent value="inbox" className="h-[600px] flex gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Chat Sidebar */}
          <Card className="w-80 flex flex-col border-primary/10">
            <div className="p-4 border-b border-primary/10 space-y-4">
               <div className="flex items-center justify-between">
                 <h2 className="font-semibold">Inbox</h2>
                 <div className="flex gap-2">
                   <Button size="icon" variant="ghost" className="h-8 w-8"><Filter className="h-4 w-4" /></Button>
                   <Button size="icon" variant="ghost" className="h-8 w-8"><Plus className="h-4 w-4" /></Button>
                 </div>
               </div>
               <div className="relative">
                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search messages..." className="pl-8 h-9" />
               </div>
               <div className="flex gap-2">
                 <Badge variant="secondary" className="cursor-pointer">Open</Badge>
                 <Badge variant="outline" className="cursor-pointer text-muted-foreground">Resolved</Badge>
                 <Badge variant="outline" className="cursor-pointer text-muted-foreground">Bot</Badge>
               </div>
            </div>
            <ScrollArea className="flex-1">
              <div className="flex flex-col gap-1 p-2">
                {conversations.map(chat => (
                  <div key={chat.id} className="p-3 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">{chat.name}</span>
                      <span className="text-[10px] text-muted-foreground">{chat.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{chat.lastMsg}</p>
                    <div className="flex items-center justify-between">
                       <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">{chat.status}</Badge>
                       {chat.unread > 0 && <Badge className="h-5 w-5 rounded-full p-0 flex items-center justify-center bg-green-500">{chat.unread}</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
          
          {/* Chat Window */}
          <Card className="flex-1 flex flex-col border-primary/10 bg-muted/10">
             <div className="p-4 border-b border-primary/10 flex justify-between items-center bg-card/50">
               <div className="flex items-center gap-3">
                 <Avatar>
                   <AvatarImage src="https://github.com/shadcn.png" />
                   <AvatarFallback>AF</AvatarFallback>
                 </Avatar>
                 <div>
                   <h3 className="font-semibold text-sm">Alice Freeman</h3>
                   <p className="text-xs text-muted-foreground">+1 (555) 0123 • Active now</p>
                 </div>
               </div>
               <div className="flex gap-2">
                 <Button variant="ghost" size="icon"><Phone className="h-4 w-4" /></Button>
                 <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
               </div>
             </div>

             <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-5">
               {/* Messages Mockup */}
               <div className="flex justify-start">
                 <div className="bg-card border p-3 rounded-lg rounded-tl-none max-w-[70%] text-sm">
                   Hi, I'm interested in the Enterprise plan. Can you tell me more?
                   <span className="block text-[10px] text-muted-foreground mt-1">10:42 AM</span>
                 </div>
               </div>
               <div className="flex justify-end">
                 <div className="bg-green-600 text-white p-3 rounded-lg rounded-tr-none max-w-[70%] text-sm shadow-md">
                   Hello Alice! Absolutely. Our Enterprise plan includes unlimited agents, custom workflows, and dedicated support.
                   <span className="block text-[10px] text-white/70 mt-1 text-right">10:43 AM</span>
                 </div>
               </div>
             </div>

             <div className="p-4 bg-card/50 border-t border-primary/10">
               <div className="flex gap-2">
                 <Button variant="ghost" size="icon"><Smile className="h-5 w-5 text-muted-foreground" /></Button>
                 <Button variant="ghost" size="icon"><Paperclip className="h-5 w-5 text-muted-foreground" /></Button>
                 <Input className="flex-1 bg-background" placeholder="Type a message..." />
                 <Button className="bg-green-600 hover:bg-green-700 text-white"><Send className="h-4 w-4" /></Button>
               </div>
             </div>
          </Card>
        </TabsContent>
        
        {/* CAMPAIGNS TAB */}
        <TabsContent value="campaigns" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="flex justify-between items-center">
             <div className="space-y-1">
               <h2 className="text-lg font-semibold">Marketing Campaigns</h2>
               <p className="text-sm text-muted-foreground">Manage your broadcast lists and scheduled messages.</p>
             </div>
             <Button><Plus className="h-4 w-4 mr-2" /> Create Campaign</Button>
           </div>
           
           <Card className="border-primary/10">
             <CardContent className="p-0">
               <div className="rounded-md border border-primary/10">
                  <div className="grid grid-cols-6 gap-4 p-4 font-medium text-sm bg-muted/30 border-b border-primary/10">
                    <div className="col-span-2">Campaign Name</div>
                    <div>Status</div>
                    <div>Type</div>
                    <div>Sent / Read</div>
                    <div className="text-right">Actions</div>
                  </div>
                  {campaigns.map((camp) => (
                    <div key={camp.id} className="grid grid-cols-6 gap-4 p-4 text-sm items-center hover:bg-muted/10 transition-colors border-b border-primary/5 last:border-0">
                      <div className="col-span-2 font-medium">{camp.name}</div>
                      <div>
                        <Badge variant={camp.status === 'active' ? 'default' : 'secondary'} className={camp.status === 'active' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : ''}>
                          {camp.status}
                        </Badge>
                      </div>
                      <div className="text-muted-foreground">{camp.type}</div>
                      <div className="text-muted-foreground">
                        {camp.sent.toLocaleString()} <span className="text-xs mx-1">/</span> <span className="text-green-500">{camp.read.toLocaleString()}</span>
                      </div>
                      <div className="text-right">
                        <Button variant="ghost" size="sm">Edit</Button>
                      </div>
                    </div>
                  ))}
               </div>
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
