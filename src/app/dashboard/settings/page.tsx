'use client';

import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Copy, Eye, EyeOff, MoreHorizontal, PlusCircle } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { ApiKey } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLogs } from "@/context/LogContext";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";


function ApiKeysTabContent() {
    const { toast } = useToast();
    const { addLog } = useLogs();
    const [isClient, setIsClient] = useState(false);
    const [open, setOpen] = useState(false);
    const [service, setService] = useState('');
    const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();

    const apiKeysQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'apiKeys');
    }, [firestore, user?.uid]);

    const { data: keys, isLoading } = useCollection<ApiKey>(apiKeysQuery);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const serviceMap: { [key: string]: string } = useMemo(() => ({
        whatsapp: "WhatsApp Business",
        twilio: "Twilio",
        crm: "CRM Hubspot",
        other: "Other"
    }), []);

    const handleAddKey = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!apiKeysQuery || !user) return;

        const formData = new FormData(event.currentTarget);
        const newKeyData = {
            service: serviceMap[service] || 'Other',
            key: formData.get('key') as string,
            status: 'active',
            createdAt: serverTimestamp(),
            userId: user.uid,
        };
        
        addDocumentNonBlocking(apiKeysQuery, newKeyData);

        addLog({ service: 'Settings', level: 'info', message: `New API Key added for ${newKeyData.service}.` });
        toast({ title: 'API Key Added', description: `A new key for ${newKeyData.service} has been saved.` });
        setOpen(false);
        setService('');
    }

    const toggleRevealKey = (id: string) => {
        setRevealedKeys(prev => ({ ...prev, [id]: !prev[id] }));
    }

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied to clipboard!' });
    }

    const getDisplayKey = (key: ApiKey) => {
        if (revealedKeys[key.id]) {
            return key.key;
        }
        return `${key.key.substring(0, 4)}...${key.key.substring(key.key.length - 4)}`;
    }
    
    return (
        <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>API Key Management</CardTitle>
                    <CardDescription>Manage credentials for integrated services.</CardDescription>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-1" disabled={isUserLoading || !user}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Key</span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleAddKey}>
                            <DialogHeader>
                            <DialogTitle>Add New API Key</DialogTitle>
                            <DialogDescription>
                                Enter the details for the new service credential. It will be encrypted at rest.
                            </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="service" className="text-right">Service</Label>
                                    <Select name="service" onValueChange={setService} defaultValue="">
                                        <SelectTrigger className="col-span-3">
                                            <SelectValue placeholder="Select a service" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                                            <SelectItem value="twilio">Twilio</SelectItem>
                                            <SelectItem value="crm">CRM Hubspot</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="key" className="text-right">API Key</Label>
                                    <Input id="key" name="key" placeholder="Paste your API key here" className="col-span-3 font-mono" />
                                </div>
                            </div>
                            <DialogFooter>
                            <Button type="submit">Save key</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service</TableHead>
                            <TableHead>API Key</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead><span className="sr-only">Actions</span></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && Array.from({ length: 3 }).map((_, i) => (
                            <TableRow key={i}>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                                <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                            </TableRow>
                        ))}
                        {keys?.map((key) => (
                            <TableRow key={key.id}>
                                <TableCell className="font-medium">{key.service}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 font-mono text-muted-foreground">
                                       <span>{getDisplayKey(key)}</span>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => toggleRevealKey(key.id)}>
                                            {revealedKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => copyToClipboard(key.key)}>
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={key.status === 'active' ? 'default' : 'destructive'} 
                                        className={key.status === 'active' 
                                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-500/50' 
                                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-500/50'
                                        }>
                                        {key.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>{isClient && key.createdAt ? new Date((key.createdAt as any).seconds * 1000).toLocaleDateString() : '...'}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                <MoreHorizontal className="h-4 w-4" />
                                                <span className="sr-only">Toggle menu</span>
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive hover:text-destructive">Revoke</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                 {!isLoading && keys?.length === 0 && (
                    <div className="text-center text-muted-foreground p-8">
                        No API Keys found. Click &quot;Add Key&quot; to get started.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function SettingsPage() {
    return (
        <>
            <Header title="Settings" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Tabs defaultValue="api-keys">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="api-keys">API Keys</TabsTrigger>
                        <TabsTrigger value="billing">Billing</TabsTrigger>
                        <TabsTrigger value="notifications">Notifications</TabsTrigger>
                        <TabsTrigger value="general">General</TabsTrigger>
                    </TabsList>
                    <TabsContent value="api-keys" className="mt-4">
                        <ApiKeysTabContent />
                    </TabsContent>
                    <TabsContent value="billing" className="mt-4">
                       <Card>
                           <CardHeader>
                               <CardTitle>Billing</CardTitle>
                               <CardDescription>Manage your subscription and payment methods.</CardDescription>
                           </CardHeader>
                           <CardContent>
                               <p>Billing settings will be available here.</p>
                           </CardContent>
                       </Card>
                    </TabsContent>
                    <TabsContent value="notifications" className="mt-4">
                       <Card>
                           <CardHeader>
                               <CardTitle>Notifications</CardTitle>
                               <CardDescription>Configure how you receive notifications.</CardDescription>
                           </CardHeader>
                           <CardContent>
                               <p>Notification settings will be available here.</p>
                           </CardContent>
                       </Card>
                    </TabsContent>
                     <TabsContent value="general" className="mt-4">
                       <Card>
                           <CardHeader>
                               <CardTitle>General Settings</CardTitle>
                               <CardDescription>Manage general application settings.</CardDescription>
                           </CardHeader>
                           <CardContent>
                               <p>General application settings will be available here.</p>
                           </CardContent>
                       </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </>
    )
}
