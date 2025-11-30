
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Phone, Mail, MoreHorizontal, Trash2, Edit } from "lucide-react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from "@/hooks/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function VoiceUsersWidget() {
    const [addUserOpen, setAddUserOpen] = useState(false);
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    const voiceUsersQuery = useMemoFirebase(() => {
        if (!firestore || !user?.uid) return null;
        return query(
            collection(firestore, 'users', user.uid, 'voiceUsers'),
            orderBy('createdAt', 'desc')
        );
    }, [firestore, user?.uid]);
    const { data: voiceUsers } = useCollection(voiceUsersQuery);

    const handleAddUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firestore || !user?.uid) return;

        try {
            await addDoc(collection(firestore, 'users', user.uid, 'voiceUsers'), {
                name,
                phoneNumber,
                email,
                status: 'active',
                totalCalls: 0,
                totalDuration: 0,
                createdAt: serverTimestamp()
            });

            toast({
                title: "User Added",
                description: `${name} has been added to voice users`,
                className: 'bg-green-100 dark:bg-green-900'
            });

            setAddUserOpen(false);
            setName('');
            setPhoneNumber('');
            setEmail('');
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to add user"
            });
        }
    };

    return (
        <Card className="transition-all hover:shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Voice Users Registry</CardTitle>
                    <CardDescription>Manage users authorized for voice communications</CardDescription>
                </div>
                <Dialog open={addUserOpen} onOpenChange={setAddUserOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Add User
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={handleAddUser}>
                            <DialogHeader>
                                <DialogTitle>Add Voice User</DialogTitle>
                                <DialogDescription>Register a new user for voice communications</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        placeholder="+1234567890"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button type="submit" className="w-full">Add User</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardHeader>
            <CardContent>
                {voiceUsers && voiceUsers.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Phone</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Calls</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {voiceUsers.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="font-mono text-sm">{user.phoneNumber}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{user.email || 'N/A'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{user.totalCalls || 0}</TableCell>
                                    <TableCell>
                                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                            {user.status || 'active'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="sm">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                                <DropdownMenuItem>
                                                    <Edit className="h-4 w-4 mr-2" />
                                                    Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        <UserPlus className="mx-auto h-16 w-16 mb-4 opacity-50" />
                        <p className="text-lg font-medium">No users registered</p>
                        <p className="text-sm">Add users to enable voice communications</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
