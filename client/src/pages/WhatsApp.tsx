import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare, Send, Plus, MoreVertical, Search,
  Image as ImageIcon, Paperclip, Smile, Phone, Video,
  Check, CheckCheck, Clock, User
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

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

export default function WhatsApp() {
  const [selectedContact, setSelectedContact] = useState(contacts[0]);
  const [messageInput, setMessageInput] = useState("");

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Contacts Sidebar */}
      <Card className="w-80 flex flex-col bg-card/50 backdrop-blur-sm border-primary/10">
        <div className="p-4 border-b border-primary/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              WhatsApp
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
                placeholder="Type a message..."
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
    )
}
