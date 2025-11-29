import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

export default function WhatsAppPage() {
    return (
        <>
            <Header title="WhatsApp Console" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>WhatsApp Business Cloud API</CardTitle>
                        <CardDescription>Manage webhooks, templates, and message sending.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="flex flex-col items-center justify-center text-center p-12 border-2 border-dashed rounded-lg">
                            <MessageSquare className="w-16 h-16 text-muted-foreground mb-4"/>
                            <h3 className="text-xl font-semibold mb-2">WhatsApp Business Console</h3>
                            <p className="text-muted-foreground">This section is under construction. Soon you'll be able to manage your WABA integrations here.</p>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
