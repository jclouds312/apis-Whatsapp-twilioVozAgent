'use client';

import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { Conversation } from "@/lib/types";
import { ChatList } from "@/components/dashboard/whatsapp/chat-list";
import { ChatMessage } from "./chat-message";
import { ContactPanel } from "./contact-panel";

interface ChatLayoutProps {
  defaultLayout: number[] | undefined
  navCollapsedSize: number
  conversations: Conversation[]
  currentUserAvatar: string
}

export function ChatLayout({ 
    defaultLayout = [320, 480, 600],
    navCollapsedSize,
    conversations,
    currentUserAvatar,
}: ChatLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(conversations[0] || null);

    const onLayout = (sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`
    }
    
    return (
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
                direction="horizontal"
                onLayout={onLayout}
                className="h-full items-stretch"
            >
                <ResizablePanel
                    defaultSize={defaultLayout[0]}
                    collapsible={true}
                    minSize={15}
                    maxSize={20}
                    onCollapse={() => setIsCollapsed(true)}
                    onExpand={() => setIsCollapsed(false)}
                    className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
                >
                    <ChatList 
                        conversations={conversations}
                        isCollapsed={isCollapsed}
                        onSelectConversation={setSelectedConversation}
                        selectedConversationId={selectedConversation?.id}
                    />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                     <ChatMessage
                        key={selectedConversation?.id}
                        conversation={selectedConversation}
                        currentUserAvatar={currentUserAvatar}
                    />
                </ResizablePanel>
                 <ResizableHandle withHandle />
                <ResizablePanel defaultSize={defaultLayout[2]} minSize={20} maxSize={30}>
                    <ContactPanel
                        key={selectedConversation?.id} // Rerender when conversation changes
                        contact={selectedConversation}
                    />
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    )
}
