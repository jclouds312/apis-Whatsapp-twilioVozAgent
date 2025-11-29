import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { apiKeys } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ApiKeysPage() {
    return (
        <>
            <Header title="API Keys" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>API Key Management</CardTitle>
                            <CardDescription>Manage credentials for integrated services.</CardDescription>
                        </div>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="sm" className="gap-1">
                                    <PlusCircle className="h-3.5 w-3.5" />
                                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Add Key</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                <DialogTitle>Add New API Key</DialogTitle>
                                <DialogDescription>
                                    Enter the details for the new service credential. It will be encrypted at rest.
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="service" className="text-right">Service</Label>
                                        <Select>
                                            <SelectTrigger className="col-span-3">
                                                <SelectValue placeholder="Select a service" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="whatsapp">WhatsApp Business</SelectItem>
                                                <SelectItem value="twilio">Twilio</SelectItem>
                                                <SelectItem value="crm">CRM</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="key" className="text-right">API Key</Label>
                                        <Input id="key" placeholder="Paste your API key here" className="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                <Button type="submit">Save key</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Key (Partial)</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead><span className="sr-only">Actions</span></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {apiKeys.map((key) => (
                                    <TableRow key={key.id}>
                                        <TableCell className="font-medium">{key.service}</TableCell>
                                        <TableCell>{key.key.substring(0, 18)}...</TableCell>
                                        <TableCell>
                                            <Badge variant={key.status === 'active' ? 'default' : 'destructive'} className={key.status === 'active' ? 'bg-green-500' : ''}>
                                                {key.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{new Date(key.createdAt).toLocaleDateString()}</TableCell>
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
                                                    <DropdownMenuItem className="text-destructive">Revoke</DropdownMenuItem>
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
