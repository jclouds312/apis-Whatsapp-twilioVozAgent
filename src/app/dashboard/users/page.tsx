
'use client';

import { useState } from "react";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import type { DashboardUser } from "@/lib/types";
import { useUser, useFirestore, useCollection, useMemoFirebase, addDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from '@/firebase';
import { collection, doc } from "firebase/firestore";
import { Skeleton } from "@/components/ui/skeleton";


const roleClasses: Record<string, string> = {
    'Admin': 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300 border-red-200 dark:border-red-500/50',
    'Manager': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-300 border-orange-200 dark:border-orange-500/50',
    'Developer': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200 dark:border-blue-500/50',
    'Agent': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 border-green-200 dark:border-green-500/50',
}


export default function UsersPage() {
    const [addUserOpen, setAddUserOpen] = useState(false);
    
    const { user: authUser, isUserLoading } = useUser();
    const firestore = useFirestore();

    // In a real multi-user app, this would be more complex (e.g., /organizations/{orgId}/users)
    // For simplicity, we assume users can see other users, but rules would lock this down.
    const usersQuery = useMemoFirebase(() => {
        if (!firestore || !authUser?.uid) return null;
        return collection(firestore, 'dashboardUsers');
    }, [firestore, authUser?.uid]);
    
    const { data: users, isLoading } = useCollection<DashboardUser>(usersQuery);

    const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!usersQuery) return;

        const formData = new FormData(event.currentTarget);
        const newUser: Omit<DashboardUser, 'id'> = {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            role: formData.get('role') as DashboardUser['role'],
            avatarUrl: `https://picsum.photos/seed/user${Date.now()}/100/100`
        };
        addDocumentNonBlocking(usersQuery, newUser);
        setAddUserOpen(false);
    }

    const handleUpdateUser = (userId: string, updatedData: Partial<DashboardUser>) => {
       if (!firestore) return;
       const userDocRef = doc(firestore, 'dashboardUsers', userId);
       updateDocumentNonBlocking(userDocRef, updatedData);
    };

    const handleRemoveUser = (userId: string) => {
        if (!firestore) return;
        const userDocRef = doc(firestore, 'dashboardUsers', userId);
        deleteDocumentNonBlocking(userDocRef);
    };

    return (
        <>
            <Header title="Users & Roles" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>User Management</CardTitle>
                            <CardDescription>Manage your team members and their roles.</CardDescription>
                        </div>
                         <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-1" disabled={isUserLoading || !authUser}>
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add User</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <form onSubmit={handleAddUser}>
                                    <DialogHeader>
                                    <DialogTitle>Add New User</DialogTitle>
                                    <DialogDescription>
                                        Invite a new team member to APIs Manager.
                                    </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">Name</Label>
                                            <Input id="name" name="name" placeholder="John Doe" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="email" className="text-right">Email</Label>

                                            <Input id="email" name="email" type="email" placeholder="john@example.com" className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="role" className="text-right">Role</Label>
                                            <Select name="role" defaultValue="Agent">
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Admin">Admin</SelectItem>
                                                    <SelectItem value="Manager">Manager</SelectItem>
                                                    <SelectItem value="Developer">Developer</SelectItem>
                                                    <SelectItem value="Agent">Agent</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                    <Button type="submit">Invite User</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && Array.from({length: 4}).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Skeleton className="h-8 w-8 rounded-full" />
                                                <div>
                                                    <Skeleton className="h-4 w-24 mb-1" />
                                                    <Skeleton className="h-3 w-32" />
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                        <TableCell><Skeleton className="h-8 w-8" /></TableCell>
                                    </TableRow>
                                ))}
                                {users?.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="w-8 h-8">
                                                    <AvatarImage asChild src={user.avatarUrl}>
                                                        <Image src={user.avatarUrl} alt={user.name} width={32} height={32} data-ai-hint="person face"/>
                                                    </AvatarImage>
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                             <Badge variant="outline" className={roleClasses[user.role]}>{user.role}</Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Dialog>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Toggle menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                        <DialogTrigger asChild>
                                                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>Edit</DropdownMenuItem>
                                                        </DialogTrigger>
                                                        <DropdownMenuItem 
                                                            className="text-destructive"
                                                            onClick={() => handleRemoveUser(user.id)}>
                                                            Remove
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                                 <DialogContent>
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault();
                                                        const formData = new FormData(e.currentTarget);
                                                        const updatedData = {
                                                            name: formData.get('name') as string,
                                                            email: formData.get('email') as string,
                                                            role: formData.get('role') as DashboardUser['role'],
                                                        };
                                                        handleUpdateUser(user.id, updatedData);
                                                        // find a way to close the dialog
                                                        const closeButton = e.currentTarget.closest('div[role="dialog"]')?.querySelector('button[aria-label="Close"]');
                                                        if (closeButton instanceof HTMLElement) {
                                                            closeButton.click();
                                                        }
                                                    }}>
                                                        <DialogHeader>
                                                            <DialogTitle>Edit User: {user.name}</DialogTitle>
                                                            <DialogDescription>
                                                                Update the details for this user.
                                                            </DialogDescription>
                                                        </DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor={`name-${user.id}`} className="text-right">Name</Label>
                                                                <Input id={`name-${user.id}`} name="name" defaultValue={user.name} className="col-span-3" />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor={`email-${user.id}`} className="text-right">Email</Label>
                                                                <Input id={`email-${user.id}`} name="email" type="email" defaultValue={user.email} className="col-span-3" />
                                                            </div>
                                                            <div className="grid grid-cols-4 items-center gap-4">
                                                                <Label htmlFor={`role-${user.id}`} className="text-right">Role</Label>
                                                                <Select name="role" defaultValue={user.role}>
                                                                    <SelectTrigger className="col-span-3">
                                                                        <SelectValue placeholder="Select a role" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="Admin">Admin</SelectItem>
                                                                        <SelectItem value="Manager">Manager</SelectItem>
                                                                        <SelectItem value="Developer">Developer</SelectItem>
                                                                        <SelectItem value="Agent">Agent</SelectItem>
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
                         {!isLoading && users?.length === 0 && (
                            <div className="text-center text-muted-foreground p-8">
                                No users found. Click &quot;Add User&quot; to get started.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </>
    )
}
