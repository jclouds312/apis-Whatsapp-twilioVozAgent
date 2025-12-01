import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Users, TrendingUp, Workflow as WorkflowIcon, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Mock Data
const mockLogs = [
  { id: 1, timestamp: "2024-12-01T10:00:00", level: "info", endpoint: "CRM", message: "Lead synced successfully" },
  { id: 2, timestamp: "2024-12-01T10:05:00", level: "warn", endpoint: "CRM", message: "Duplicate contact detected" },
  { id: 3, timestamp: "2024-12-01T10:10:00", level: "error", endpoint: "CRM", message: "API Rate limit reached" },
];

const mockWorkflows = [
  { id: 1, name: "New Lead -> WhatsApp", trigger: "CRM: New Lead", status: "active" },
  { id: 2, name: "Deal Won -> Notify Team", trigger: "CRM: Deal Update", status: "active" },
  { id: 3, name: "Stale Lead -> Email", trigger: "CRM: No Activity", status: "inactive" },
];

function StatCard({ title, value, description, Icon, iconColor }: any) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function CrmPage() {
  const isCrmConnected = true;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-500" />
          CRM Integration
        </h2>
        <p className="text-muted-foreground">Manage your CRM connection and monitor data sync.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>CRM API Key status.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-2 pt-2">
            {isCrmConnected ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
                <XCircle className="h-6 w-6 text-destructive" />
            )}
            <span className={`text-lg font-medium ${isCrmConnected ? "text-green-600" : "text-destructive"}`}>
                {isCrmConnected ? "Connected" : "Not Connected"}
            </span>
          </CardContent>
        </Card>
        <StatCard 
            title="New Leads (24h)"
            value="18"
            description="From all channels"
            Icon={TrendingUp}
            iconColor="text-blue-500"
        />
        <StatCard 
            title="Contacts Synced"
            value="1,204"
            description="Total in CRM"
            Icon={Users}
            iconColor="text-purple-500"
        />
        <StatCard 
            title="Active CRM Workflows"
            value="2"
            description="Automations involving CRM"
            Icon={WorkflowIcon}
            iconColor="text-orange-500"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent CRM Activity</CardTitle>
            <CardDescription>Live feed of CRM-related events.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLogs.map(log => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground text-xs">{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${log.level === 'info' ? 'bg-blue-500/10 text-blue-500' : 
                          log.level === 'warn' ? 'bg-yellow-500/10 text-yellow-500' : 
                          'bg-red-500/10 text-red-500'}
                      `}>
                        {log.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{log.message}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Related Workflows</CardTitle>
            <CardDescription>Automations that interact with your CRM.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow Name</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWorkflows.map(wf => (
                  <TableRow key={wf.id}>
                    <TableCell className="font-medium">{wf.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{wf.trigger}</TableCell>
                    <TableCell>
                      <Badge variant={wf.status === 'active' ? 'default' : 'secondary'} 
                          className={wf.status === 'active' 
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                              : ''
                          }>
                          {wf.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
