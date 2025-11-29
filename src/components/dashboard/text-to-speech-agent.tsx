'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { textToSpeech } from '@/app/dashboard/function-connect/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Volume2 } from 'lucide-react';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState = {
  audioData: null,
  errors: null,
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Generating Audio...' : 'Generate Speech'}
      <Volume2 className="ml-2 h-4 w-4" />
    </Button>
  );
}

export function TextToSpeechAgent() {
  const [state, formAction] = useFormState(textToSpeech, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.errors?._form) {
      toast({
        variant: "destructive",
        title: "Error Generating Audio",
        description: state.errors._form.join(", "),
      });
    }
  }, [state, toast]);


  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Text-to-Speech</CardTitle>
        <CardDescription>
          Convert any text into a high-quality audio file using generative AI.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="textToConvert">Text to Convert</Label>
            <Textarea
              id="textToConvert"
              name="textToConvert"
              placeholder="e.g., Hello, welcome to APIs Manager. How can I help you today?"
              className="min-h-24"
            />
            {state.errors?.textToConvert &&
              <p className="text-sm font-medium text-destructive">{state.errors.textToConvert}</p>
            }
          </div>
          <SubmitButton />
        </form>

        {state.audioData && (
          <div className="mt-6 rounded-lg border bg-secondary/50 p-4">
             <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-primary"/>
                <h3 className="text-lg font-semibold">Generated Audio</h3>
             </div>
            <audio controls className="w-full">
              <source src={state.audioData} type="audio/wav" />
              Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
