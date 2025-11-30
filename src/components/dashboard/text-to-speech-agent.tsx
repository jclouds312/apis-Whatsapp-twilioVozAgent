
'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Volume2, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { textToSpeech } from '@/app/dashboard/ai-agents/text-to-speech/actions';

const initialState = {
  audioUrl: null,
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
  const [state, formAction] = useActionState(textToSpeech, initialState);
  const { toast } = useToast();

  useEffect(() => {
    if (state.errors?._form) {
      toast({
        variant: "destructive",
        title: "Error Generating Audio",
        description: state.errors._form.join(", "),
      });
    }
    if (state.audioUrl) {
      toast({
        title: "Audio Generated Successfully",
        description: "Your audio is ready to play or download.",
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
            {state.errors?.textToConvert && (
              <p className="text-sm font-medium text-destructive">
                {state.errors.textToConvert}
              </p>
            )}
          </div>
          <SubmitButton />
        </form>

        {state.audioUrl && (
          <div className="mt-6 space-y-4">
            <div className="p-4 rounded-lg bg-muted">
              <Label className="text-sm font-medium mb-2 block">Generated Audio</Label>
              <audio controls className="w-full" src={state.audioUrl}>
                Your browser does not support the audio element.
              </audio>
            </div>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const link = document.createElement('a');
                link.href = state.audioUrl!;
                link.download = 'generated-speech.wav';
                link.click();
              }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Audio
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
