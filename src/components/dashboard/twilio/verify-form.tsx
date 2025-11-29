'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { sendVerificationToken, checkVerificationToken } from '@/app/dashboard/twilio/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Send, Loader2 } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';


const sendInitialState = {
  status: 'idle' as const,
  message: '',
  phone: '',
};

const checkInitialState = {
  status: 'idle' as const,
  message: '',
};


function SendSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
      {pending ? 'Sending...' : 'Send Verification Code'}
    </Button>
  );
}

function CheckSubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
        {pending ? 'Verifying...' : 'Verify Code'}
      </Button>
    );
}

export function VerifyForm() {
  const [sendState, sendAction] = useFormState(sendVerificationToken, sendInitialState);
  const [checkState, checkAction] = useFormState(checkVerificationToken, checkInitialState);
  const { toast } = useToast();
  
  const [showVerification, setShowVerification] = useState(false);
  const sendFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (sendState.status === 'success') {
      toast({
        title: "Code Sent!",
        description: sendState.message,
      });
      setShowVerification(true);
    } else if (sendState.status === 'error' && sendState.message) {
      toast({
        variant: "destructive",
        title: "Error Sending Code",
        description: sendState.message,
      });
    }
  }, [sendState, toast]);

  useEffect(() => {
    if (checkState.status === 'success') {
      toast({
        title: "Success!",
        description: checkState.message,
        className: 'bg-green-100 dark:bg-green-900',
      });
      // Reset form
      setShowVerification(false);
      sendFormRef.current?.reset();
    } else if (checkState.status === 'error' && checkState.message) {
      toast({
        variant: "destructive",
        title: "Verification Failed",
        description: checkState.message,
      });
    }
  }, [checkState, toast]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>WhatsApp Verification</CardTitle>
        <CardDescription>
          Send a one-time passcode to a WhatsApp number to verify it.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Step 1: Send Code */}
        <form action={sendAction} ref={sendFormRef} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+14155552671"
              required
              disabled={showVerification}
            />
            {sendState.status === 'error' && !sendState.message.includes('E.164') && (
              <p className="text-sm font-medium text-destructive">{sendState.message}</p>
            )}
             {sendState.status === 'error' && sendState.message.includes('E.164') && (
              <p className="text-sm font-medium text-destructive">{sendState.message}</p>
            )}
          </div>
           {!showVerification && <SendSubmitButton />}
        </form>

        {/* Step 2: Verify Code */}
        {showVerification && (
          <form action={checkAction} className="space-y-4 border-t pt-6">
             <input type="hidden" name="phone" value={sendState.phone} />
             <p className="text-sm text-center text-muted-foreground">
                A code was sent to <strong>{sendState.phone}</strong>. Please enter it below.
             </p>
            <div className="grid gap-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                name="code"
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                placeholder="123456"
                required
                className="text-center font-mono tracking-widest text-lg h-12"
              />
               {checkState.status === 'error' && (
                 <p className="text-sm font-medium text-destructive">{checkState.message}</p>
               )}
            </div>
            <CheckSubmitButton />
          </form>
        )}
      </CardContent>
       <CardFooter>
            <p className="text-xs text-muted-foreground">
                Powered by Twilio Verify API. Ensure your Account SID, Auth Token, and Verify Service SID are set in your environment variables.
            </p>
        </CardFooter>
    </Card>
  );
}
