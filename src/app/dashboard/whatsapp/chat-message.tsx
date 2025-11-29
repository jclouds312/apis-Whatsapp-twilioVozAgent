'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Paperclip, SendHorizonal, ThumbsUp } from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Conversation, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { sendWhatsAppMessage } from './actions';
import { useLogs } from '@/context/LogContext';
import { useToast } from '@/hooks/use-toast';


interface ChatMessageProps {
  conversation: Conversation | null;
  currentUserAvatar: string;
}

export function ChatMessage({ conversation, currentUserAvatar }: ChatMessageProps) {
  const [messages, setMessages] = React.useState<Message[]>(
    conversation?.messages || []
  );
  const [input, setInput] = React.useState('');
  const { addLog } = useLogs();
  const { toast } = useToast();

  React.useEffect(() => {
    setMessages(conversation?.messages || []);
  }, [conversation]);

  const handleSend = async () => {
    if (input.trim() && conversation) {
      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        contactId: 'usr_1', // This should be the current user's ID
        content: input,
        timestamp: new Date().toISOString(),
        isSender: true,
      };
      setMessages((prev) => [...prev, newMessage]);
      const tempInput = input;
      setInput('');
      
      try {
        const result = await sendWhatsAppMessage(conversation.contactId, tempInput);
        if (result.success) {
            addLog({ service: 'WhatsApp', level: 'info', message: `Message sent to ${conversation.contactName}.` });
            toast({
                title: 'Message Sent',
                description: `Your message to ${conversation.contactName} was sent successfully.`,
            });
        } else {
            addLog({ service: 'WhatsApp', level: 'error', message: `Failed to send message: ${result.error}` });
            toast({
                variant: 'destructive',
                title: 'Failed to send message',
                description: result.error,
            });
            // Optional: remove the message from UI if it failed to send
            setMessages(prev => prev.filter(m => m.id !== newMessage.id));
        }
      } catch (error) {
           addLog({ service: 'WhatsApp', level: 'error', message: 'An unexpected error occurred.' });
           toast({
                variant: 'destructive',
                title: 'Error',
                description: 'An unexpected error occurred while sending the message.',
           });
           setMessages(prev => prev.filter(m => m.id !== newMessage.id));
      }

    }
  };

  if (!conversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">
            <p>Select a conversation to start chatting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-4 p-4 border-b">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={conversation.contactAvatar}
            alt={conversation.contactName}
            width={40}
            height={40}
            data-ai-hint="person face"
          />
          <AvatarFallback>{conversation.contactName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{conversation.contactName}</h2>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                layout
                initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                transition={{
                  opacity: { duration: 0.1 },
                  layout: {
                    type: 'spring',
                    bounce: 0.4,
                    duration: 0.4,
                  },
                }}
                className={cn('flex items-end gap-2', message.isSender ? 'justify-end' : 'justify-start')}
              >
                {!message.isSender && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={conversation.contactAvatar}
                      alt={conversation.contactName}
                      data-ai-hint="person face"
                    />
                    <AvatarFallback>
                      {conversation.contactName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg p-3 text-sm',
                    message.isSender
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.content}
                </div>
                 {message.isSender && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUserAvatar} alt="You" data-ai-hint="person face"/>
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>
      <Separator />
      <div className="p-4">
        <div className="relative">
          <Input
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            className="pr-28"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <ThumbsUp className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send a like</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Paperclip className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
            <Button size="sm" className="ml-2" onClick={handleSend} disabled={!input.trim()}>
              Send
              <SendHorizonal className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
