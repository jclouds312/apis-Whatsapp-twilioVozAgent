import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Phone,
  Video,
  MoreVertical,
  Search,
  Smile,
  Paperclip,
  Mic,
  Send,
  Check,
  CheckCheck,
  Clock,
  PhoneIncoming,
  PhoneMissed,
  X,
  LogOut,
  QrCode,
  Smartphone,
  Loader2,
  Image as ImageIcon,
  FileText
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock Data
const chats = [
  { id: 1, name: "Alice Johnson", avatar: "AJ", lastMsg: "See you tomorrow!", time: "10:42 AM", unread: 0, status: "online" },
  { id: 2, name: "Marketing Team", avatar: "MT", lastMsg: "Bob: The designs look great.", time: "09:15 AM", unread: 3, status: "online" },
  { id: 3, name: "+1 (555) 012-3456", avatar: "#", lastMsg: "Can you send the invoice?", time: "Yesterday", unread: 0, status: "offline" },
  { id: 4, name: "Support Ticket #492", avatar: "ST", lastMsg: "Your issue has been resolved.", time: "Yesterday", unread: 0, status: "offline" },
];

const messages = [
  { id: 1, sender: "them", text: "Hey, are we still on for the meeting?", time: "10:30 AM", status: "read", type: "text" },
  { id: 2, sender: "me", text: "Yes, definitely. 2 PM works for me.", time: "10:32 AM", status: "read", type: "text" },
  { id: 3, sender: "them", text: "Great. I'll bring the project files.", time: "10:33 AM", status: "read", type: "text" },
  { id: 4, sender: "me", text: "Perfect. See you then!", time: "10:42 AM", status: "sent", type: "text" },
];

export default function WhatsAppClientPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [msgText, setMsgText] = useState("");
  const [connectionStep, setConnectionStep] = useState(0);

  // Simulate QR Code scanning process
  useEffect(() => {
    if (!isAuthenticated) {
      const timer = setInterval(() => {
        setConnectionStep((prev) => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 1;
        });
      }, 50);
      return () => clearInterval(timer);
    }
  }, [isAuthenticated]);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setSelectedChat(chats[0]);
  };

  const simulateCall = (type: 'audio' | 'video') => {
    setIncomingCall({
      caller: "Alice Johnson",
      avatar: "AJ",
      type: type,
      status: "ringing"
    });
  };

  const endCall = () => {
    setIncomingCall(null);
  };

  const acceptCall = () => {
    setIncomingCall(prev => ({ ...prev, status: "connected" }));
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-6rem)] bg-slate-100 dark:bg-slate-900">
        <div className="max-w-4xl w-full bg-white dark:bg-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[600px]">
          <div className="flex-1 p-10 flex flex-col justify-between">
            <div>
              <h1 className="text-3xl font-light text-slate-700 dark:text-slate-200 mb-8">
                Use WhatsApp on your computer
              </h1>
              <ol className="list-decimal list-inside space-y-4 text-lg text-slate-600 dark:text-slate-400">
                <li>Open WhatsApp on your phone</li>
                <li>Tap <strong>Menu</strong> or <strong>Settings</strong> and select <strong>Linked Devices</strong></li>
                <li>Tap on <strong>Link a Device</strong></li>
                <li>Point your phone to this screen to capture the code</li>
              </ol>
            </div>
            <div className="text-emerald-500 font-medium cursor-pointer hover:underline">
              Need help to get started?
            </div>
          </div>
          <div className="flex-1 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center p-10 border-l border-slate-200 dark:border-slate-700">
            <div className="relative group cursor-pointer" onClick={handleLogin}>
                <div className="w-64 h-64 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white text-xs">
                        {/* Simulated QR Pattern */}
                        <div className="grid grid-cols-5 gap-1 w-full h-full opacity-80">
                            {Array.from({ length: 25 }).map((_, i) => (
                                <div key={i} className={`bg-black ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`} />
                            ))}
                        </div>
                        <QrCode className="absolute w-16 h-16 text-slate-900 bg-white p-2 rounded-lg" />
                    </div>
                </div>
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                    <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">Click to Simulate Scan</Button>
                </div>
            </div>
            <div className="mt-8 flex items-center gap-3">
                <input type="checkbox" checked className="accent-emerald-600 w-4 h-4" readOnly />
                <span className="text-slate-600 dark:text-slate-400">Keep me signed in</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex bg-slate-100 dark:bg-slate-950 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl relative">
      
      {/* Call Overlay */}
      {incomingCall && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-slate-900 text-white p-8 rounded-2xl w-80 flex flex-col items-center shadow-2xl border border-slate-700 animate-in zoom-in-95 duration-200">
                <Avatar className="w-24 h-24 mb-4 border-4 border-slate-700">
                    <AvatarFallback className="bg-emerald-600 text-2xl">{incomingCall.avatar}</AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold mb-1">{incomingCall.caller}</h2>
                <p className="text-slate-400 mb-8 flex items-center gap-2">
                    {incomingCall.type === 'video' ? <Video className="h-4 w-4"/> : <Phone className="h-4 w-4"/>}
                    {incomingCall.status === 'ringing' ? 'Incoming Call...' : 'Connected'}
                </p>

                {incomingCall.status === 'ringing' ? (
                    <div className="flex gap-8">
                        <Button 
                            size="icon" 
                            className="h-14 w-14 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                            onClick={endCall}
                        >
                            <PhoneMissed className="h-6 w-6" />
                        </Button>
                        <Button 
                            size="icon" 
                            className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20 animate-bounce"
                            onClick={acceptCall}
                        >
                            <PhoneIncoming className="h-6 w-6" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <Button size="icon" variant="secondary" className="rounded-full h-12 w-12"><Mic className="h-5 w-5"/></Button>
                        <Button size="icon" variant="secondary" className="rounded-full h-12 w-12"><Video className="h-5 w-5"/></Button>
                        <Button 
                            size="icon" 
                            className="h-12 w-12 rounded-full bg-red-500 hover:bg-red-600 text-white"
                            onClick={endCall}
                        >
                            <PhoneMissed className="h-6 w-6" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Sidebar */}
      <div className="w-[400px] flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        {/* Sidebar Header */}
        <div className="h-16 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0">
            <Avatar className="cursor-pointer">
                <AvatarFallback className="bg-slate-300 dark:bg-slate-700 text-slate-600 dark:text-slate-300">ME</AvatarFallback>
            </Avatar>
            <div className="flex gap-2 text-slate-500">
                <Button variant="ghost" size="icon"><Loader2 className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><FileText className="h-5 w-5" /></Button>
                <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
            </div>
        </div>

        {/* Search */}
        <div className="p-2 border-b border-slate-200 dark:border-slate-800 shrink-0">
            <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input placeholder="Search or start new chat" className="pl-9 bg-slate-100 dark:bg-slate-800 border-none h-9" />
            </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
            {chats.map((chat) => (
                <div 
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedChat?.id === chat.id ? 'bg-slate-100 dark:bg-slate-800' : ''}`}
                >
                    <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-emerald-100 text-emerald-700">{chat.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-baseline">
                            <h3 className="font-medium text-slate-900 dark:text-slate-100 truncate">{chat.name}</h3>
                            <span className="text-xs text-slate-400">{chat.time}</span>
                        </div>
                        <div className="flex justify-between items-center mt-0.5">
                            <p className="text-sm text-slate-500 dark:text-slate-400 truncate flex-1">{chat.lastMsg}</p>
                            {chat.unread > 0 && (
                                <Badge className="bg-emerald-500 hover:bg-emerald-600 h-5 w-5 rounded-full p-0 flex items-center justify-center ml-2">
                                    {chat.unread}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      {selectedChat ? (
          <div className="flex-1 flex flex-col bg-[#efeae2] dark:bg-[#0b141a]">
              {/* Chat Header */}
              <div className="h-16 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 shrink-0">
                  <div className="flex items-center gap-3">
                      <Avatar>
                          <AvatarFallback className="bg-emerald-100 text-emerald-700">{selectedChat.avatar}</AvatarFallback>
                      </Avatar>
                      <div>
                          <h3 className="font-medium text-slate-900 dark:text-slate-100">{selectedChat.name}</h3>
                          <p className="text-xs text-slate-500">click here for contact info</p>
                      </div>
                  </div>
                  <div className="flex gap-2 text-slate-500">
                      <Button variant="ghost" size="icon" onClick={() => simulateCall('audio')}><Phone className="h-5 w-5" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => simulateCall('video')}><Video className="h-5 w-5" /></Button>
                      <Button variant="ghost" size="icon"><Search className="h-5 w-5" /></Button>
                      <Button variant="ghost" size="icon"><MoreVertical className="h-5 w-5" /></Button>
                  </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-40">
                  <div className="space-y-2">
                      <div className="flex justify-center my-4">
                          <span className="bg-white/90 dark:bg-slate-800/90 px-3 py-1 rounded-lg text-xs text-slate-500 shadow-sm">Today</span>
                      </div>
                      {messages.map((msg) => (
                          <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[60%] rounded-lg px-3 py-1.5 shadow-sm text-sm relative group ${
                                  msg.sender === 'me' 
                                  ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-slate-900 dark:text-slate-100 rounded-tr-none' 
                                  : 'bg-white dark:bg-[#202c33] text-slate-900 dark:text-slate-100 rounded-tl-none'
                              }`}>
                                  <p>{msg.text}</p>
                                  <div className="flex justify-end items-center gap-1 mt-0.5">
                                      <span className="text-[10px] text-slate-500 dark:text-slate-400">{msg.time}</span>
                                      {msg.sender === 'me' && <CheckCheck className="h-3 w-3 text-blue-500" />}
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="min-h-[64px] bg-slate-50 dark:bg-slate-900 px-4 py-2 flex items-end gap-2 shrink-0">
                  <Button variant="ghost" size="icon" className="text-slate-500 mb-1"><Smile className="h-6 w-6"/></Button>
                  <Button variant="ghost" size="icon" className="text-slate-500 mb-1"><Paperclip className="h-6 w-6"/></Button>
                  <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 min-h-[42px] flex items-center px-3 mb-1">
                      <input 
                        className="w-full bg-transparent border-none outline-none text-sm" 
                        placeholder="Type a message"
                        value={msgText}
                        onChange={(e) => setMsgText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') setMsgText('');
                        }}
                      />
                  </div>
                  {msgText ? (
                      <Button size="icon" className="mb-1 bg-emerald-600 hover:bg-emerald-700"><Send className="h-5 w-5"/></Button>
                  ) : (
                      <Button variant="ghost" size="icon" className="text-slate-500 mb-1"><Mic className="h-6 w-6"/></Button>
                  )}
              </div>
          </div>
      ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 border-b-8 border-emerald-500">
              <div className="text-center space-y-4">
                  <h2 className="text-3xl font-light text-slate-600 dark:text-slate-300">WhatsApp Web</h2>
                  <p className="text-slate-500">Send and receive messages without keeping your phone online.<br/>Use WhatsApp on up to 4 linked devices and 1 phone.</p>
                  <div className="flex justify-center items-center gap-2 text-slate-400 text-sm mt-8">
                      <Shield className="h-3 w-3" /> End-to-end encrypted
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}
