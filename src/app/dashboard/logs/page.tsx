import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { logs } from "@/lib/data";
import { format, parseISO } from "date-fns";
import { cn } from "@/lib/utils";


export default function LogsPage() {
    const getLogLevelClass = (level: 'info' | 'warn' | 'error') => {
        switch (level) {
            case 'info': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'warn': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
        }
    }
    return (
        <>
            <Header title="Logs & Audit Trail" />
            <main className="flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <Card>
                    <CardHeader>
                        <CardTitle>System Logs</CardTitle>
                        <CardDescription>A comprehensive trail of all events and activities.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Timestamp</TableHead>
                                    <TableHead>Level</TableHead>
                                    <TableHead>Service</TableHead>
                                    <TableHead>Message</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell className="text-muted-foreground whitespace-nowrap">
                                            {format(parseISO(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={cn("border", getLogLevelClass(log.level))}>
                                                {log.level}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-medium">{log.service}</TableCell>
                                        <TableCell>{log.message}</TableCell>
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
