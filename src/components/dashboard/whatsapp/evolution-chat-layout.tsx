'use client';

import React, { useState, useEffect } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, Mic, Smile } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/toast";

// Types matching the Evolution API response
type Chat = {
    jid: string;
    name: string;
    t: number; // timestamp
    unreadCount: number;
    messages?: Message[];
};

type Message = {
    key: { remoteJid: string, fromMe: boolean, id: string };
    messageTimestamp: number;
    message?: { conversation?: string };
};

async function fetchFromEvolutionAPI(endpoint: string, apiKey: string, instanceName: string, options: RequestInit = {}) {
    const url = `/api/evolution/${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${apiKey}`,
            'X-Instance-Name': instanceName
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An API error occurred');
    }
    return response.json();
}

export function EvolutionChatLayout({ apiKey, instanceName }: { apiKey: string, instanceName: string }) {
    const [chats, setChats] = useState<Chat[]>([]);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        if (apiKey && instanceName) {
            fetchChats();
        }
    }, [apiKey, instanceName]);

    const fetchChats = async () => {
        try {
            const data = await fetchFromEvolutionAPI(`chat/findChats/${instanceName}`, apiKey, instanceName);
            setChats(data || []);
        } catch (error: any) {
            toast({ title: "Error fetching chats", description: error.message, variant: "destructive" });
        }
    };

    const fetchMessages = async (jid: string) => {
        try {
            const data = await fetchFromEvolutionAPI(`chat/findMessages/${instanceName}?jid=${jid}`, apiKey, instanceName);
            setMessages(data || []);
        } catch (error: any) {
            toast({ title: "Error fetching messages", description: error.message, variant: "destructive" });
        }
    };
    
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;
        try {
            await fetchFromEvolutionAPI(`message/sendText/${instanceName}`, apiKey, instanceName, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ number: selectedChat.jid, textMessage: { text: newMessage } })
            });
            setNewMessage("");
            // Refresh messages after sending
            setTimeout(() => fetchMessages(selectedChat.jid), 1000); 
        } catch (error: any) { 
            toast({ title: "Error sending message", description: error.message, variant: "destructive" });
        }
    };

    useEffect(() => {
        if (selectedChat) {
            fetchMessages(selectedChat.jid);
        }
    }, [selectedChat]);

    return (
        <ResizablePanelGroup direction="horizontal" className="h-full w-full rounded-lg border">
            <ResizablePanel defaultSize={25} minSize={20}>
                <div className="p-4">
                    <h2 className="text-lg font-semibold">Conversations</h2>
                </div>
                <ScrollArea className="h-[calc(100%-4rem)]">
                    {chats.map(chat => (
                        <div key={chat.jid} 
                             className={`flex items-center gap-3 p-3 cursor-pointer ${selectedChat?.jid === chat.jid ? 'bg-muted' : 'hover:bg-muted/50'}`}
                             onClick={() => setSelectedChat(chat)}>
                             <Avatar className="h-10 w-10 border">
                                <AvatarImage src={`https://picsum.photos/seed/${chat.jid}/100/100`} alt={chat.name} />
                                <AvatarFallback>{chat.name[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="font-medium truncate">{chat.name || chat.jid}</p>
                                <p className="text-xs text-muted-foreground truncate">{/* Last message preview */}</p>
                            </div>
                            {chat.unreadCount > 0 && <Badge>{chat.unreadCount}</Badge>}
                        </div>
                    ))}
                </ScrollArea>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={75}>
                {selectedChat ? (
                    <div className="flex flex-col h-full">
                        <div className="flex items-center gap-4 p-4 border-b">
                            <Avatar className="h-10 w-10 border">
                                <AvatarImage src={`https://picsum.photos/seed/${selectedChat.jid}/100/100`} alt={selectedChat.name} />
                                <AvatarFallback>{selectedChat.name[0] || 'U'}</AvatarFallback>
                            </Avatar>
                            <h3 className="text-lg font-semibold">{selectedChat.name || selectedChat.jid}</h3>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-4">
                                {messages.map(msg => (
                                    <div key={msg.key.id} className={`flex ${msg.key.fromMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`rounded-lg px-4 py-2 max-w-sm ${msg.key.fromMe ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                                            {msg.message?.conversation}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t flex items-center gap-2">
                            <Button variant="outline" size="icon"><Paperclip className="h-5 w-5" /></Button>
                            <Input 
                                placeholder="Type a message..." 
                                className="flex-1" 
                                value={newMessage} 
                                onChange={e => setNewMessage(e.target.value)} 
                                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}/>
                            <Button variant="outline" size="icon"><Smile className="h-5 w-5" /></Button>
                            <Button onClick={handleSendMessage}><Send className="h-5 w-5" /></Button>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted/50">
                        <p>Select a conversation to start chatting</p>
                    </div>
                )}
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
