import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Facebook,
  MessageCircle,
  Share2,
  BarChart3,
  Users,
  Settings,
  Globe,
  ShieldCheck,
  Code,
  Zap,
  Smartphone,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend } from "recharts";

// Mock Data for Facebook SDK Metrics
const engagementData = [
  { time: "00:00", impressions: 1200, clicks: 45, conversions: 12 },
  { time: "04:00", impressions: 800, clicks: 32, conversions: 8 },
  { time: "08:00", impressions: 3500, clicks: 180, conversions: 45 },
  { time: "12:00", impressions: 5800, clicks: 420, conversions: 120 },
  { time: "16:00", impressions: 4900, clicks: 380, conversions: 95 },
  { time: "20:00", impressions: 2800, clicks: 150, conversions: 45 },
  { time: "23:59", impressions: 1500, clicks: 80, conversions: 20 },
];

export default function FacebookIntegrationPage() {
  const [sdkStatus, setSdkStatus] = useState("active");

  return (
    <div className="space-y-6">
      {/* Header Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-800 p-8 shadow-xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="absolute bottom-[-50%] right-[-10%] w-[400px] h-[400px] bg-white/30 rounded-full blur-[80px]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="text-white">
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                Meta Graph API v19.0
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-100 border-green-500/30 flex items-center gap-1 backdrop-blur-sm">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                SDK Initialized
              </Badge>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight mb-2 flex items-center gap-3">
              <Facebook className="h-10 w-10" /> Facebook Integration
            </h1>
            <p className="text-blue-100 text-lg max-w-2xl">
              Gestión completa de Meta Business Suite. Login, Analytics, Pixel y Conversiones API.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="secondary" className="bg-white text-blue-700 hover:bg-blue-50">
              <Code className="mr-2 h-4 w-4" /> SDK Docs
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <Settings className="mr-2 h-4 w-4" /> App Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-slate-900/50 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ShieldCheck className="h-5 w-5 text-blue-600" /> Facebook Login
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Autenticación segura y gestión de permisos de usuario.
            </p>
            <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
              <span className="text-sm font-medium">Status</span>
              <Badge className="bg-green-500">Active</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50 dark:bg-slate-900/50 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-purple-600" /> Analytics & Pixel
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Rastreo de eventos y conversiones en tiempo real.
            </p>
            <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
              <span className="text-sm font-medium">Events (24h)</span>
              <span className="font-mono font-bold">12,450</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-pink-200 bg-pink-50/50 dark:bg-slate-900/50 dark:border-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageCircle className="h-5 w-5 text-pink-600" /> Messenger API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Chatbots y automatización de respuestas.
            </p>
            <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
              <span className="text-sm font-medium">Active Threads</span>
              <span className="font-mono font-bold">45</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="analytics" className="space-y-6">
        <TabsList className="bg-slate-100 dark:bg-slate-900 p-1">
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="pixel" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            Pixel Config
          </TabsTrigger>
          <TabsTrigger value="login" className="data-[state=active]:bg-white dark:data-[state=active]:bg-slate-800">
            Login Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Overview</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="colorImpressions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorConversions" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)" }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="impressions" stroke="#3b82f6" fillOpacity={1} fill="url(#colorImpressions)" />
                  <Area type="monotone" dataKey="conversions" stroke="#10b981" fillOpacity={1} fill="url(#colorConversions)" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pixel">
           <Card>
            <CardHeader>
              <CardTitle>Meta Pixel Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-900">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Pixel Active</AlertTitle>
                <AlertDescription>
                  Pixel ID: 849302849302 is firing correctly. Last event received 2m ago.
                </AlertDescription>
              </Alert>
              
              <div className="grid gap-4">
                 <div className="p-4 border rounded-lg">
                   <h4 className="font-medium mb-2">Standard Events</h4>
                   <div className="grid grid-cols-2 gap-2 text-sm">
                     <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500"/> PageView</div>
                     <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500"/> Lead</div>
                     <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500"/> CompleteRegistration</div>
                     <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-green-500"/> Purchase</div>
                   </div>
                 </div>
              </div>
            </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
