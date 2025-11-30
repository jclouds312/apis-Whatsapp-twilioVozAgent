'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown, MessageSquare, Send, Inbox, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';
import { getMessageStats } from '@/app/dashboard/whatsapp/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface Stats {
  totalSent: number;
  totalReceived: number;
  totalErrors: number;
  last24Hours: {
    sent: number;
    received: number;
    errors: number;
  };
}

export function MessageStatsWidget() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadStats = async () => {
    try {
      const result = await getMessageStats();
      if (result.success && result.stats) {
        setStats(result.stats);
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const totalMessages = (stats?.totalSent || 0) + (stats?.totalReceived || 0);
  const successRate = totalMessages > 0 
    ? Math.round(((totalMessages - (stats?.totalErrors || 0)) / totalMessages) * 100) 
    : 100;

  const statItems = [
    {
      label: 'Sent',
      value: stats?.totalSent || 0,
      recent: stats?.last24Hours.sent || 0,
      icon: Send,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      label: 'Received',
      value: stats?.totalReceived || 0,
      recent: stats?.last24Hours.received || 0,
      icon: Inbox,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-950/30'
    },
    {
      label: 'Errors',
      value: stats?.totalErrors || 0,
      recent: stats?.last24Hours.errors || 0,
      icon: AlertTriangle,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-950/30'
    },
  ];

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-500" />
            <CardTitle className="text-lg">Message Statistics</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <CardDescription>WhatsApp API message analytics from Firestore logs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {statItems.map((item) => (
            <div key={item.label} className={`p-4 rounded-lg ${item.bgColor} border-2 border-transparent hover:border-current transition-all cursor-pointer`}>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-md bg-white dark:bg-slate-900`}>
                  <item.icon className={`h-4 w-4 ${item.color}`} />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
              <div className="text-2xl font-bold">{item.value.toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUp className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {item.recent} last 24h
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Success Rate</span>
            <Badge variant={successRate >= 95 ? 'default' : successRate >= 80 ? 'secondary' : 'destructive'}>
              {successRate}%
            </Badge>
          </div>
          <Progress value={successRate} className="h-2" />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">Total Messages</span>
            </div>
            <div className="text-xl font-bold mt-1">{totalMessages.toLocaleString()}</div>
          </div>
          <div className="p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-2">
              <ArrowDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">24h Activity</span>
            </div>
            <div className="text-xl font-bold mt-1">
              {((stats?.last24Hours.sent || 0) + (stats?.last24Hours.received || 0)).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
