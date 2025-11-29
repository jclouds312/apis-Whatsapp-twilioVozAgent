'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import type { Conversation, Order } from "@/lib/types";
import { Mail, Phone } from "lucide-react";

interface ContactPanelProps {
    contact: Conversation | null;
}

export function ContactPanel({ contact }: ContactPanelProps) {
    if (!contact) {
        return (
            <div className="flex h-full items-center justify-center bg-muted/50">
                <div className="text-center">
                    <p className="text-sm text-muted-foreground">No contact selected</p>
                </div>
            </div>
        );
    }
    return (
        <div className="flex h-full flex-col border-l bg-background">
            <ScrollArea className="flex-1">
                <div className="flex flex-col items-center p-6 gap-4 border-b">
                    <Avatar className="h-20 w-20">
                        <AvatarImage src={contact.contactAvatar} alt={contact.contactName} />
                        <AvatarFallback>{contact.contactName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <h3 className="text-lg font-semibold">{contact.contactName}</h3>
                        <p className="text-sm text-muted-foreground">{contact.contactEmail}</p>
                    </div>
                     <div className="flex gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <span>{contact.contactId}</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 space-y-4">
                    
                    <Card>
                        <CardHeader className="p-3">
                            <CardTitle className="text-base">Tags</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <div className="flex flex-wrap gap-1">
                                {contact.tags.map(tag => (
                                    <Badge key={tag} variant="secondary">{tag}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader className="p-3">
                            <CardTitle className="text-base">Agent Notes</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <Textarea 
                                placeholder="Add a note for your team..." 
                                defaultValue={contact.agentNotes}
                                className="text-sm"
                            />
                             <Button size="sm" className="mt-2 w-full">Save Note</Button>
                        </CardContent>
                    </Card>
                    
                     <Card>
                        <CardHeader className="p-3">
                            <CardTitle className="text-base">Order History</CardTitle>
                        </CardHeader>
                        <CardContent className="p-3 pt-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="h-8">Order ID</TableHead>
                                        <TableHead className="h-8">Total</TableHead>
                                        <TableHead className="h-8">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {contact.orderHistory.map(order => (
                                        <TableRow key={order.id}>
                                            <TableCell className="py-2 text-xs">{order.id}</TableCell>
                                            <TableCell className="py-2 text-xs">${order.total.toFixed(2)}</TableCell>
                                            <TableCell className="py-2 text-xs">
                                                 <Badge variant={order.status === 'Completed' ? 'default' : 'outline'}
                                                    className={order.status === 'Completed' ? 'bg-green-100 text-green-800' : ''}
                                                 >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {contact.orderHistory.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center text-xs text-muted-foreground py-4">No orders found.</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </ScrollArea>
        </div>
    );
}
