'use client';

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Circle, MessageSquare, Phone, Workflow as WorkflowIcon } from "lucide-react";
import { useEffect, useState } from "react";
import type { Workflow } from "@/lib/types";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Skeleton } from "@/components/ui/skeleton";
import { EvolutionApiCard } from "@/components/dashboard/function-connect/evolution-api-card";
import { TwilioVerifyCard } from "@/components/dashboard/twilio/twilio-verify-card";

export default function FunctionConnectPage() {
    const [isClient, setIsClient] = useState(false);
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const workflowsQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'workflows');
    }, [firestore, user?.uid]);
    
    const { data: workflows, isLoading } = useCollection<Workflow>(workflowsQuery);

    useEffect(() => {
        setIsClient(true);
    }, []);

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
            <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
                    <EvolutionApiCard />
                    <TwilioVerifyCard />
                </div>
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-1">
                    <Card className="h-full transition-all hover:shadow-lg">
                        <CardHeader>
                            <CardTitle>Existing Workflows</CardTitle>
                            <CardDescription>Manage your automated data flows between services.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isLoading && Array.from({ length: 2 }).map((_, i) => (
                               <Card key={i} className="overflow-hidden">
                                   <CardHeader className="flex flex-row items-start bg-muted/50 gap-4 p-4">
                                       <Skeleton className="w-12 h-12 rounded-lg" />
                                       <div className="flex-1 space-y-2">
                                           <Skeleton className="h-5 w-3/5" />
                                           <Skeleton className="h-4 w-2/5" />
                                       </div>
                                       <Skeleton className="h-6 w-20 rounded-full" />
                                   </CardHeader>
                                   <CardContent className="p-4 space-y-2">
                                        <Skeleton className="h-4 w-1/4" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                   </CardContent>
                                   <CardFooter className="bg-muted/50 p-4 flex justify-between items-center">
                                       <Skeleton className="h-4 w-1/3" />
                                       <Skeleton className="h-8 w-16" />
                                   </CardFooter>
                               </Card>
                            ))}
                            {workflows?.map(wf => (
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
                                        <p className="text-xs text-muted-foreground">Last run: {isClient && wf.lastRun ? new Date((wf.lastRun as any).seconds * 1000).toLocaleString() : 'N/A'}</p>
                                        <div>
                                            <Button variant="outline" size="sm">Edit</Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                             {!isLoading && workflows?.length === 0 && (
                                <div className="text-center text-muted-foreground p-8">
                                    No workflows found.
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </>
    )
}
