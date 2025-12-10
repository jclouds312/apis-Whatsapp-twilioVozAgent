import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Key, Shield, Globe, Bell, Database, Lock,
  CreditCard, Save, RefreshCw, Eye, EyeOff, Copy
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Settings() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and API configurations</p>
      </div>

      <Tabs defaultValue="api-keys" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
          <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* API Keys Section */}
        <TabsContent value="api-keys" className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                Provider API Keys
              </CardTitle>
              <CardDescription>Configure your external service credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* OpenAI */}
              <div className="space-y-3">
                <Label className="text-base">OpenAI API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showKeys['openai'] ? "text" : "password"}
                      defaultValue="sk-proj-xxxxxxxxxxxxxxxxxxxxxxxx"
                      className="pr-10 font-mono"
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full text-muted-foreground hover:text-foreground"
                        onClick={() => toggleKey('openai')}
                    >
                        {showKeys['openai'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <Button variant="outline" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="text-green-500 border-green-500/20 hover:bg-green-500/10">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Used for Retell AI agents and chat completions.</p>
              </div>

              <Separator />

              {/* Twilio */}
              <div className="space-y-3">
                <Label className="text-base">Twilio Account SID</Label>
                <div className="flex gap-2">
                    <Input defaultValue="ACxxxxxxxxxxxxxxxxxxxxxxxx" className="font-mono" />
                     <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                <Label className="text-base mt-3 block">Twilio Auth Token</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showKeys['twilio'] ? "text" : "password"}
                      defaultValue="xxxxxxxxxxxxxxxxxxxxxxxx"
                      className="pr-10 font-mono"
                    />
                     <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full text-muted-foreground hover:text-foreground"
                        onClick={() => toggleKey('twilio')}
                    >
                        {showKeys['twilio'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                   <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                 <p className="text-xs text-muted-foreground">Required for SMS, Voice, and WhatsApp integration.</p>
              </div>

              <Separator />

              {/* Retell AI */}
               <div className="space-y-3">
                <Label className="text-base">Retell AI API Key</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showKeys['retell'] ? "text" : "password"}
                      defaultValue="key_xxxxxxxxxxxxxxxxxxxxxxxx"
                      className="pr-10 font-mono"
                    />
                     <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full text-muted-foreground hover:text-foreground"
                        onClick={() => toggleKey('retell')}
                    >
                        {showKeys['retell'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                   <Button variant="outline" size="icon">
                        <Copy className="h-4 w-4" />
                    </Button>
                </div>
                 <p className="text-xs text-muted-foreground">Used for managing voice agents and calls.</p>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-primary hover:bg-primary/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Configure global application preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Dark Mode</Label>
                            <p className="text-sm text-muted-foreground">Toggle system-wide dark mode</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                     <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Desktop Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive alerts for new messages and calls</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                    <Separator />
                     <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Sound Effects</Label>
                            <p className="text-sm text-muted-foreground">Play sounds for incoming interactions</p>
                        </div>
                        <Switch defaultChecked />
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

         <TabsContent value="billing">
             <Card>
                 <CardHeader>
                     <CardTitle>Billing & Usage</CardTitle>
                     <CardDescription>Manage your subscription and view usage</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6">
                     <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 flex justify-between items-center">
                         <div>
                             <p className="font-medium text-lg">Enterprise Plan</p>
                             <p className="text-sm text-muted-foreground">Active until Dec 31, 2025</p>
                         </div>
                         <Badge className="bg-primary text-primary-foreground">Active</Badge>
                     </div>
                     
                     <div className="grid gap-4 md:grid-cols-2">
                         <div className="p-4 border rounded-lg">
                             <p className="text-sm font-medium text-muted-foreground">API Calls this month</p>
                             <p className="text-2xl font-bold mt-1">145,230</p>
                             <div className="h-2 bg-muted mt-3 rounded-full overflow-hidden">
                                 <div className="h-full bg-blue-500 w-[65%]" />
                             </div>
                             <p className="text-xs text-muted-foreground mt-2">65% of monthly quota</p>
                         </div>
                          <div className="p-4 border rounded-lg">
                             <p className="text-sm font-medium text-muted-foreground">Storage Used</p>
                             <p className="text-2xl font-bold mt-1">45.2 GB</p>
                             <div className="h-2 bg-muted mt-3 rounded-full overflow-hidden">
                                 <div className="h-full bg-purple-500 w-[45%]" />
                             </div>
                             <p className="text-xs text-muted-foreground mt-2">45% of 100GB limit</p>
                         </div>
                     </div>

                     <Button variant="outline" className="w-full">
                         <CreditCard className="h-4 w-4 mr-2" />
                         Manage Subscription
                     </Button>
                 </CardContent>
             </Card>
         </TabsContent>
      </Tabs>
    </div>
  );
}
