import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  MessageSquare, Send, Plus, MoreVertical, Search,
  Image as ImageIcon, Paperclip, Smile, Phone, Video,
  Check, CheckCheck, Clock, User, Settings, Bell,
  FileText, Activity, AlertCircle, RefreshCw, Save,
  Code, Terminal, Copy, MapPin, List, LayoutTemplate
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const contacts = [
  { id: 1, name: "Alice Freeman", status: "online", lastMessage: "Thanks for the update!", time: "10:42 AM", unread: 2, avatar: "AF" },
  { id: 2, name: "Tech Support", status: "offline", lastMessage: "Ticket #4922 resolved", time: "Yesterday", unread: 0, avatar: "TS" },
  { id: 3, name: "John Smith", status: "online", lastMessage: "Can we schedule a demo?", time: "Yesterday", unread: 0, avatar: "JS" },
  { id: 4, name: "Marketing Team", status: "online", lastMessage: "New campaign assets ready", time: "Mon", unread: 5, avatar: "MT" },
];

const messages = [
  { id: 1, sender: "them", text: "Hi there! I'm interested in your enterprise plan.", time: "10:30 AM", status: "read" },
  { id: 2, sender: "me", text: "Hello! Thanks for reaching out. I'd be happy to help with that.", time: "10:32 AM", status: "read" },
  { id: 3, sender: "me", text: "What specific features are you looking for?", time: "10:32 AM", status: "read" },
  { id: 4, sender: "them", text: "We need high-volume WhatsApp messaging and CRM integration.", time: "10:35 AM", status: "read" },
  { id: 5, sender: "me", text: "Perfect, our Enterprise plan covers exactly that. Let me send you the brochure.", time: "10:36 AM", status: "read" },
  { id: 6, sender: "them", text: "Thanks for the update!", time: "10:42 AM", status: "read" },
];

const notificationSettings = [
    { id: "new_invoice", label: "New Invoice Created", description: "Send notification when a new invoice is generated", enabled: true },
    { id: "ticket_reply", label: "Support Ticket Reply", description: "Notify customer when agent replies to ticket", enabled: true },
    { id: "service_activation", label: "Service Activation", description: "Send welcome message on service activation", enabled: true },
    { id: "payment_received", label: "Payment Received", description: "Confirm payment receipt via WhatsApp", enabled: false },
    { id: "domain_renewal", label: "Domain Renewal", description: "Remind customer about upcoming domain expiry", enabled: true },
];

const logs = [
    { id: 1, event: "Message Sent", recipient: "+1 (555) 123-4567", template: "invoice_created", status: "Delivered", time: "2 min ago" },
    { id: 2, event: "Message Failed", recipient: "+1 (555) 987-6543", template: "ticket_reply", status: "Failed", time: "15 min ago" },
    { id: 3, event: "Message Sent", recipient: "+1 (555) 000-1111", template: "welcome_msg", status: "Read", time: "1 hour ago" },
];

const codeSnippets = {
    text: `import { Text } from "whatsapp-api-js/messages";\n\nconst text_message = new Text("Hello World");\n// Send this message using the API client`,
    interactive_buttons: `import { Interactive, ActionButtons, Button, Body } from "whatsapp-api-js/messages";\n\nconst buttons_message = new Interactive(\n    new ActionButtons(\n        new Button("reply_yes", "Yes"),\n        new Button("reply_no", "No")\n    ),\n    new Body("Are you satisfied with our service?")\n);`,
    location: `import { Interactive, ActionLocation, Body } from "whatsapp-api-js/messages";\n\nconst location_request = new Interactive(\n    new ActionLocation(),\n    new Body("Please share your delivery location")\n);`,
    template: `import { Template, HeaderComponent, HeaderParameter, BodyComponent, BodyParameter, Currency } from "whatsapp-api-js/messages";\n\nconst invoice_template = new Template(\n    "invoice_update",\n    "en_US",\n    new HeaderComponent(\n        new HeaderParameter("INV-2023-001")\n    ),\n    new BodyComponent(\n        new BodyParameter("John Doe"),\n        new BodyParameter(new Currency(150.00, "USD", "$150.00"))\n    )\n);`
};

export default function WhatsApp() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messageInput, setMessageInput] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [messageType, setMessageType] = useState("text");
  const [botStatus, setBotStatus] = useState<string>("disconnected");
  const [qrCode, setQrCode] = useState<string>("");
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    checkBotStatus();
    const interval = setInterval(checkBotStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const checkBotStatus = async () => {
    try {
      const response = await fetch('/api/whatsapp/status');
      const data = await response.json();
      setBotStatus(data.status);
      
      if (data.status === 'qr_ready') {
        const qrResponse = await fetch('/api/whatsapp/qr');
        const qrData = await qrResponse.json();
        setQrCode(qrData.qrCode);
      } else if (data.status === 'connected') {
        setQrCode('');
      }
    } catch (error) {
      console.error('Error checking bot status:', error);
    }
  };

  const connectBot = async () => {
    setIsConnecting(true);
    try {
      await fetch('/api/whatsapp/connect', { method: 'POST' });
    } catch (error) {
      console.error('Error connecting bot:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectBot = async () => {
    try {
      await fetch('/api/whatsapp/disconnect', { method: 'POST' });
      setBotStatus('disconnected');
      setQrCode('');
    } catch (error) {
      console.error('Error disconnecting bot:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4">
      {/* Module Header with Tabs */}
      <div className="flex items-center justify-between">
         <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-green-500" />
            WhatsApp Manager
         </h1>
         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
                <TabsTrigger value="chat" className="flex items-center gap-2"><MessageSquare className="h-4 w-4"/> Chat Console</TabsTrigger>
                <TabsTrigger value="dev" className="flex items-center gap-2"><Code className="h-4 w-4"/> Developer API</TabsTrigger>
                <TabsTrigger value="settings" className="flex items-center gap-2"><Settings className="h-4 w-4"/> WHMCS Settings</TabsTrigger>
                <TabsTrigger value="logs" className="flex items-center gap-2"><FileText className="h-4 w-4"/> Logs</TabsTrigger>
            </TabsList>
         </Tabs>
      </div>

      {activeTab === "chat" && (
      <div className="flex-1 flex gap-4 overflow-hidden">
        {/* Contacts Sidebar */}
        <Card className="w-80 flex flex-col bg-card/50 backdrop-blur-sm border-primary/10">
            <div className="p-4 border-b border-primary/10 space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="font-semibold flex items-center gap-2">
                Active Chats
                </h2>
                <div className="flex gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
                </div>
            </div>
            <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search chats..." className="pl-8 bg-background/50" />
            </div>
            </div>
            <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
                {contacts.map((contact) => (
                <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-3 rounded-lg cursor-pointer flex gap-3 transition-colors ${
                    selectedContact.id === contact.id
                        ? "bg-primary/10 border border-primary/20"
                        : "hover:bg-muted/50"
                    }`}
                >
                    <div className="relative">
                    <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary font-medium">
                        {contact.avatar}
                        </AvatarFallback>
                    </Avatar>
                    {contact.status === "online" && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 border-2 border-background bg-green-500 rounded-full" />
                    )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                    <div className="flex justify-between items-start">
                        <span className="font-medium truncate">{contact.name}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">{contact.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-1">
                        {contact.lastMessage}
                    </p>
                    </div>
                    {contact.unread > 0 && (
                    <div className="flex flex-col justify-center">
                        <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-green-500">
                        {contact.unread}
                        </Badge>
                    </div>
                    )}
                </div>
                ))}
            </div>
            </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm border-primary/10 overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-primary/10 flex justify-between items-center bg-background/30">
            <div className="flex items-center gap-3">
                <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-purple-500/20 text-primary">
                    {selectedContact.avatar}
                </AvatarFallback>
                </Avatar>
                <div>
                <h3 className="font-semibold">{selectedContact.name}</h3>
                <p className="text-xs text-green-500 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online via WhatsApp Business API
                </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button size="icon" variant="ghost">
                <Phone className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                <Video className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost">
                <Search className="h-4 w-4" />
                </Button>
            </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-5">
            <div className="space-y-4">
                <div className="flex justify-center my-4">
                <Badge variant="outline" className="bg-background/50 backdrop-blur text-xs font-normal text-muted-foreground">
                    Today
                </Badge>
                </div>
                {messages.map((msg) => (
                <div
                    key={msg.id}
                    className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                >
                    <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                        msg.sender === "me"
                        ? "bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-tr-none"
                        : "bg-card border border-border rounded-tl-none"
                    }`}
                    >
                    <p className="text-sm">{msg.text}</p>
                    <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                        msg.sender === "me" ? "text-white/70" : "text-muted-foreground"
                    }`}>
                        {msg.time}
                        {msg.sender === "me" && <CheckCheck className="h-3 w-3" />}
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="p-4 bg-background/50 backdrop-blur border-t border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                     <Select value={messageType} onValueChange={setMessageType}>
                        <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue placeholder="Message Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="text">Text Message</SelectItem>
                            <SelectItem value="template">Template (HSM)</SelectItem>
                            <SelectItem value="interactive">Interactive Buttons</SelectItem>
                            <SelectItem value="location">Location Request</SelectItem>
                            <SelectItem value="list">List Message</SelectItem>
                        </SelectContent>
                     </Select>
                     {messageType !== 'text' && (
                         <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                             {messageType === 'template' && "Uses 'invoice_update' template"}
                             {messageType === 'interactive' && "Adds Yes/No buttons"}
                             {messageType === 'location' && "Requesting location"}
                         </Badge>
                     )}
                </div>
            <div className="flex items-end gap-2">
                <div className="flex gap-1 pb-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Smile className="h-5 w-5" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                    <Paperclip className="h-5 w-5" />
                </Button>
                </div>
                <div className="flex-1 bg-muted/30 rounded-2xl border border-input focus-within:ring-1 focus-within:ring-primary/50 transition-all flex items-center px-3 py-2">
                <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={messageType === 'text' ? "Type a message..." : `Configure ${messageType} parameters...`}
                    className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-24 text-sm"
                    rows={1}
                    style={{ minHeight: "24px" }}
                />
                </div>
                <Button
                size="icon"
                className="h-10 w-10 rounded-full bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/20 mb-1"
                >
                <Send className="h-4 w-4 text-white ml-0.5" />
                </Button>
            </div>
            <div className="flex justify-center mt-2">
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <LockIcon className="h-3 w-3" />
                End-to-end encrypted via WhatsApp Business API
                </span>
            </div>
            </div>
        </Card>
      </div>
      )}

      {activeTab === "dev" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full overflow-hidden">
             <Card className="flex flex-col h-full overflow-hidden">
                 <CardHeader>
                     <CardTitle>Interactive API Builder</CardTitle>
                     <CardDescription>Generate TypeScript code for the whatsapp-api-js library.</CardDescription>
                 </CardHeader>
                 <CardContent className="flex-1 overflow-auto space-y-6">
                     <div className="space-y-4">
                         <div className="space-y-2">
                             <Label>Message Type</Label>
                             <div className="grid grid-cols-2 gap-2">
                                 <Button variant="outline" className="justify-start" onClick={() => {}}>
                                     <LayoutTemplate className="h-4 w-4 mr-2" /> Templates
                                 </Button>
                                 <Button variant="outline" className="justify-start" onClick={() => {}}>
                                     <List className="h-4 w-4 mr-2" /> Interactive Lists
                                 </Button>
                                 <Button variant="outline" className="justify-start" onClick={() => {}}>
                                     <MapPin className="h-4 w-4 mr-2" /> Location
                                 </Button>
                                 <Button variant="outline" className="justify-start" onClick={() => {}}>
                                     <Activity className="h-4 w-4 mr-2" /> Flows
                                 </Button>
                             </div>
                         </div>
                         <Separator />
                         <div className="space-y-2">
                             <Label>Library Features</Label>
                             <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                 <li>Full TypeScript Support</li>
                                 <li>Helper classes for all message types</li>
                                 <li>Serverless compatible (Edge Runtime)</li>
                                 <li>Zero dependencies</li>
                             </ul>
                         </div>
                     </div>
                 </CardContent>
             </Card>

             <Card className="flex flex-col h-full overflow-hidden bg-[#1e1e1e] border-none text-white">
                 <div className="flex items-center justify-between px-4 py-2 bg-[#252526] border-b border-[#3e3e42]">
                     <span className="text-xs font-mono text-muted-foreground">example.ts</span>
                     <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-white">
                         <Copy className="h-3 w-3" />
                     </Button>
                 </div>
                 <ScrollArea className="flex-1">
                     <div className="p-4">
                         <div className="mb-6">
                             <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Sending a Template</h4>
                             <SyntaxHighlighter language="typescript" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0 }}>
                                 {codeSnippets.template}
                             </SyntaxHighlighter>
                         </div>
                         <div className="mb-6">
                             <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Interactive Buttons</h4>
                             <SyntaxHighlighter language="typescript" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0 }}>
                                 {codeSnippets.interactive_buttons}
                             </SyntaxHighlighter>
                         </div>
                         <div>
                             <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Location Request</h4>
                             <SyntaxHighlighter language="typescript" style={vscDarkPlus} customStyle={{ background: 'transparent', padding: 0 }}>
                                 {codeSnippets.location}
                             </SyntaxHighlighter>
                         </div>
                     </div>
                 </ScrollArea>
             </Card>
          </div>
      )}

      {activeTab === "settings" && (
        <div className="grid gap-6 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        Bot Connection
                        <Badge variant={botStatus === 'connected' ? 'default' : 'secondary'} 
                               className={botStatus === 'connected' ? 'bg-green-500' : ''}>
                            {botStatus}
                        </Badge>
                    </CardTitle>
                    <CardDescription>Connect your WhatsApp account via QR code</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {botStatus === 'disconnected' && (
                        <Button onClick={connectBot} disabled={isConnecting} className="w-full">
                            {isConnecting ? 'Connecting...' : 'Connect WhatsApp Bot'}
                        </Button>
                    )}
                    {botStatus === 'qr_ready' && qrCode && (
                        <div className="flex flex-col items-center gap-4">
                            <p className="text-sm text-muted-foreground text-center">
                                Scan this QR code with your WhatsApp mobile app
                            </p>
                            <img src={qrCode} alt="QR Code" className="w-64 h-64 border rounded-lg" />
                        </div>
                    )}
                    {botStatus === 'connected' && (
                        <div className="space-y-4">
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-sm text-green-500 font-medium">✓ WhatsApp Bot Connected</p>
                            </div>
                            <Button onClick={disconnectBot} variant="destructive" className="w-full">
                                Disconnect Bot
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Notification Triggers</CardTitle>
                    <CardDescription>Configure which WHMCS events trigger a WhatsApp notification.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {notificationSettings.map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between space-x-2">
                            <div className="space-y-0.5">
                                <Label className="text-base">{setting.label}</Label>
                                <p className="text-sm text-muted-foreground">{setting.description}</p>
                            </div>
                            <Switch checked={setting.enabled} />
                        </div>
                    ))}
                    <div className="pt-4 flex justify-end">
                        <Button className="w-full sm:w-auto">
                            <Save className="h-4 w-4 mr-2" /> Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Gateway Configuration</CardTitle>
                        <CardDescription>Connection settings for the WhatsApp API Provider.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label>API Endpoint URL</Label>
                            <Input defaultValue="https://api.whatsapp.com/v16.0" />
                        </div>
                        <div className="space-y-2">
                            <Label>Access Token</Label>
                            <Input type="password" value="********************************" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone Number ID</Label>
                            <Input defaultValue="1039482938492" />
                        </div>
                        <Button variant="outline" className="w-full">
                            <RefreshCw className="h-4 w-4 mr-2" /> Test Connection
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Message Templates</CardTitle>
                        <CardDescription>Manage verified templates for initiating conversations.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="p-4 border rounded-md bg-muted/20 text-center">
                            <p className="text-sm text-muted-foreground mb-4">Templates are synced from Meta Business Manager.</p>
                            <Button variant="outline" size="sm">Sync Templates</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}

      {activeTab === "logs" && (
        <Card>
            <CardHeader>
                <CardTitle>System Logs</CardTitle>
                <CardDescription>Recent activity and API request history.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {logs.map((log) => (
                        <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg bg-card/50">
                            <div className="flex items-center gap-4">
                                <div className={`p-2 rounded-full ${
                                    log.status === "Failed" ? "bg-red-500/10 text-red-500" : "bg-green-500/10 text-green-500"
                                }`}>
                                    {log.status === "Failed" ? <AlertCircle className="h-4 w-4"/> : <Check className="h-4 w-4"/>}
                                </div>
                                <div>
                                    <p className="font-medium">{log.event}</p>
                                    <p className="text-sm text-muted-foreground">To: {log.recipient} • Template: {log.template}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <Badge variant={log.status === "Failed" ? "destructive" : "outline"}>{log.status}</Badge>
                                <p className="text-xs text-muted-foreground mt-1">{log.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}

function LockIcon(props: any) {
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
    );
}