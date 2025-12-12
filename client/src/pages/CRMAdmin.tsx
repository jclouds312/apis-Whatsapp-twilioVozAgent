
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Download, Settings, Database, FileJson, Code,
  Save, Key, Phone, MessageSquare, CheckCircle2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CRMAdmin() {
  const [adminEmail, setAdminEmail] = useState("alexander.medez931@outlook.com");
  const [adminPassword, setAdminPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleSaveCredentials = async () => {
    setIsSaving(true);
    try {
      // Simular guardado de credenciales
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Credenciales guardadas",
        description: "Las credenciales de administrador se han actualizado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron guardar las credenciales",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExportVoiceAPI = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/crm/export/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail,
          format: 'json'
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `twilio_voice_export_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Exportación completada",
          description: "Los datos de Twilio Voice se han exportado correctamente.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar la API de voz",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportWhatsAppAPI = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/crm/export/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail,
          format: 'json'
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `whatsapp_export_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Exportación completada",
          description: "Los datos de WhatsApp se han exportado correctamente.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo exportar la API de WhatsApp",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportAll = async () => {
    setIsExporting(true);
    try {
      const response = await fetch('/api/crm/export/all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail,
          format: 'json'
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `crm_full_export_${new Date().getTime()}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast({
          title: "Exportación completada",
          description: "Todos los datos se han exportado correctamente.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la exportación",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            CRM Admin
          </h1>
          <p className="text-muted-foreground">Configuración de administrador y exportación de APIs</p>
        </div>
      </div>

      <Tabs defaultValue="credentials" className="space-y-6">
        <TabsList>
          <TabsTrigger value="credentials">Credenciales</TabsTrigger>
          <TabsTrigger value="export">Exportar APIs</TabsTrigger>
        </TabsList>

        <TabsContent value="credentials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Credenciales de Administrador
              </CardTitle>
              <CardDescription>
                Configura las credenciales de acceso para la exportación de datos al CRM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email de Administrador</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@empresa.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="admin-password">Contraseña</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Credenciales configuradas para: {adminEmail}
                </p>
              </div>

              <Button 
                onClick={handleSaveCredentials} 
                disabled={isSaving || !adminEmail}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? "Guardando..." : "Guardar Credenciales"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5 text-blue-500" />
                  API de Twilio Voice
                </CardTitle>
                <CardDescription>
                  Exportar datos de llamadas y grabaciones de Twilio Voice
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Formato</span>
                    <Badge variant="outline">JSON</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Incluye</span>
                    <span className="text-xs">Logs de llamadas, grabaciones, duración</span>
                  </div>
                </div>

                <Button 
                  onClick={handleExportVoiceAPI} 
                  disabled={isExporting || !adminEmail}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar API de Voz
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-green-500" />
                  API de WhatsApp
                </CardTitle>
                <CardDescription>
                  Exportar conversaciones y datos de WhatsApp Business
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Formato</span>
                    <Badge variant="outline">JSON</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Incluye</span>
                    <span className="text-xs">Mensajes, media, estado de entrega</span>
                  </div>
                </div>

                <Button 
                  onClick={handleExportWhatsAppAPI} 
                  disabled={isExporting || !adminEmail}
                  className="w-full"
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar API de WhatsApp
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-gradient-to-br from-primary/5 to-transparent border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Exportación Completa
              </CardTitle>
              <CardDescription>
                Exportar todos los datos de comunicaciones a CRM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="font-medium">Twilio Voice</p>
                  <p className="text-muted-foreground text-xs">Logs de llamadas y grabaciones</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">WhatsApp Business</p>
                  <p className="text-muted-foreground text-xs">Conversaciones y media</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Contactos CRM</p>
                  <p className="text-muted-foreground text-xs">Base de datos de contactos</p>
                </div>
                <div className="space-y-1">
                  <p className="font-medium">Logs del Sistema</p>
                  <p className="text-muted-foreground text-xs">Actividad y auditoría</p>
                </div>
              </div>

              <Button 
                onClick={handleExportAll} 
                disabled={isExporting || !adminEmail}
                className="w-full"
                size="lg"
              >
                <FileJson className="h-4 w-4 mr-2" />
                {isExporting ? "Exportando..." : "Exportar Todo al CRM"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                La exportación se realizará como administrador: {adminEmail}
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
