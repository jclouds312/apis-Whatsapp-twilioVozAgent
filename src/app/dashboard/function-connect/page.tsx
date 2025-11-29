import { Header } from "@/components/dashboard/header";
import { WorkflowSuggester } from "@/components/dashboard/workflow-suggester";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { workflows } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Circle, MessageSquare, Phone, Workflow as WorkflowIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { RetellAgent } from "@/components/dashboard/retell-agent";

export default function FunctionConnectPage() {
    const getIcon = (service: 'WhatsApp' | 'Twilio' | 'CRM') => {
        switch (service) {
            case 'WhatsApp': return <MessageSquare className="h-5 w-5 text-green-500" />;
            case 'Twilio': return <Phone className="h-5 w-5 text-red-500" />;
            case 'CRM': return <WorkflowIcon className="h-5 w-5 text-blue-500" />;
        }
    };
    
    return (
        <>
            <Header title="Function Connect" />
            <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 lg:gap-6 lg:p-6">
                <div className="flex flex-col gap-6">
                    <WorkflowSuggester />
                    <RetellAgent />
                </div>
                <div className="md:col-span-1">
                    <Card className="h-full transition-all hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Existing Workflows</CardTitle>
                            <CardDescription>Manage your automated data flows between services.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {workflows.map(wf => (
                                <Card key={wf.id} className="overflow-hidden transition-all hover:shadow-md">
                                    <CardHeader className="flex flex-row items-start bg-muted/50 gap-4 p-4">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-background border">
                                           {getIcon(wf.trigger.service)}
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className="text-lg">{wf.name}</CardTitle>
                                            <CardDescription>Trigger: {wf.trigger.event}</CardDescription>
                                        </div>
                                        <Badge variant={wf.status === 'active' ? 'default' : 'secondary'} 
                                            className={wf.status === 'active' 
                                                ? 'bg-green-100 text-green-800'
                                                : ''
                                            }>
                                            <Circle className={`mr-2 h-2 w-2 fill-current ${wf.status === 'active' ? 'text-green-600' : 'text-gray-400'}`} />
                                            {wf.status}
                                        </Badge>
                                    </CardHeader>
                                    <CardContent className="p-4 text-sm">
                                        <p className="font-medium mb-2">Steps:</p>
                                        <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                                            {wf.steps.map((step, index) => (
                                                <li key={index}>{step.description}</li>
                                            ))}
                                        </ol>
                                    </CardContent>
                                    <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
                                        <p className="text-xs text-muted-foreground">Last run: {new Date(wf.lastRun).toLocaleString()}</p>
                                        <div>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    )
}