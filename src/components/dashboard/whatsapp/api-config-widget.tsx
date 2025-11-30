'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Settings, Phone, Key, Shield, Globe } from 'lucide-react';
import { getWhatsAppConfigStatus } from '@/app/dashboard/whatsapp/actions';
import { Skeleton } from '@/components/ui/skeleton';

interface ConfigStatus {
  isConfigured: boolean;
  hasAccessToken: boolean;
  hasPhoneNumberId: boolean;
  hasMetaAppId: boolean;
  hasMetaAppSecret: boolean;
  apiVersion: string;
  phoneNumberId: string;
  defaultRecipient: string;
}

export function ApiConfigWidget() {
  const [config, setConfig] = useState<ConfigStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConfig() {
      try {
        const status = await getWhatsAppConfigStatus();
        setConfig(status);
      } catch (error) {
        console.error('Failed to load config:', error);
      } finally {
        setLoading(false);
      }
    }
    loadConfig();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const configItems = [
    { 
      label: 'Access Token', 
      configured: config?.hasAccessToken, 
      icon: Key,
      description: 'WhatsApp Business API access token'
    },
    { 
      label: 'Phone Number ID', 
      configured: config?.hasPhoneNumberId, 
      icon: Phone,
      value: config?.phoneNumberId,
      description: 'Meta WhatsApp Phone Number ID'
    },
    { 
      label: 'Meta App ID', 
      configured: config?.hasMetaAppId, 
      icon: Shield,
      description: 'Meta Developer App ID'
    },
    { 
      label: 'Meta App Secret', 
      configured: config?.hasMetaAppSecret, 
      icon: Shield,
      description: 'Meta Developer App Secret'
    },
  ];

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">API Configuration</CardTitle>
          </div>
          <Badge variant={config?.isConfigured ? 'default' : 'destructive'} className="gap-1">
            {config?.isConfigured ? (
              <>
                <CheckCircle className="h-3 w-3" /> Ready
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3" /> Not Configured
              </>
            )}
          </Badge>
        </div>
        <CardDescription>WhatsApp Cloud API credentials status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {configItems.map((item) => (
            <div key={item.label} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <item.icon className="h-4 w-4 text-muted-foreground" />
                <div>
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.value && (
                    <p className="text-xs text-muted-foreground font-mono">{item.value}</p>
                  )}
                </div>
              </div>
              {item.configured ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500" />
              )}
            </div>
          ))}
          
          <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 dark:bg-blue-950/30">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" />
              <div>
                <span className="text-sm font-medium">API Version</span>
                <p className="text-xs text-muted-foreground">Graph API version</p>
              </div>
            </div>
            <Badge variant="outline" className="font-mono">{config?.apiVersion}</Badge>
          </div>

          {config?.defaultRecipient && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-green-50 dark:bg-green-950/30">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-500" />
                <div>
                  <span className="text-sm font-medium">Default Recipient</span>
                  <p className="text-xs text-muted-foreground">Pre-configured test number</p>
                </div>
              </div>
              <Badge variant="outline" className="font-mono">+{config.defaultRecipient}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
