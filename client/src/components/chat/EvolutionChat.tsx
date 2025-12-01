import { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Mic, Smile, Search, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// Mock Data
const mockChats = [
  { jid: "5511999999999", name: "John Doe", unreadCount: 2, lastMessage: "Hello, I need help with...", timestamp: "10:30 AM" },
  { jid: "5511888888888", name: "Jane Smith", unreadCount: 0, lastMessage: "Thanks for the update!", timestamp: "Yesterday" },
  { jid: "5511777777777", name: "Support Group", unreadCount: 5, lastMessage: "New ticket assigned", timestamp: "Mon" },
];

const mockMessages = [
  { id: "1", fromMe: false, text: "Hi, I'm having trouble with my order.", timestamp: "10:30 AM" },
  { id: "2", fromMe: true, text: "Hello! I'd be happy to help. Can you provide your order ID?", timestamp: "10:31 AM" },
  { id: "3", fromMe: false, text: "It's #12345.", timestamp: "10:32 AM" },
];

export default function EvolutionChat() {
    const [selectedChat, setSelectedChat] = useState<string | null>(null);
    const [messages, setMessages] = useState(mockMessages);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const msg = {
            id: Date.now().toString(),
            fromMe: true,
            text: newMessage,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages([...messages, msg]);
        setNewMessage("");
    };

    return (
        <div className="h-[700px] border border-border/50 rounded-lg overflow-hidden bg-background shadow-sm">
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={30} minSize={25}>
                    <div className="flex flex-col h-full border-r border-border/50">
                        <div className="p-4 border-b border-border/50 bg-muted/10">
                            <div className="relative">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input placeholder="Search chats..." className="pl-8" />
                            </div>
                        </div>
                        <ScrollArea className="flex-1">
                            {mockChats.map(chat => (
                                <div 
                                    key={chat.jid} 
                                    className={`flex items-center gap-3 p-4 cursor-pointer transition-colors hover:bg-muted/50 ${selectedChat === chat.jid ? 'bg-primary/5 border-r-2 border-primary' : ''}`}
                                    onClick={() => setSelectedChat(chat.jid)}
                                >
                                     <Avatar className="h-10 w-10 border border-border/50">
                                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.jid}`} alt={chat.name} />
                                        <AvatarFallback>{chat.name[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-1">
                                            <p className="font-medium truncate">{chat.name}</p>
                                            <span className="text-[10px] text-muted-foreground">{chat.timestamp}</span>
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                                    </div>
                                    {chat.unreadCount > 0 && (
                                        <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center rounded-full bg-green-500">
                                            {chat.unreadCount}
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </ScrollArea>
                    </div>
                </ResizablePanel>
                
                <ResizableHandle />
                
                <ResizablePanel defaultSize={70}>
                    {selectedChat ? (
                        <div className="flex flex-col h-full bg-[#efe7dd] dark:bg-[#0b141a]">
                            {/* Chat Header */}
                            <div className="p-3 border-b border-border/50 bg-background/95 backdrop-blur flex items-center gap-3 shadow-sm z-10">
                                <Avatar className="h-9 w-9">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedChat}`} />
                                    <AvatarFallback>U</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-semibold text-sm">John Doe</h3>
                                    <p className="text-xs text-muted-foreground">Online</p>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                                            <div 
                                                className={`
                                                    rounded-lg px-4 py-2 max-w-[70%] shadow-sm text-sm relative
                                                    ${msg.fromMe 
                                                        ? 'bg-[#d9fdd3] dark:bg-[#005c4b] text-foreground rounded-tr-none' 
                                                        : 'bg-white dark:bg-[#202c33] text-foreground rounded-tl-none'
                                                    }
                                                `}
                                            >
                                                <p>{msg.text}</p>
                                                <span className="text-[10px] text-muted-foreground/80 block text-right mt-1">
                                                    {msg.timestamp}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* Input Area */}
                            <div className="p-3 bg-background border-t border-border/50 flex items-center gap-2">
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                    <Paperclip className="h-5 w-5" />
                                </Button>
                                <Input 
                                    placeholder="Type a message..." 
                                    className="flex-1 bg-muted/30 border-border/50"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                />
                                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                    <Smile className="h-5 w-5" />
                                </Button>
                                {newMessage.trim() ? (
                                    <Button size="icon" className="bg-green-600 hover:bg-green-700 text-white" onClick={handleSendMessage}>
                                        <Send className="h-5 w-5" />
                                    </Button>
                                ) : (
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                                        <Mic className="h-5 w-5" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full bg-muted/10 text-muted-foreground">
                            <div className="p-6 bg-background rounded-full mb-4 shadow-sm">
                                <MessageSquare className="h-12 w-12 text-muted-foreground/50" />
                            </div>
                            <h3 className="font-semibold text-lg">Evolution API Chat</h3>
                            <p className="text-sm">Select a conversation to start messaging</p>
                        </div>
                    )}
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
}
