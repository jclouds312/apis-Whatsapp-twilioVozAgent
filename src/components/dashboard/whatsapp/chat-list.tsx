'use client';

import { formatDistanceToNowStrict } from 'date-fns';
import { Archive, Search } from 'lucide-react';
import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { Conversation } from '@/lib/types';
import { cn } from '@/lib/utils';

interface ChatListProps {
  conversations: Conversation[];
  selectedConversationId: string | null | undefined;
  isCollapsed: boolean;
  onSelectConversation: (conversation: Conversation) => void;
}

export function ChatList({
  conversations,
  selectedConversationId,
  isCollapsed,
  onSelectConversation,
}: ChatListProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between p-2">
        {!isCollapsed && <h2 className="text-lg font-semibold">Chats</h2>}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(isCollapsed && 'mx-auto')}
            >
              <Archive className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Archived Chats</TooltipContent>
        </Tooltip>
      </div>

      <div className="relative p-2">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search" className="pl-8" />
      </div>

      <Separator />

      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-2">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-muted',
                selectedConversationId === conv.id && 'bg-muted',
                isCollapsed && 'justify-center'
              )}
              onClick={() => onSelectConversation(conv)}
            >
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={conv.contactAvatar}
                  alt={conv.contactName}
                  width={40}
                  height={40}
                  data-ai-hint="person face"
                />
                <AvatarFallback>{conv.contactName.charAt(0)}</AvatarFallback>
              </Avatar>
              {!isCollapsed && (
                <div className="flex-1 truncate">
                  <div className="font-semibold">{conv.contactName}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {conv.lastMessage}
                  </div>
                </div>
              )}
              {!isCollapsed && (
                <div className="text-xs text-muted-foreground">
                  {formatDistanceToNowStrict(new Date(conv.lastMessageTime), {
                    addSuffix: false,
                  })}
                </div>
              )}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
