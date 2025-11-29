'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { getRetellSuggestion } from '@/app/dashboard/function-connect/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Bot } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  suggestion: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Generating...' : 'Retell Text'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function RetellAgent() {
  const [state, formAction] = useActionState(getRetellSuggestion, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.errors?._form) {
      toast({
        variant: "destructive",
        title: "Error Generating Suggestion",
        description: state.errors._form.join(", "),
      });
    }
  }, [state, toast]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Retell Agent</CardTitle>
        <CardDescription>
          Use AI to rephrase, summarize, or transform any text.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="textToRetell">Text to Retell</Label>
            <Textarea
              id="textToRetell"
              name="textToRetell"
              placeholder="e.g., Enter a customer email, a document paragraph, or any text you want to process..."
              className="min-h-24"
            />
            {state.errors?.textToRetell &&
              <p className="text-sm font-medium text-destructive">{state.errors.textToRetell}</p>
            }
          </div>
          <SubmitButton />
        </form>

        {state.suggestion && (
          <div className="mt-6 rounded-lg border bg-secondary/50 p-4">
             <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-primary"/>
                <h3 className="text-lg font-semibold">Retold Text</h3>
             </div>
            <pre className="whitespace-pre-wrap text-sm text-foreground font-mono bg-card p-4 rounded-md">
              <code>{state.suggestion}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
