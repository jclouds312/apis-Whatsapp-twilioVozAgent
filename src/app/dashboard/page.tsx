import { Header } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AreaChartComponent } from "@/components/charts/area-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { workflows, logs, apiTrafficData } from "@/lib/data";
import { Activity, CreditCard, DollarSign, Users, Workflow, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
    const totalApiCalls = apiTrafficData.reduce((sum, item) => sum + item['API Calls'], 0);
    const activeWorkflows = workflows.filter(w => w.status === 'active').length;
    const errorsToday = logs.filter(l => l.level === 'error').length;
  return (
    <>
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Total API Calls (7d)"
                value={totalApiCalls.toLocaleString()}
                description="+20.1% from last week"
                Icon={Activity}
            />
            <StatCard 
                title="Active Workflows"
                value={activeWorkflows.toString()}
                description="Automating your business"
                Icon={Workflow}
            />
            <StatCard 
                title="Errors (24h)"
                value={errorsToday.toString()}
                description="Needs attention"
                Icon={AlertCircle}
            />
            <StatCard 
                title="Active Users"
                value="4"
                description="Across all roles"
                Icon={Users}
            />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
                <CardHeader>
                    <CardTitle>API Traffic</CardTitle>
                    <CardDescription>Last 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                    <AreaChartComponent data={apiTrafficData} dataKey="API Calls" xAxisKey="date" />
                </CardContent>
            </Card>
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest logs from all services.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-72">
                    <div className="space-y-4">
                      {logs.slice(0, 5).map((log) => (
                        <div key={log.id} className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                            {log.level === 'error' && <AlertCircle className="h-5 w-5 text-destructive" />}
                            {log.level === 'warn' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                            {log.level === 'info' && <Activity className="h-5 w-5 text-blue-500" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-none">
                              <span className="font-semibold text-primary">{log.service}:</span> {log.message}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
            </Card>
        </div>
      </main>
    </>
  );
}
