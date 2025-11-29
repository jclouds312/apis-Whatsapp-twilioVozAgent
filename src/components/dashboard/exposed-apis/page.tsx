'use client';

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ExposedApi } from "@/lib/types";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";


export default function ExposedApisPage() {
    const [addOpen, setAddOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedApi, setSelectedApi] = useState<ExposedApi | null>(null);

    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const exposedApisQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return collection(firestore, 'users', user.uid, 'exposedApis');
    }, [firestore, user?.uid]);

    const { data: exposedApis, isLoading } = useCollection<ExposedApi>(exposedApisQuery);

    const getStatusClass = (status: 'published' | 'draft' | 'deprecated') => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-500/50';
            case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/50';
            case 'deprecated': return 'bg-destructive/10 text-destructive dark:bg-destructive/20 border-destructive/20';
        }
    };

    const getMethodClass = (method: 'GET' | 'POST' | 'PUT' | 'DELETE') => {
         switch (method) {
            case 'GET': return 'text-blue-600 dark:text-blue-400';
            case 'POST': return 'text-green-600 dark:text-green-400';
            case 'PUT': return 'text-orange-600 dark:text-orange-400';
            case 'DELETE': return 'text-red-600 dark:text-red-400';
        }
    }

    const handleAddApi = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!exposedApisQuery || !user) return;

        const formData = new FormData(event.currentTarget);
        const newApiData: Omit<ExposedApi, 'id'> = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            endpoint: formData.get('endpoint') as string,
            method: formData.get('method') as 'GET' | 'POST' | 'PUT' | 'DELETE',
            version: formData.get('version') as string,
            status: 'draft',
            userId: user.uid,
        };
        
        addDocumentNonBlocking(exposedApisQuery, newApiData);
        toast({ title: 'API Exposed', description: `API "${newApiData.name}" has been saved as a draft.`});
        setAddOpen(false);
    }
    
    const handleUpdateApi = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!firestore || !user?.uid || !selectedApi) return;

        const formData = new FormData(event.currentTarget);
        const updatedData: Partial<ExposedApi> = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            endpoint: formData.get('endpoint') as string,
            method: formData.get('method') as 'GET' | 'POST' | 'PUT' | 'DELETE',
            version: formData.get('version') as string,
            status: formData.get('status') as 'published' | 'draft' | 'deprecated',
        };
        
        const apiDocRef = doc(firestore, 'users', user.uid, 'exposedApis', selectedApi.id);
        updateDocumentNonBlocking(apiDocRef, updatedData);
        toast({ title: 'API Updated', description: `API "${updatedData.name}" has been successfully updated.`});
        setEditOpen(false);
        setSelectedApi(null);
    }
    
    const handleDeleteApi = (api: ExposedApi) => {
        if(!firestore || !user?.uid) return;
        const apiDocRef = doc(firestore, 'users', user.uid, 'exposedApis', api.id);
        deleteDocumentNonBlocking(apiDocRef);
        toast({ variant: 'destructive', title: 'API Deleted', description: `API "${api.name}" has been permanently deleted.`});
    }

    return (
        <>
            <Header title="Exposed APIs" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Card className="transition-all hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Exposed API Console</CardTitle>
                            <CardDescription>Document, secure, and expose your internal APIs to other systems.</CardDescription>
                        </div>
                        <Dialog open={addOpen} onOpenChange={setAddOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-1" disabled={isUserLoading || !user}>
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Expose API</span>
                                </Button>
                            </DialogTrigger>
                             <DialogContent>
                                <form onSubmit={handleAddApi}>
                                    <DialogHeader>
                                        <DialogTitle>Expose a New API</DialogTitle>
                                        <DialogDescription>
                                            Define a new internal API to be documented and exposed.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">API Name</Label>
                                            <Input id="name" name="name" placeholder="e.g., Get Products" className="col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="description" className="text-right">Description</Label>
                                            <Textarea id="description" name="description" placeholder="Describe what this API does." className="col-span-3" required />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="endpoint" className="text-right">Endpoint</Label>
                                            <div className="col-span-3 flex gap-2">
                                                <Select name="method" defaultValue="GET">
                                                    <SelectTrigger className="w-[100px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="GET">GET</SelectItem>
                                                        <SelectItem value="POST">POST</SelectItem>
                                                        <SelectItem value="PUT">PUT</SelectItem>
                                                        <SelectItem value="DELETE">DELETE</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <Input id="endpoint" name="endpoint" placeholder="/v1/products" className="flex-1 font-mono" required/>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="version" className="text-right">Version</Label>
                                            <Input id="version" name="version" placeholder="1.0.0" className="col-span-3" required/>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Save as Draft</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>API Name</TableHead>
                                    <TableHead>Endpoint</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Version</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && Array.from({length: 3}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))}
                                {exposedApis?.map((api) => (
                                    <TableRow key={api.id}>
                                        <TableCell className="font-medium">{api.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("font-mono font-semibold", getMethodClass(api.method))}>{api.method}</Badge>
                                            <span className="ml-2 font-mono text-muted-foreground">{api.endpoint}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("border font-semibold", getStatusClass(api.status))}>
                                                {api.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{api.version}</TableCell>
                                        <TableCell>
                                            <Dialog open={editOpen && selectedApi?.id === api.id} onOpenChange={(open) => { if (!open) setSelectedApi(null); setEditOpen(open)}}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DropdownMenuItem onSelect={() => { setSelectedApi(api); setEditOpen(true); }}>Edit</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDeleteApi(api)}>Delete</DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                 <DialogContent>
                                                    <form onSubmit={handleUpdateApi}>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit Exposed API</DialogTitle>
                                                            <DialogDescription>
                                                                Update the configuration for this exposed API.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="name-edit" className="text-right">API Name</Label>
                                                                <Input id="name-edit" name="name" defaultValue={api.name} className="col-span-3" required />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="description-edit" className="text-right">Description</Label>
                                                                <Textarea id="description-edit" name="description" defaultValue={api.description} className="col-span-3" required />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="endpoint-edit" className="text-right">Endpoint</Label>
                                                                <div className="col-span-3 flex gap-2">
                                                                    <Select name="method" defaultValue={api.method}>
                                                                        <SelectTrigger className="w-[100px]"><SelectValue /></SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="GET">GET</SelectItem>
                                                                            <SelectItem value="POST">POST</SelectItem>
                                                                            <SelectItem value="PUT">PUT</SelectItem>
                                                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                    <Input id="endpoint-edit" name="endpoint" defaultValue={api.endpoint} className="flex-1 font-mono" required />
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="version-edit" className="text-right">Version</Label>
                                                                <Input id="version-edit" name="version" defaultValue={api.version} className="col-span-3" required />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor="status-edit" className="text-right">Status</Label>
                                                                 <Select name="status" defaultValue={api.status}>
                                                                    <SelectTrigger className="col-span-3"><SelectValue /></SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="draft">Draft</SelectItem>
                                                                        <SelectItem value="published">Published</SelectItem>
                                                                        <SelectItem value="deprecated">Deprecated</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button type="submit">Save Changes</Button>
                                                        </DialogFooter>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                         {!isLoading && exposedApis?.length === 0 && (
                            <div className="text-center text-muted-foreground p-8">
                                No exposed APIs yet. Click &quot;Expose API&quot; to get started.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
