import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Send, CheckCircle2, XCircle, Smartphone } from "lucide-react";

export default function VerifyPage() {
  const [verifications] = useState([
    { id: 1, to: "+15551234567", code: "••••••", status: "approved", channel: "whatsapp", time: "2 mins ago" },
    { id: 2, to: "+15559876543", code: "••••••", status: "pending", channel: "sms", time: "5 mins ago" },
    { id: 3, to: "+447700900000", code: "••••••", status: "expired", channel: "whatsapp", time: "1 hour ago" },
  ]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-emerald-500" />
            Twilio Verify
          </h2>
          <p className="text-muted-foreground">Send and validate One-Time Passcodes (OTP) via WhatsApp & SMS.</p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <ShieldCheck className="h-4 w-4 mr-2" />
          Create Service
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Test Verification</CardTitle>
            <CardDescription>Send a code to a user immediately.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Service Name</Label>
              <select className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>Nexus Auth Service (VA82...)</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>To Phone Number</Label>
              <Input placeholder="+1 234 567 8900" className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Channel</Label>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 border-emerald-500/50 text-emerald-500 bg-emerald-500/10">
                  WhatsApp
                </Button>
                <Button variant="outline" className="flex-1">
                  SMS
                </Button>
                <Button variant="outline" className="flex-1">
                  Voice
                </Button>
              </div>
            </div>
            <Button className="w-full">
              <Send className="h-4 w-4 mr-2" />
              Send OTP
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle>Check Verification</CardTitle>
            <CardDescription>Validate a code provided by a user.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>To Phone Number</Label>
              <Input placeholder="+1 234 567 8900" className="font-mono" />
            </div>
            <div className="space-y-2">
              <Label>Enter Code</Label>
              <div className="flex gap-2">
                <Input placeholder="123456" className="font-mono text-center tracking-[0.5em] text-lg" maxLength={6} />
              </div>
            </div>
            <Button variant="secondary" className="w-full">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Validate Code
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle>Recent Verifications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {verifications.map((v) => (
              <div key={v.id} className="flex items-center justify-between p-3 border border-border/50 rounded-lg hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium font-mono">{v.to}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{v.channel}</span>
                      <span>•</span>
                      <span>{v.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className={`
                    ${v.status === 'approved' ? 'border-emerald-500/30 text-emerald-500 bg-emerald-500/10' : 
                      v.status === 'pending' ? 'border-amber-500/30 text-amber-500 bg-amber-500/10' : 
                      'border-zinc-500/30 text-zinc-500 bg-zinc-500/10'}
                  `}>
                    {v.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
