'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Send, MessageSquare, FileText, Loader2, CheckCircle, XCircle, Copy, Code } from 'lucide-react';
import { sendWhatsAppMessage, sendWhatsAppTemplate, sendQuickHelloWorld } from '@/app/dashboard/whatsapp/actions';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function QuickSendWidget() {
  const [loading, setLoading] = useState(false);
  const [recipient, setRecipient] = useState('573205434546');
  const [message, setMessage] = useState('');
  const [templateName, setTemplateName] = useState('hello_world');
  const [languageCode, setLanguageCode] = useState('en_US');
  const [lastResult, setLastResult] = useState<{ success: boolean; error?: string; messageId?: string } | null>(null);
  const [showCurl, setShowCurl] = useState(false);
  const { toast } = useToast();

  const handleSendText = async () => {
    if (!message.trim()) {
      toast({ title: 'Error', description: 'Please enter a message', variant: 'destructive' });
      return;
    }
    setLoading(true);
    setLastResult(null);
    try {
      const result = await sendWhatsAppMessage(recipient, message);
      setLastResult(result);
      if (result.success) {
        toast({ title: 'Message sent!', description: `Text message delivered to +${recipient}` });
        setMessage('');
      } else {
        toast({ title: 'Failed to send', description: result.error, variant: 'destructive' });
      }
    } catch (error: any) {
      setLastResult({ success: false, error: error.message });
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSendTemplate = async () => {
    setLoading(true);
    setLastResult(null);
    try {
      const result = await sendWhatsAppTemplate(recipient, templateName, languageCode);
      setLastResult(result);
      if (result.success) {
        toast({ title: 'Template sent!', description: `Template "${templateName}" delivered to +${recipient}` });
      } else {
        toast({ title: 'Failed to send', description: result.error, variant: 'destructive' });
      }
    } catch (error: any) {
      setLastResult({ success: false, error: error.message });
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleQuickHelloWorld = async () => {
    setLoading(true);
    setLastResult(null);
    try {
      const result = await sendQuickHelloWorld(recipient);
      setLastResult(result);
      if (result.success) {
        toast({ title: 'Hello World sent!', description: `Template delivered to +${recipient}` });
      } else {
        toast({ title: 'Failed to send', description: result.error, variant: 'destructive' });
      }
    } catch (error: any) {
      setLastResult({ success: false, error: error.message });
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const curlExample = `curl -i -X POST \\
  https://graph.facebook.com/v22.0/882779844920111/messages \\
  -H 'Authorization: Bearer <access_token>' \\
  -H 'Content-Type: application/json' \\
  -d '{ "messaging_product": "whatsapp", "to": "${recipient}", "type": "template", "template": { "name": "${templateName}", "language": { "code": "${languageCode}" } } }'`;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'cURL command copied to clipboard' });
  };

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Send className="h-5 w-5 text-green-500" />
            <CardTitle className="text-lg">Quick Send</CardTitle>
          </div>
          {lastResult && (
            <Badge variant={lastResult.success ? 'default' : 'destructive'} className="gap-1">
              {lastResult.success ? (
                <><CheckCircle className="h-3 w-3" /> Sent</>
              ) : (
                <><XCircle className="h-3 w-3" /> Failed</>
              )}
            </Badge>
          )}
        </div>
        <CardDescription>Send WhatsApp messages via Cloud API</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="template" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="template" className="gap-2">
              <FileText className="h-4 w-4" />
              Template
            </TabsTrigger>
            <TabsTrigger value="text" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Text
            </TabsTrigger>
          </TabsList>

          <div className="mb-4">
            <Label htmlFor="recipient">Recipient Phone Number</Label>
            <Input
              id="recipient"
              placeholder="573205434546"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value.replace(/\D/g, ''))}
              className="font-mono mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">Include country code without + or spaces</p>
          </div>

          <TabsContent value="template" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template">Template Name</Label>
                <Input
                  id="template"
                  placeholder="hello_world"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="font-mono mt-1"
                />
              </div>
              <div>
                <Label htmlFor="language">Language</Label>
                <Select value={languageCode} onValueChange={setLanguageCode}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_US">English (US)</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="es_ES">Spanish (Spain)</SelectItem>
                    <SelectItem value="es_MX">Spanish (Mexico)</SelectItem>
                    <SelectItem value="pt_BR">Portuguese (Brazil)</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleQuickHelloWorld} 
                disabled={loading}
                variant="outline"
                className="flex-1"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Quick Hello World
              </Button>
              <Button 
                onClick={handleSendTemplate} 
                disabled={loading}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                Send Template
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="text" className="space-y-4">
            <div>
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 min-h-[100px]"
              />
            </div>

            <Button 
              onClick={handleSendText} 
              disabled={loading || !message.trim()}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
              Send Message
            </Button>
          </TabsContent>
        </Tabs>

        {lastResult?.error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 text-sm">
            {lastResult.error}
          </div>
        )}

        {lastResult?.messageId && (
          <div className="mt-4 p-3 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 text-sm">
            Message ID: <span className="font-mono">{lastResult.messageId}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowCurl(!showCurl)}
          className="w-full text-muted-foreground"
        >
          <Code className="h-4 w-4 mr-2" />
          {showCurl ? 'Hide' : 'Show'} cURL Command
        </Button>
        
        {showCurl && (
          <div className="w-full relative">
            <pre className="p-3 rounded-lg bg-slate-900 text-slate-100 text-xs overflow-x-auto font-mono whitespace-pre-wrap">
              {curlExample}
            </pre>
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-6 w-6 text-slate-400 hover:text-slate-100"
              onClick={() => copyToClipboard(curlExample)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
