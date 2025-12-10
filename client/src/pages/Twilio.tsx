import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Phone, PhoneCall, PhoneIncoming, PhoneOutgoing, Voicemail,
  Users, History, Command, Mic, MicOff, Video, MoreHorizontal,
  Search, UserPlus, GripVertical, Delete
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const callHistory = [
  { id: 1, name: "John Doe", number: "+1 (555) 123-4567", type: "incoming", time: "10:45 AM", duration: "5m 23s", status: "completed" },
  { id: 2, name: "Alice Smith", number: "+1 (555) 987-6543", type: "outgoing", time: "9:30 AM", duration: "12m 10s", status: "completed" },
  { id: 3, name: "Unknown", number: "+1 (555) 000-1111", type: "missed", time: "Yesterday", duration: "0s", status: "missed" },
  { id: 4, name: "Bob Wilson", number: "+1 (555) 222-3333", type: "outgoing", time: "Yesterday", duration: "2m 45s", status: "completed" },
  { id: 5, name: "Support", number: "+1 (800) 123-4567", type: "incoming", time: "Mon", duration: "15m 00s", status: "completed" },
];

export default function Twilio() {
  const [dialNumber, setDialNumber] = useState("");
  const [activeTab, setActiveTab] = useState("keypad");

  const handleNumberClick = (num: string) => {
    setDialNumber(prev => prev + num);
  };

  const handleDelete = () => {
    setDialNumber(prev => prev.slice(0, -1));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      {/* Left Panel: Dialer & Active Call */}
      <Card className="col-span-1 flex flex-col bg-card/50 backdrop-blur-sm border-primary/10 h-full">
        <Tabs defaultValue="keypad" className="flex-1 flex flex-col" onValueChange={setActiveTab}>
          <div className="p-4 border-b border-primary/10">
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="keypad">Command</TabsTrigger>
              <TabsTrigger value="contacts">Contacts</TabsTrigger>
              <TabsTrigger value="recent">Recent</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="keypad" className="flex-1 flex flex-col p-6 data-[state=active]:flex">
            {/* Display */}
            <div className="mb-8 text-center">
              <Input
                value={dialNumber}
                onChange={(e) => setDialNumber(e.target.value)}
                className="text-3xl text-center border-none bg-transparent shadow-none focus-visible:ring-0 h-16 font-mono tracking-wider"
                placeholder="Enter number..."
              />
              {dialNumber && (
                <div className="text-sm text-muted-foreground mt-2 flex items-center justify-center gap-2 cursor-pointer hover:text-primary">
                  <UserPlus className="h-4 w-4" />
                  Add to contacts
                </div>
              )}
            </div>

            {/* Command Grid */}
            <div className="grid grid-cols-3 gap-4 max-w-[280px] mx-auto mb-8">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  className="h-16 w-16 rounded-full text-2xl font-light hover:border-primary/50 hover:bg-primary/5 transition-all"
                  onClick={() => handleNumberClick(key.toString())}
                >
                  {key}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center gap-6 mt-auto">
               <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full"
                onClick={() => setDialNumber("")}
                disabled={!dialNumber}
              >
                <GripVertical className="h-5 w-5 text-muted-foreground" />
              </Button>
              
              <Button
                size="icon"
                className="h-16 w-16 rounded-full bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/20"
              >
                <Phone className="h-8 w-8 text-white" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:text-destructive"
                onClick={handleDelete}
                disabled={!dialNumber}
              >
                <Delete className="h-6 w-6" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="flex-1 p-4">
            <div className="relative mb-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-8" />
            </div>
            <div className="text-center text-muted-foreground py-8">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p>No contacts found</p>
            </div>
          </TabsContent>

          <TabsContent value="recent" className="flex-1 p-0">
             <ScrollArea className="h-full">
               {callHistory.map((call) => (
                 <div key={call.id} className="flex items-center justify-between p-4 hover:bg-muted/50 border-b border-border/50 cursor-pointer">
                   <div className="flex items-center gap-3">
                     <div className={`p-2 rounded-full ${
                       call.type === 'missed' ? 'bg-red-500/10 text-red-500' : 
                       call.type === 'incoming' ? 'bg-blue-500/10 text-blue-500' : 
                       'bg-green-500/10 text-green-500'
                     }`}>
                       {call.type === 'missed' ? <PhoneIncoming className="h-4 w-4" /> :
                        call.type === 'incoming' ? <PhoneIncoming className="h-4 w-4" /> :
                        <PhoneOutgoing className="h-4 w-4" />}
                     </div>
                     <div>
                       <p className={`font-medium ${call.type === 'missed' ? 'text-red-500' : ''}`}>{call.name}</p>
                       <p className="text-xs text-muted-foreground">{call.number}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <p className="text-sm text-foreground/80">{call.time}</p>
                     <p className="text-xs text-muted-foreground">{call.duration}</p>
                   </div>
                 </div>
               ))}
             </ScrollArea>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Right Panel: Analytics & Active Numbers */}
      <div className="col-span-1 lg:col-span-2 space-y-6">
         {/* Active Numbers */}
         <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" />
                  Active Numbers
                </CardTitle>
                <CardDescription>Manage your Twilio phone numbers</CardDescription>
              </div>
              <Button size="sm" variant="outline">
                <PlusIcon className="h-4 w-4 mr-2" />
                Buy Number
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                 {[
                   { number: "+1 (555) 123-4567", location: "US", capabilities: ["voice", "sms", "mms"], status: "Active" },
                   { number: "+44 20 7123 4567", location: "UK", capabilities: ["voice", "sms"], status: "Active" },
                 ].map((item, i) => (
                   <div key={i} className="p-4 rounded-lg border border-border bg-background/50 flex justify-between items-center">
                     <div>
                       <p className="font-mono text-lg font-medium">{item.number}</p>
                       <div className="flex gap-2 mt-2">
                         {item.capabilities.map(cap => (
                           <Badge key={cap} variant="secondary" className="text-xs uppercase">{cap}</Badge>
                         ))}
                       </div>
                     </div>
                     <div className="text-right">
                       <Badge className="bg-green-500/20 text-green-500 hover:bg-green-500/30 border-none">
                         {item.status}
                       </Badge>
                       <p className="text-xs text-muted-foreground mt-1">{item.location}</p>
                     </div>
                   </div>
                 ))}
              </div>
            </CardContent>
         </Card>

         {/* Call Volume Chart Placeholder */}
         <Card className="bg-card/50 backdrop-blur-sm border-primary/10 flex-1">
            <CardHeader>
              <CardTitle>Call Volume</CardTitle>
              <CardDescription>Last 7 days activity</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center bg-muted/10 rounded-lg border border-dashed border-border m-6">
               <div className="text-center text-muted-foreground">
                 <History className="h-12 w-12 mx-auto mb-3 opacity-20" />
                 <p>Detailed analytics visualization coming soon</p>
               </div>
            </CardContent>
         </Card>
      </div>
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
    )
}
