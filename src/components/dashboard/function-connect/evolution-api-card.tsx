
'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

function SubmitButton() {
  const { pending } = useFormStatus();
  return <Button type="submit" disabled={pending}>{pending ? 'Sending...' : 'Send Message'}</Button>;
}

async function sendEvolutionWhatsAppMessage(to: string, text: string, apiKey: string): Promise<{ success: boolean; error?: string }> {
    const url = `/api/evolution/message/sendText`;

    const payload = {
        number: to,
        options: {
            delay: 1200,
            presence: "composing",
        },
        textMessage: {
            text: text,
        },
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send message');
        }

        console.log('Evolution API message sent successfully:', await response.json());
        return { success: true };
    } catch (error: any) {
        console.error('Failed to send Evolution API message:', error.message);
        return { success: false, error: error.message };
    }
}

export function EvolutionApiCard() {
  const initialState = { success: false, error: null };
  const [state, dispatch] = useFormState(async (prevState: any, formData: FormData) => {
    const to = formData.get('to') as string;
    const text = formData.get('text') as string;
    const apiKey = formData.get('apiKey') as string;

    if (!to || !text || !apiKey) {
        return { success: false, error: 'Phone number, message, and API key are required.' };
    }
    return sendEvolutionWhatsAppMessage(to, text, apiKey);
  }, initialState);

  const [displayState, setDisplayState] = useState<{success: boolean, message: string | null}>({ success: false, message: null});

  useEffect(() => {
    if (state?.error) {
        setDisplayState({ success: false, message: `Error: ${state.error}`});
    } else if (state?.success) {
        setDisplayState({ success: true, message: 'Message sent successfully!' });
    }
  }, [state]);

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader>
        <CardTitle>Evolution API: Send Message</CardTitle>
        <CardDescription>Send a WhatsApp message using the Evolution API. Ensure the API is running.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={dispatch} className="space-y-4">
        <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input 
                id="apiKey" 
                name="apiKey" 
                placeholder="Enter your API Key" 
                required 
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="to">Recipient Phone Number</Label>
            <Input 
                id="to" 
                name="to" 
                placeholder="e.g., 12345678901" 
                required 
            />
            <p className="text-xs text-muted-foreground">Include country code, without '+' or spaces. For Brazil add a 9 between country and area code. Example: 5511999999999</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="text">Message</Label>
            <Textarea 
                id="text" 
                name="text" 
                placeholder="Hello from APIs Manager!" 
                required 
            />
          </div>
          <SubmitButton />
          {displayState.message && (
            <div className={`mt-4 text-sm font-medium ${displayState.success ? 'text-green-600' : 'text-red-600'}`}>
              {displayState.message}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
