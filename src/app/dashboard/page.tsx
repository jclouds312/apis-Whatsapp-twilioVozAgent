'use client';

import { useState, useEffect } from 'react';
import { Header } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { AreaChartComponent } from "@/components/charts/area-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { workflows, logs } from "@/lib/data";
import { Activity, CreditCard, DollarSign, Users, Workflow, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

const initialApiTrafficData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return {
        date: d.toISOString().split('T')[0],
        'API Calls': 0,
    };
});

export default function DashboardPage() {
    const [apiTrafficData, setApiTrafficData] = useState(initialApiTrafficData);
    const totalApiCalls = apiTrafficData.reduce((sum, item) => sum + item['API Calls'], 0);
    const activeWorkflows = workflows.filter(w => w.status === 'active').length;
    const errorsToday = logs.filter(l => l.level === 'error').length;

    useEffect(() => {
        const interval = setInterval(() => {
            setApiTrafficData(prevData => {
                const newData = [...prevData];
                const lastIndex = newData.length - 1;
                // Add a random number of calls to the last data point
                newData[lastIndex] = {
                    ...newData[lastIndex],
                    'API Calls': newData[lastIndex]['API Calls'] + Math.floor(Math.random() * 50) + 10,
                };
                return newData;
            });
        }, 3000); // Update every 3 seconds

        return () => clearInterval(interval);
    }, []);


  return (
    <>
      <Header title="Dashboard" />
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
                title="Total API Calls (Live)"
                value={totalApiCalls.toLocaleString()}
                description="Updating in real-time"
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
                    <CardDescription>Live connection</CardDescription>
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
