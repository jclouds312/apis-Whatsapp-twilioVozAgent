import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Bot } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function WorkflowSuggesterPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock AI generation
    setTimeout(() => {
      setLoading(false);
      setSuggestion(`Based on your CRM structure and communication patterns, here is a suggested workflow:

1. Trigger: New "High Value" Lead in CRM
   - Condition: Lead Score > 80
2. Action: Send "Welcome VIP" WhatsApp Template via Evolution API
   - Delay: 5 minutes
3. Action: Notify "Sales Team" via Slack/Email
4. Action: Create "Follow-up Task" in CRM

Reasoning: High-value leads respond best to immediate, personalized engagement via their preferred channel (WhatsApp).`);
      toast({
        title: "Suggestion Generated",
        description: "AI has analyzed your requirements.",
      });
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-500" />
          Workflow Suggester
        </h2>
        <p className="text-muted-foreground">Use AI to optimize your automation logic.</p>
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Intelligent Configuration</CardTitle>
          <CardDescription>
            Describe your data and goals, and let our AI suggest the optimal workflow.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="crmDataStructures">CRM Data Structures</Label>
              <Textarea
                id="crmDataStructures"
                placeholder="e.g., Customer (id, name, email), Order (id, customer_id, amount, status)"
                className="min-h-24"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="communicationPatterns">Communication Patterns</Label>
              <Textarea
                id="communicationPatterns"
                placeholder="e.g., Inbound WhatsApp message creates a new Lead. CRM status update sends a WhatsApp notification."
                className="min-h-24"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              {loading ? 'Generating...' : 'Generate Suggestion'}
              <Sparkles className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {suggestion && (
            <div className="mt-6 rounded-lg border border-primary/20 bg-primary/5 p-6 animate-in fade-in slide-in-from-bottom-4">
               <div className="flex items-center gap-2 mb-4">
                  <Bot className="h-6 w-6 text-primary"/>
                  <h3 className="text-lg font-semibold text-primary">AI Suggestion</h3>
               </div>
              <pre className="whitespace-pre-wrap text-sm text-foreground font-mono p-4 rounded-md bg-background border border-border/50">
                <code>{suggestion}</code>
              </pre>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">Apply Workflow</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
