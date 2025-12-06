import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Download, 
  PhoneIncoming, 
  PhoneOutgoing, 
  MessageSquare 
} from "lucide-react";

const logs = [
  { id: "LOG-9921", type: "call-in", from: "+1 (555) 019-2834", to: "Agent 1", duration: "4m 32s", status: "completed", date: "2024-05-12 10:23" },
  { id: "LOG-9922", type: "msg", from: "System", to: "+1 (555) 992-1122", duration: "-", status: "sent", date: "2024-05-12 10:20" },
  { id: "LOG-9923", type: "call-out", from: "Agent 3", to: "+1 (555) 123-4567", duration: "12m 01s", status: "completed", date: "2024-05-12 09:45" },
  { id: "LOG-9924", type: "call-in", from: "+1 (555) 444-5555", to: "Agent 2", duration: "0m 45s", status: "failed", date: "2024-05-12 09:30" },
  { id: "LOG-9925", type: "msg", from: "+1 (555) 777-8888", to: "System", duration: "-", status: "received", date: "2024-05-12 09:15" },
  { id: "LOG-9926", type: "call-in", from: "+1 (555) 222-3333", to: "Agent 1", duration: "2m 10s", status: "completed", date: "2024-05-12 09:00" },
  { id: "LOG-9927", type: "msg", from: "System", to: "+1 (555) 666-7777", duration: "-", status: "sent", date: "2024-05-12 08:45" },
];

export default function Logs() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Communication Logs</h2>
          <p className="text-muted-foreground">Detailed history of all voice and message interactions.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="glass-panel">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
             <CardTitle className="text-lg">Recent Activity</CardTitle>
             <div className="flex items-center gap-2">
               <div className="relative w-64">
                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search logs..." className="pl-8 h-9 bg-background/50" />
               </div>
               <Button variant="outline" size="icon" className="h-9 w-9">
                 <Filter className="h-4 w-4" />
               </Button>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead>ID</TableHead>
                <TableHead>From</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} className="hover:bg-muted/30 border-border/50">
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {log.type === 'call-in' && <PhoneIncoming className="h-4 w-4 text-emerald-500" />}
                      {log.type === 'call-out' && <PhoneOutgoing className="h-4 w-4 text-blue-500" />}
                      {log.type === 'msg' && <MessageSquare className="h-4 w-4 text-purple-500" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.id}</TableCell>
                  <TableCell className="font-medium">{log.from}</TableCell>
                  <TableCell>{log.to}</TableCell>
                  <TableCell className="text-muted-foreground">{log.duration}</TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={`
                        capitalize 
                        ${log.status === 'completed' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : ''}
                        ${log.status === 'failed' ? 'border-red-500/30 text-red-500 bg-red-500/10' : ''}
                        ${log.status === 'sent' ? 'border-blue-500/30 text-blue-500 bg-blue-500/10' : ''}
                        ${log.status === 'received' ? 'border-purple-500/30 text-purple-500 bg-purple-500/10' : ''}
                      `}
                    >
                      {log.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground font-mono text-xs">{log.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}