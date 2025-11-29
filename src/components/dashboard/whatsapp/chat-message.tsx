'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Bot, Paperclip, Send, ThumbsUp } from 'lucide-react';
import * as React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { Conversation, Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, addDocumentNonBlocking, useCollection, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, serverTimestamp, doc } from "firebase/firestore";
import { sendWhatsAppMessage } from '@/app/dashboard/function-connect/actions';


interface ChatMessageProps {
  conversation: Conversation | null;
  currentUserAvatar: string;
}

export function ChatMessage({ conversation, currentUserAvatar }: ChatMessageProps) {
  const [input, setInput] = React.useState('');
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const messagesQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid || !conversation?.id) return null;
    return query(collection(firestore, 'users', user.uid, 'conversations', conversation.id, 'messages'), orderBy('timestamp', 'asc'));
  }, [firestore, user?.uid, conversation?.id]);

  const { data: messages } = useCollection<Message>(messagesQuery);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages]);


  const handleSend = async () => {
    if (input.trim() && conversation && user && firestore) {
      const tempInput = input;
      setInput('');

      const newMessage: Omit<Message, 'id'> = {
        contactId: conversation.contactId,
        content: tempInput,
        timestamp: serverTimestamp(),
        isSender: true,
      };
      
      const messagesCollection = collection(firestore, 'users', user.uid, 'conversations', conversation.id, 'messages');
      addDocumentNonBlocking(messagesCollection, newMessage);

      // Update the parent conversation document
      const conversationDocRef = doc(firestore, 'users', user.uid, 'conversations', conversation.id);
      updateDocumentNonBlocking(conversationDocRef, {
        lastMessage: tempInput,
        lastMessageTime: serverTimestamp()
      });

      const result = await sendWhatsAppMessage(conversation.contactId, tempInput);
      
      if (result.success) {
          toast({
              title: 'Message Sent',
              description: `Your message to ${conversation.contactName} was sent successfully.`,
          });
      } else {
          toast({
              variant: 'destructive',
              title: 'Failed to send message',
              description: result.error,
          });
      }
    }
  };

  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-muted/50 border-l">
        <Bot className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Conversation Selected</h3>
        <p className="text-sm text-muted-foreground text-center px-4">
            Select a conversation from the left panel to start chatting.
        </p>
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
      <ScrollArea className="flex-1" ref={scrollAreaRef}>
        <div className="p-4 space-y-4">
          <AnimatePresence>
            {messages?.map((message) => (
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
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
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
              <Send className="w-4 h-4 ml-2"/>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
