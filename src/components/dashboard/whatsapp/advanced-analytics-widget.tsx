
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, TrendingUp, Users, Clock, RefreshCw, Download } from 'lucide-react';
import { getWhatsAppAnalytics, getWhatsAppQualityInfo } from '@/app/dashboard/whatsapp/actions';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';

export function AdvancedAnalyticsWidget() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [qualityInfo, setQualityInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const endDate = Math.floor(Date.now() / 1000);
      const startDate = endDate - 30 * 24 * 60 * 60; // 30 days

      const [analyticsResult, qualityResult] = await Promise.all([
        getWhatsAppAnalytics(startDate, endDate),
        getWhatsAppQualityInfo()
      ]);

      if (analyticsResult.success) {
        setAnalytics(analyticsResult.analytics);
      }

      if (qualityResult.success) {
        setQualityInfo(qualityResult);
      }
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>
    );
  }

  const getQualityColor = (rating?: string) => {
    switch (rating?.toLowerCase()) {
      case 'green': return 'bg-green-500';
      case 'yellow': return 'bg-yellow-500';
      case 'red': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
      <CardHeader className="bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <CardTitle>Advanced Analytics</CardTitle>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={loadAnalytics}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>Performance metrics and quality indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {qualityInfo && (
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Quality Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`h-3 w-3 rounded-full ${getQualityColor(qualityInfo.quality?.quality_rating)}`} />
                <Badge className="capitalize">{qualityInfo.quality?.quality_rating || 'Unknown'}</Badge>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Platform</span>
              </div>
              <Badge variant="outline">{qualityInfo.quality?.platform_type || 'Cloud'}</Badge>
            </div>
          </div>
        )}

        {qualityInfo?.limit && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Message Limit</span>
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                Current Period
              </Badge>
            </div>
            <Progress value={75} className="h-2" />
            <p className="text-xs text-muted-foreground">
              Based on your business verification status
            </p>
          </div>
        )}

        {analytics && (
          <div className="p-4 rounded-lg bg-muted/50 border">
            <h4 className="font-semibold mb-2 text-sm">Analytics Data (Last 30 Days)</h4>
            <pre className="text-xs overflow-auto max-h-48 bg-slate-900 text-slate-100 p-3 rounded">
              {JSON.stringify(analytics, null, 2)}
            </pre>
          </div>
        )}

        {!analytics && !qualityInfo && (
          <div className="text-center p-8 text-muted-foreground">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No analytics data available</p>
            <p className="text-xs">Configure your Meta credentials to see analytics</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
