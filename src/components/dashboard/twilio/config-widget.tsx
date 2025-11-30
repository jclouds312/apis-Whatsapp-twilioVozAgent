
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Shield, Key, Settings } from "lucide-react";

export function TwilioConfigWidget() {
    return (
        <div className="grid gap-6 lg:grid-cols-2">
            <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        API Credentials
                    </CardTitle>
                    <CardDescription>Manage your Twilio account credentials</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Account SID</Label>
                        <Input type="password" placeholder="AC..." className="font-mono" />
                        <p className="text-xs text-muted-foreground">Your Twilio Account SID</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Auth Token</Label>
                        <Input type="password" placeholder="..." className="font-mono" />
                        <p className="text-xs text-muted-foreground">Your Twilio Auth Token</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Verify Service SID</Label>
                        <Input type="text" placeholder="VA..." className="font-mono" />
                        <p className="text-xs text-muted-foreground">For WhatsApp verification service</p>
                    </div>
                    <Separator />
                    <Button className="w-full">Update Credentials</Button>
                    <p className="text-xs text-muted-foreground text-center">
                        Credentials are encrypted and stored securely. Managed in{' '}
                        <a href="/dashboard/settings" className="text-primary underline">Settings</a>
                    </p>
                </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        Voice Settings
                    </CardTitle>
                    <CardDescription>Configure voice call preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Call Recording</Label>
                            <p className="text-sm text-muted-foreground">Automatically record all calls</p>
                        </div>
                        <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Voicemail Detection</Label>
                            <p className="text-sm text-muted-foreground">Detect when calls go to voicemail</p>
                        </div>
                        <Switch />
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label>Transcription</Label>
                            <p className="text-sm text-muted-foreground">Transcribe call recordings</p>
                        </div>
                        <Switch />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                        <Label>Default Caller ID</Label>
                        <Input type="tel" placeholder="+1234567890" className="font-mono" />
                        <p className="text-xs text-muted-foreground">Phone number to display for outbound calls</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 transition-all hover:shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Webhook Configuration
                    </CardTitle>
                    <CardDescription>Configure webhooks for call events</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm font-medium mb-2">Status Callback URL</p>
                            <code className="text-xs font-mono break-all p-2 rounded bg-slate-100 dark:bg-slate-900 block">
                                https://your-repl.replit.app/api/twilio/status
                            </code>
                        </div>
                        <div className="p-4 rounded-lg bg-muted/50">
                            <p className="text-sm font-medium mb-2">Recording Callback URL</p>
                            <code className="text-xs font-mono break-all p-2 rounded bg-slate-100 dark:bg-slate-900 block">
                                https://your-repl.replit.app/api/twilio/recording
                            </code>
                        </div>
                    </div>
                    <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950/30">
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">Webhook Events</p>
                        <ul className="text-xs text-blue-600 dark:text-blue-400 list-disc list-inside space-y-1">
                            <li>call-initiated - When a call starts</li>
                            <li>call-completed - When a call ends</li>
                            <li>recording-completed - When a recording is ready</li>
                            <li>voicemail-detected - When voicemail is detected</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
