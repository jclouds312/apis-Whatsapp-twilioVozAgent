import { ChatLayout } from "@/components/dashboard/whatsapp/chat-layout";
import { conversations, userAvatar } from "@/lib/data";

export default function WhatsAppPage() {
    return (
        <ChatLayout
            defaultLayout={[320, 1080]}
            navCollapsedSize={8}
            conversations={conversations}
            currentUserAvatar={userAvatar}
        />
    )
}
