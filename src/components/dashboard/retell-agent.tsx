
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { retellText } from '@/app/dashboard/ai-agents/retell/actions';
import { useState } from 'react';

const initialState = {
  retoldText: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Processing...' : 'Retell Text'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function RetellAgent() {
  const [state, formAction] = useActionState(retellText, initialState);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state.errors?._form) {
      toast({
        variant: "destructive",
        title: "Error Processing Text",
        description: state.errors._form.join(", "),
      });
    }
    if (state.retoldText) {
      toast({
        title: "Text Retold Successfully",
        description: "Your retold version is ready.",
      });
    }
  }, [state, toast]);

  const handleCopy = () => {
    if (state.retoldText) {
      navigator.clipboard.writeText(state.retoldText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Copied to clipboard",
        description: "The retold text has been copied.",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Retell Agent</CardTitle>
        <CardDescription>
          Rephrase, summarize, or transform your text into a clearer version using AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="textToRetell">Original Text</Label>
            <Textarea
              id="textToRetell"
              name="textToRetell"
              placeholder="Enter the text you want to retell or rephrase..."
              className="min-h-32"
            />
            {state.errors?.textToRetell && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.textToRetell}
              </p>
            )}
          </div>
          <SubmitButton />
        </form>

        {state.retoldText && (
          <div className="mt-6 space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Retold Version</Label>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <p className="text-sm whitespace-pre-wrap">{state.retoldText}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
