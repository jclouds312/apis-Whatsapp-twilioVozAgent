import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { exposedApis } from "@/lib/data";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export default function ApiExhibitionPage() {
    const getStatusClass = (status: 'published' | 'draft' | 'deprecated') => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300';
            case 'draft': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-300';
            case 'deprecated': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-300';
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

    return (
        <>
            <Header title="API Exhibition" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Exposed API Console</CardTitle>
                            <CardDescription>Document, secure, and expose your internal APIs to the world.</CardDescription>
                        </div>
                        <Button size="sm" className="gap-1">
                            <PlusCircle className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Expose API</span>
                        </Button>
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
                                            <Badge variant="outline" className={cn("font-mono", getMethodClass(api.method))}>{api.method}</Badge>
                                            <span className="ml-2 font-mono text-muted-foreground">{api.endpoint}</span>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("border", getStatusClass(api.status))}>
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
                                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
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
