import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare, Send, Phone, User, Calendar, MoreVertical,
  Image as ImageIcon, Smile, Paperclip, Search, Check, CheckCheck
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const conversations = [
  { id: 1, number: "+1 (555) 123-4567", lastMessage: "Yes, I'm available at 2pm.", time: "10:30 AM", unread: 0, status: "received" },
  { id: 2, number: "+1 (555) 987-6543", lastMessage: "Please send the invoice.", time: "Yesterday", unread: 2, status: "received" },
  { id: 3, number: "+1 (555) 000-1111", lastMessage: "Thanks for your help!", time: "Yesterday", unread: 0, status: "sent" },
];

const messages = [
  { id: 1, type: "received", text: "Hi, do you have any appointments available today?", time: "10:15 AM" },
  { id: 2, type: "sent", text: "Hello! Yes, we have an opening at 2pm. Does that work for you?", time: "10:20 AM" },
  { id: 3, type: "received", text: "Yes, I'm available at 2pm.", time: "10:30 AM" },
];

export default function TwilioSMS() {
  const [selectedId, setSelectedId] = useState(1);
  const [inputText, setInputText] = useState("");

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Conversations List */}
      <Card className="w-80 flex flex-col bg-card/50 backdrop-blur-sm border-primary/10">
        <div className="p-4 border-b border-primary/10 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              SMS Inbox
            </h2>
            <Button size="icon" className="h-8 w-8">
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search messages..." className="pl-8 bg-background/50" />
          </div>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedId(conv.id)}
                className={`p-3 rounded-lg cursor-pointer flex gap-3 transition-colors ${
                  selectedId === conv.id ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50"
                }`}
              >
                <Avatar className="h-10 w-10 bg-slate-800">
                  <AvatarFallback className="text-xs text-primary font-mono">
                    {conv.number.slice(-4)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-sm truncate">{conv.number}</span>
                    <span className="text-[10px] text-muted-foreground">{conv.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {conv.status === "sent" && <span className="mr-1">You:</span>}
                    {conv.lastMessage}
                  </p>
                </div>
                {conv.unread > 0 && (
                  <div className="flex flex-col justify-center">
                    <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full">
                      {conv.unread}
                    </Badge>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Message Thread */}
      <Card className="flex-1 flex flex-col bg-card/50 backdrop-blur-sm border-primary/10 overflow-hidden">
        <div className="p-4 border-b border-primary/10 flex justify-between items-center bg-background/30">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 bg-slate-800">
              <AvatarFallback className="text-primary font-mono">
                67
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">+1 (555) 123-4567</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                United States • Twilio SMS
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost">
              <Phone className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <Calendar className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
             <div className="flex justify-center my-4">
              <Badge variant="outline" className="bg-background/50 text-xs font-normal text-muted-foreground">
                Today, 10:15 AM
              </Badge>
            </div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-sm ${
                    msg.type === "sent"
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted/50 border border-border rounded-tl-none"
                  }`}
                >
                  <p className="text-sm">{msg.text}</p>
                  <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${
                    msg.type === "sent" ? "text-white/70" : "text-muted-foreground"
                  }`}>
                    {msg.time}
                    {msg.type === "sent" && <CheckCheck className="h-3 w-3" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="p-4 bg-background/50 backdrop-blur border-t border-primary/10">
          <div className="flex items-end gap-2">
            <div className="flex gap-1 pb-2">
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Image className="h-5 w-5" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-primary">
                <Smile className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-1 bg-muted/30 rounded-2xl border border-input focus-within:ring-1 focus-within:ring-primary/50 transition-all flex items-center px-3 py-2">
               <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type an SMS..."
                className="flex-1 bg-transparent border-none focus:outline-none resize-none max-h-24 text-sm"
                rows={1}
                style={{ minHeight: "24px" }}
              />
            </div>
            <Button
              size="icon"
              className="h-10 w-10 rounded-full bg-primary shadow-lg shadow-primary/20 mb-1"
            >
              <Send className="h-4 w-4 ml-0.5" />
            </Button>
          </div>
          <div className="flex justify-between mt-2 px-1">
            <span className="text-[10px] text-muted-foreground">
              SMS segment: 1 (0/160)
            </span>
            <span className="text-[10px] text-muted-foreground">
              Rate: $0.0075/msg
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

function Image(props: any) {
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
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
        <circle cx="9" cy="9" r="2" />
        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
      </svg>
    )
  }
