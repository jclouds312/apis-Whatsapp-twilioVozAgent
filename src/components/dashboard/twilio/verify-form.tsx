
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sendVerificationCode, verifyCode } from '@/app/dashboard/twilio/actions';
import { Loader2 } from 'lucide-react';

interface VerifyFormProps {
    onVerificationSuccess?: (phoneNumber: string) => void;
}

export function VerifyForm({ onVerificationSuccess }: VerifyFormProps) {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [verificationSent, setVerificationSent] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const { toast } = useToast();

    const handleSendCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSending(true);

        try {
            const result = await sendVerificationCode(phoneNumber);
            
            if (result.success) {
                toast({
                    title: "Code Sent",
                    description: result.message,
                });
                setVerificationSent(true);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.message,
                });
            }
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to send verification code",
            });
        } finally {
            setIsSending(false);
        }
    };

    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);

        try {
            const result = await verifyCode(phoneNumber, verificationCode);
            
            if (result.success) {
                toast({
                    title: "Success",
                    description: result.message,
                });
                onVerificationSuccess?.(phoneNumber);
                setPhoneNumber("");
                setVerificationCode("");
                setVerificationSent(false);
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: result.message,
                });
            }
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

    if (!verificationSent) {
        return (
            <form onSubmit={handleSendCode} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                        disabled={isSending}
                    />
                    <p className="text-xs text-muted-foreground">
                        Enter phone number with country code (e.g., +1 for USA)
                    </p>
                </div>
                <Button type="submit" className="w-full" disabled={isSending}>
                    {isSending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        'Send Verification Code'
                    )}
                </Button>
            </form>
        );
    }

    return (
        <form onSubmit={handleVerifyCode} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                    id="code"
                    type="text"
                    placeholder="123456"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    required
                    disabled={isVerifying}
                    maxLength={6}
                />
                <p className="text-xs text-muted-foreground">
                    Enter the 6-digit code sent to {phoneNumber}
                </p>
            </div>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                        setVerificationSent(false);
                        setVerificationCode('');
                    }}
                    disabled={isVerifying}
                    className="flex-1"
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={isVerifying} className="flex-1">
                    {isVerifying ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        'Verify Code'
                    )}
                </Button>
            </div>
        </form>
    );
}
