import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ShieldCheck, Smartphone, Mail, Lock, CheckCircle2, AlertCircle,
  Copy, RefreshCw, KeyRound, Scan
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function Verify() {
  const [verificationStep, setVerificationStep] = useState(0);
  const [otpValue, setOtpValue] = useState("");

  const handleVerify = () => {
    if (otpValue.length === 6) {
      setVerificationStep(2);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Twilio Verify
          </h1>
          <p className="text-muted-foreground">Multi-factor authentication and phone verification</p>
        </div>
        <Button>
          <KeyRound className="h-4 w-4 mr-2" />
          Create Service
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
          <CardHeader>
            <CardTitle>Verification Demo</CardTitle>
            <CardDescription>Test the OTP flow in real-time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {verificationStep === 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="flex gap-2">
                    <Input placeholder="+1234567890" defaultValue="+1 (555) 000-0000" />
                    <Button onClick={() => setVerificationStep(1)}>Send Code</Button>
                  </div>
                </div>
                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm text-blue-400 flex gap-2">
                  <InfoIcon className="h-4 w-4 shrink-0 mt-0.5" />
                  <p>This will simulate sending an OTP via SMS using Twilio Verify API.</p>
                </div>
              </div>
            )}

            {verificationStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Enter the 6-digit code sent to your device</p>
                  <div className="flex justify-center py-4">
                    <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Button variant="ghost" size="sm" onClick={() => setVerificationStep(0)}>Change Number</Button>
                    <Button onClick={handleVerify} disabled={otpValue.length !== 6}>Verify</Button>
                  </div>
                </div>
              </div>
            )}

            {verificationStep === 2 && (
              <div className="text-center space-y-4 animate-in zoom-in duration-300">
                <div className="h-16 w-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Verification Successful!</h3>
                  <p className="text-muted-foreground text-sm">The phone number has been verified.</p>
                </div>
                <Button variant="outline" onClick={() => { setVerificationStep(0); setOtpValue(""); }}>
                  Reset Demo
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Active Services</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Login MFA", id: "VA8923...", status: "Active", method: "sms" },
                { name: "Transaction Verify", id: "VA4512...", status: "Active", method: "whatsapp" },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-border bg-background/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-md text-primary">
                      {service.method === "sms" ? <Smartphone className="h-4 w-4" /> : <MessageSquareIcon className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-muted-foreground font-mono">{service.id}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                    {service.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardHeader>
              <CardTitle>Recent Verifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { to: "+1 (555) ***-8899", status: "approved", time: "2 mins ago" },
                  { to: "+1 (555) ***-1234", status: "pending", time: "5 mins ago" },
                  { to: "+44 7*** ***999", status: "expired", time: "1 hour ago" },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="font-mono text-muted-foreground">{log.to}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${
                        log.status === "approved" ? "text-green-500" :
                        log.status === "pending" ? "text-yellow-500" : "text-red-500"
                      }`}>
                        {log.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  )
}

function MessageSquareIcon(props: any) {
    return (
      <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    )
  }
