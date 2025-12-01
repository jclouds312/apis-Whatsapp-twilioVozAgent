'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, Send, Loader2 } from 'lucide-react';

export function VerifyForm() {
    const [phoneNumber, setPhoneNumber] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationSent, setVerificationSent] = useState(false);
    const { toast } = useToast();

    const handleSendVerification = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);

        try {
            // Aquí iría la lógica de envío de verificación con Twilio
            toast({
                title: "Verification sent",
                description: `Code sent to ${phoneNumber}`,
            });
            setVerificationSent(true);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to send verification code",
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);

        try {
            // Aquí iría la lógica de verificación del código
            toast({
                title: "Success",
                description: "Phone number verified successfully",
            });
            setPhoneNumber("");
            setVerificationCode("");
            setVerificationSent(false);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Invalid verification code",
            });
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <Card>
          <CardHeader>
            <CardTitle>WhatsApp Verification</CardTitle>
            <CardDescription>
              Send a one-time passcode to a WhatsApp number to verify it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
                {!verificationSent ? (
                    <form onSubmit={handleSendVerification} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+14155552671"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                                disabled={isVerifying}
                            />
                        </div>
                        <Button type="submit" disabled={isVerifying} className="w-full">
                            {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                            {isVerifying ? 'Sending...' : 'Send Verification Code'}
                        </Button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyCode} className="space-y-4">
                        <p className="text-sm text-center text-muted-foreground">
                           A code was sent to <strong>{phoneNumber}</strong>. Please enter it below.
                        </p>
                        <div className="grid gap-2">
                            <Label htmlFor="code">Verification Code</Label>
                            <Input
                                id="code"
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]{6}"
                                placeholder="123456"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                required
                                className="text-center font-mono tracking-widest text-lg h-12"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" disabled={isVerifying} className="w-full">
                                {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                                {isVerifying ? 'Verifying...' : 'Verify Code'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setVerificationSent(false);
                                    setPhoneNumber("");
                                }}
                            >
                                Try Different Number
                            </Button>
                        </div>
                    </form>
                )}
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-xs text-muted-foreground">
                Powered by Twilio Verify API. Ensure your Account SID, Auth Token, and Verify Service SID are set in your environment variables.
            </p>
          </CardFooter>
        </Card>
    );
}