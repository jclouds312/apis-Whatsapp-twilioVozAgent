'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { getWorkflowSuggestion } from '@/app/dashboard/function-connect/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Bot, Frown } from 'lucide-react';
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
      {pending ? 'Generating...' : 'Generate Suggestion'}
      <Sparkles className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function WorkflowSuggester() {
  const [state, formAction] = useFormState(getWorkflowSuggestion, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.errors?._form) {
      toast({
        variant: "destructive",
        title: "Error",
        description: state.errors._form.join(", "),
      });
    }
  }, [state, toast]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>Intelligent Workflow Suggestion</CardTitle>
        <CardDescription>
          Use AI to suggest optimal workflow configurations based on your CRM data and communication patterns.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="crmDataStructures">CRM Data Structures</Label>
            <Textarea
              id="crmDataStructures"
              name="crmDataStructures"
              placeholder="e.g., Customer (id, name, email), Order (id, customer_id, amount, status)"
              className="min-h-24"
            />
            {state.errors?.crmDataStructures &&
              <p className="text-sm font-medium text-destructive">{state.errors.crmDataStructures}</p>
            }
          </div>
          <div className="grid gap-2">
            <Label htmlFor="communicationPatterns">Communication Patterns</Label>
            <Textarea
              id="communicationPatterns"
              name="communicationPatterns"
              placeholder="e.g., Inbound WhatsApp message creates a new Lead. CRM status update sends a WhatsApp notification."
              className="min-h-24"
            />
             {state.errors?.communicationPatterns &&
              <p className="text-sm font-medium text-destructive">{state.errors.communicationPatterns}</p>
            }
          </div>
          <SubmitButton />
        </form>

        {state.suggestion && (
          <div className="mt-6 rounded-lg border bg-secondary/50 p-4">
             <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-primary"/>
                <h3 className="text-lg font-semibold">Suggested Workflow</h3>
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
