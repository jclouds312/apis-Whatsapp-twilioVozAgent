'use client';

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { exposedApis as initialExposedApis } from "@/lib/data";
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

export default function ApiExhibitionPage() {
    const [open, setOpen] = useState(false);
    const [exposedApis, setExposedApis] = useState<ExposedApi[]>(initialExposedApis);

    const getStatusClass = (status: 'published' | 'draft' | 'deprecated') => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-500/50';
            case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300 border-yellow-200 dark:border-yellow-500/50';
            case 'deprecated': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-500/50';
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
        const formData = new FormData(event.currentTarget);
        const newApi: ExposedApi = {
            id: `api_${Date.now()}`,
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            endpoint: formData.get('endpoint') as string,
            method: formData.get('method') as 'GET' | 'POST' | 'PUT' | 'DELETE',
            version: formData.get('version') as string,
            status: 'draft',
        };
        setExposedApis(prev => [...prev, newApi]);
        setOpen(false);
    }

    return (
        <>
            <Header title="API Exhibition" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Card className="transition-all hover:shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Exposed API Console</CardTitle>
                            <CardDescription>Document, secure, and expose your internal APIs to the world.</CardDescription>
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-1">
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
                                            <Input id="name" name="name" placeholder="e.g., Get Products" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="description" className="text-right">Description</Label>
                                            <Textarea id="description" name="description" placeholder="Describe what this API does." className="col-span-3" />
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
                                                <Input id="endpoint" name="endpoint" placeholder="/v1/products" className="flex-1 font-mono" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="version" className="text-right">Version</Label>
                                            <Input id="version" name="version" placeholder="1.0.0" className="col-span-3" />
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
                                {exposedApis.map((api) => (
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
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button aria-haspopup="true" size="icon" variant="ghost">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem>View Details</DropdownMenuItem>
                                                    <DropdownMenuItem>Disable</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive hover:text-destructive">Delete</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
