import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Cloud, Globe, MessageSquare, Send, XCircle } from "lucide-react";

export default function WhatsAppPage() {
    const isConnected = true; // Mock status for demonstration

    return (
        <>
            <Header title="WhatsApp" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle>WABA Connection</CardTitle>
                            <CardDescription>Manage your WhatsApp Business API connection.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="wa-number">Sending Number</Label>
                                <Input id="wa-number" placeholder="+1 (555) 000-0000" defaultValue="+1 (555) 123-4567" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="wa-token">Access Token</Label>
                                <Input id="wa-token" type="password" defaultValue="••••••••••••••••••••••••" />
                            </div>
                            <div className="flex items-center space-x-2">
                                {isConnected ? (
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                ) : (
                                    <XCircle className="h-5 w-5 text-red-500" />
                                )}
                                <span className="text-sm font-medium">
                                    {isConnected ? "Connected" : "Not Connected"}
                                </span>
                            </div>
                        </CardContent>
                         <CardHeader>
                            <Button>Save Configuration</Button>
                        </CardHeader>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Service Status</CardTitle>
                            <CardDescription>Real-time status of WhatsApp services.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4">
                            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Cloud className="h-6 w-6 text-primary"/>
                                    <p className="font-medium">Cloud API</p>
                                </div>
                                <Badge variant="default" className="bg-green-500">Operational</Badge>
                            </div>
                             <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Send className="h-6 w-6 text-primary"/>
                                    <p className="font-medium">Message Sending</p>
                                </div>
                                <Badge variant="default" className="bg-green-500">Operational</Badge>
                            </div>
                             <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <Globe className="h-6 w-6 text-primary"/>
                                    <p className="font-medium">Webhooks</p>
                                </div>
                                <Badge variant="default" className="bg-green-500">Operational</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>

            </main>
        </>
    )
}
