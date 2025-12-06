
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Send, MessageSquare, FileText, Image, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WhatsAppManagerPage() {
  const { toast } = useToast();
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [sentMessages, setSentMessages] = useState<any[]>([]);

  const sendMessage = async () => {
    try {
      const response = await fetch('/api/whatsapp/messages/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          message,
          type: 'text',
        }),
      });
      const data = await response.json();
      setSentMessages([...sentMessages, { ...data, timestamp: new Date() }]);
      setMessage('');
      toast({
        title: 'Message Sent',
        description: 'WhatsApp message sent successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    }
  };

  const sendTemplate = async () => {
    try {
      const response = await fetch('/api/whatsapp/messages/template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          templateName,
          language: 'es',
          components: [],
        }),
      });
      const data = await response.json();
      setSentMessages([...sentMessages, { ...data, timestamp: new Date(), isTemplate: true }]);
      toast({
        title: 'Template Sent',
        description: 'WhatsApp template sent successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send template',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-950 via-slate-900 to-slate-950 border border-green-500/30 p-8 shadow-2xl">
        <div className="relative z-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
            WhatsApp Manager
          </h1>
          <p className="text-slate-400 text-lg">
            Send and manage WhatsApp messages
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader>
            <CardTitle>Send Message</CardTitle>
            <CardDescription>Send WhatsApp messages and templates</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="text">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">
                  <MessageSquare className="h-4 w-4 mr-2" /> Text
                </TabsTrigger>
                <TabsTrigger value="template">
                  <FileText className="h-4 w-4 mr-2" /> Template
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4">
                <Input
                  placeholder="Recipient phone number (with country code)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <Textarea
                  placeholder="Enter your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                />
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={sendMessage}
                  disabled={!recipient || !message}
                >
                  <Send className="h-4 w-4 mr-2" /> Send Message
                </Button>
              </TabsContent>

              <TabsContent value="template" className="space-y-4">
                <Input
                  placeholder="Recipient phone number (with country code)"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                />
                <Input
                  placeholder="Template name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                />
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={sendTemplate}
                  disabled={!recipient || !templateName}
                >
                  <Send className="h-4 w-4 mr-2" /> Send Template
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-950/50">
          <CardHeader>
            <CardTitle>Sent Messages</CardTitle>
            <CardDescription>Recent message history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {sentMessages.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No messages sent yet</p>
              ) : (
                sentMessages.map((msg, idx) => (
                  <div key={idx} className="p-3 rounded bg-slate-900/50 border border-slate-800">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={msg.isTemplate ? 'outline' : 'default'}>
                        {msg.isTemplate ? 'Template' : 'Text'}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {msg.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium">To: {msg.contacts?.[0]?.wa_id}</p>
                      <p className="text-muted-foreground">ID: {msg.messages?.[0]?.id}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
