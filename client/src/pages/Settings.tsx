import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, Key, Globe, MessageCircle, Phone } from "lucide-react";

export default function Settings() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Configuration</h2>
        <p className="text-muted-foreground">Manage API keys, webhooks, and agent behavior.</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="twilio">Twilio Voice</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6 space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle>Agent Identity</CardTitle>
              <CardDescription>Configure how your AI agent presents itself.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="agent-name">Agent Name</Label>
                <Input id="agent-name" defaultValue="Nexus Support" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="welcome-msg">Welcome Message</Label>
                <Input id="welcome-msg" defaultValue="Hello! This is Nexus Support. How can I assist you today?" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="twilio" className="mt-6 space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Twilio Configuration
              </CardTitle>
              <CardDescription>Connect your Twilio account for voice capabilities.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="account-sid">Account SID</Label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="account-sid" className="pl-9 font-mono" placeholder="AC..." type="password" value="ACxxxxxxxxxxxxxxxxxxxxxxxx" readOnly />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="auth-token">Auth Token</Label>
                <div className="relative">
                  <Key className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="auth-token" className="pl-9 font-mono" type="password" value="xxxxxxxxxxxxxxxxxxxxxxxx" readOnly />
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Record Calls</Label>
                  <p className="text-xs text-muted-foreground">Automatically record all incoming/outgoing calls</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="whatsapp" className="mt-6 space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-emerald-500" />
                WhatsApp Business API
              </CardTitle>
              <CardDescription>Configure messaging settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="phone-id">Phone Number ID</Label>
                <Input id="phone-id" className="font-mono" placeholder="1029384..." />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="webhook">Webhook URL</Label>
                <div className="relative">
                  <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input id="webhook" className="pl-9" defaultValue="https://api.nexus-agent.com/v1/webhook/whatsapp" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-4">
        <Button variant="ghost">Cancel</Button>
        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}