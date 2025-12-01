import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Link, Zap, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Badge } from "@/components/ui/badge";

export default function FunctionConnectPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Message Sent",
        description: "Successfully sent message via Evolution API.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Zap className="h-6 w-6 text-yellow-500" />
          Function Connect
        </h2>
        <p className="text-muted-foreground">Orchestrate functions and connect to Evolution API.</p>
      </div>

      <Card className="transition-all hover:shadow-lg border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-500" />
            Evolution API: Send Message
          </CardTitle>
          <CardDescription>Send a WhatsApp message using the Evolution API instance.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input 
                  id="apiKey" 
                  placeholder="Enter your Evolution API Key" 
                  required 
                  type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to">Recipient Phone Number</Label>
              <Input 
                  id="to" 
                  placeholder="e.g., 5511999999999" 
                  required 
              />
              <p className="text-xs text-muted-foreground">Include country code (e.g. 55 for Brazil).</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="text">Message</Label>
              <Textarea 
                  id="text" 
                  placeholder="Hello from APIs Manager!" 
                  required 
                  className="min-h-[100px]"
              />
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-green-600 hover:bg-green-700">
              {isLoading ? 'Sending...' : 'Send Message'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
            <CardTitle>Available Functions</CardTitle>
            <CardDescription>Serverless functions ready to be triggered.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                {[
                    { name: "sync-crm-contacts", status: "Ready", lastRun: "10m ago" },
                    { name: "process-audio-transcription", status: "Ready", lastRun: "1h ago" },
                    { name: "generate-daily-report", status: "Scheduled", lastRun: "24h ago" },
                ].map((fn, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-md">
                                <Link className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="font-medium">{fn.name}</p>
                                <p className="text-xs text-muted-foreground">Last run: {fn.lastRun}</p>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">{fn.status}</Badge>
                    </div>
                ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
