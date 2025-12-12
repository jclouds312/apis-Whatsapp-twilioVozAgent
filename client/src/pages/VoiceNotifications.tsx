
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Phone, Send, Users, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function VoiceNotifications() {
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [voiceId, setVoiceId] = useState("alice");
  const [language, setLanguage] = useState("en-US");
  const [repeat, setRepeat] = useState(1);
  const [bulkRecipients, setBulkRecipients] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [callStatus, setCallStatus] = useState<any>(null);
  const { toast } = useToast();

  const sendNotification = async () => {
    if (!recipient || !message) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/twilio/voice/notification/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: recipient,
          message,
          voiceId,
          language,
          repeat,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Notificación Enviada",
          description: `Llamada iniciada con SID: ${result.callSid}`,
        });
        setCallStatus(result);
      } else {
        throw new Error(result.error || 'Error desconocido');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const sendBulkNotifications = async () => {
    const recipients = bulkRecipients.split('\n').filter(r => r.trim());
    if (recipients.length === 0 || !message) {
      toast({
        title: "Error",
        description: "Agrega al menos un destinatario y un mensaje",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const response = await fetch('/api/twilio/voice/notification/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipients,
          message,
          voiceId,
          language,
          repeat,
        }),
      });

      const data = await response.json();

      const successful = data.results.filter((r: any) => r.success).length;
      toast({
        title: "Notificaciones Enviadas",
        description: `${successful} de ${recipients.length} notificaciones enviadas exitosamente`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Notificaciones de Voz</h1>
        <p className="text-muted-foreground">Envía notificaciones automáticas por llamada de voz</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Single Notification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5" />
              Notificación Individual
            </CardTitle>
            <CardDescription>Envía una notificación de voz a un número</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Número de Teléfono</Label>
              <Input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="+18622770131"
              />
            </div>

            <div className="space-y-2">
              <Label>Mensaje de Voz</Label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Este es un mensaje de notificación importante..."
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Voz</Label>
                <Select value={voiceId} onValueChange={setVoiceId}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">Alice (Inglés)</SelectItem>
                    <SelectItem value="man">Man (Inglés)</SelectItem>
                    <SelectItem value="woman">Woman (Inglés)</SelectItem>
                    <SelectItem value="Polly.Conchita">Conchita (Español)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-US">Inglés (US)</SelectItem>
                    <SelectItem value="es-ES">Español (España)</SelectItem>
                    <SelectItem value="es-MX">Español (México)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Repeticiones</Label>
              <Input
                type="number"
                min="1"
                max="3"
                value={repeat}
                onChange={(e) => setRepeat(parseInt(e.target.value))}
              />
            </div>

            <Button onClick={sendNotification} disabled={isSending} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {isSending ? "Enviando..." : "Enviar Notificación"}
            </Button>

            {callStatus && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-sm font-medium">Estado de la llamada:</p>
                <p className="text-xs text-muted-foreground">SID: {callStatus.callSid}</p>
                <Badge variant="outline" className="mt-2">{callStatus.status}</Badge>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Bulk Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Notificaciones Masivas
            </CardTitle>
            <CardDescription>Envía notificaciones a múltiples números</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Números (uno por línea)</Label>
              <Textarea
                value={bulkRecipients}
                onChange={(e) => setBulkRecipients(e.target.value)}
                placeholder="+18622770131&#10;+15551234567&#10;+15559876543"
                rows={6}
              />
            </div>

            <Button onClick={sendBulkNotifications} disabled={isSending} className="w-full">
              <Send className="h-4 w-4 mr-2" />
              {isSending ? "Enviando..." : "Enviar a Todos"}
            </Button>

            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/30">
              <p className="text-sm text-blue-500">
                <Clock className="h-4 w-4 inline mr-1" />
                Las notificaciones se enviarán secuencialmente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
