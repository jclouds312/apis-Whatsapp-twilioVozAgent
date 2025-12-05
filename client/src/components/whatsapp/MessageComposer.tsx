import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Type,
  Image as ImageIcon,
  Video,
  FileText,
  MapPin,
  User,
  List,
  Mic,
  Sticker,
  Send,
  Paperclip,
  X
} from "lucide-react";
import { toast } from "sonner";

export default function MessageComposer() {
  const [messageType, setMessageType] = useState("text");
  const [recipient, setRecipient] = useState("");
  
  // Mock state for inputs
  const [textBody, setTextBody] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [locationName, setLocationName] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const handleSend = () => {
    if (!recipient) {
      toast.error("Por favor ingresa un número de destino");
      return;
    }

    toast.success(`Mensaje de tipo ${messageType} enviado a ${recipient}`);
    
    // Reset logic would go here
    setTextBody("");
    setMediaUrl("");
  };

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-slate-900/50 to-slate-950/50">
      <CardContent className="p-4 space-y-4">
        <div className="space-y-2">
          <Label>Destinatario (Phone ID o Número)</Label>
          <Input 
            placeholder="+34 600 000 000" 
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="bg-background/50"
          />
        </div>

        <Tabs value={messageType} onValueChange={setMessageType} className="w-full">
          <TabsList className="grid grid-cols-5 lg:grid-cols-10 h-auto gap-2 bg-transparent">
            {[
              { id: "text", icon: Type, label: "Texto" },
              { id: "image", icon: ImageIcon, label: "Imagen" },
              { id: "video", icon: Video, label: "Video" },
              { id: "audio", icon: Mic, label: "Audio" },
              { id: "document", icon: FileText, label: "Doc" },
              { id: "location", icon: MapPin, label: "Ubicación" },
              { id: "contact", icon: User, label: "Contacto" },
              { id: "sticker", icon: Sticker, label: "Sticker" },
              { id: "list", icon: List, label: "Lista" },
              { id: "template", icon: FileText, label: "Plantilla" },
            ].map((type) => (
              <TabsTrigger
                key={type.id}
                value={type.id}
                className="flex flex-col items-center gap-1 p-2 h-auto data-[state=active]:bg-primary/20 data-[state=active]:text-primary border border-transparent data-[state=active]:border-primary/50"
              >
                <type.icon className="h-4 w-4" />
                <span className="text-[10px]">{type.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-4 p-4 rounded-lg border border-border/50 bg-background/30 min-h-[200px]">
            <TabsContent value="text" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>Mensaje de Texto</Label>
                <Textarea 
                  placeholder="Escribe tu mensaje aquí..." 
                  value={textBody}
                  onChange={(e) => setTextBody(e.target.value)}
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">Soporta formato Markdown (*bold*, _italic_)</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Paperclip className="h-4 w-4 mr-2" /> Adjuntar Preview URL
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="image" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>URL de la Imagen</Label>
                <Input 
                  placeholder="https://..." 
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Caption (Opcional)</Label>
                <Input 
                  placeholder="Descripción de la imagen..." 
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                />
              </div>
            </TabsContent>

            <TabsContent value="video" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>URL del Video</Label>
                <Input placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Caption (Opcional)</Label>
                <Input placeholder="Descripción del video..." />
              </div>
            </TabsContent>

            <TabsContent value="audio" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>URL del Audio</Label>
                <Input placeholder="https://..." />
              </div>
            </TabsContent>

            <TabsContent value="document" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>URL del Documento (PDF, DOCX...)</Label>
                <Input placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Nombre del Archivo</Label>
                <Input placeholder="documento.pdf" />
              </div>
              <div className="space-y-2">
                <Label>Caption (Opcional)</Label>
                <Input placeholder="Descripción..." />
              </div>
            </TabsContent>

            <TabsContent value="location" className="mt-0 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Latitud</Label>
                  <Input placeholder="40.416775" value={latitude} onChange={e => setLatitude(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Longitud</Label>
                  <Input placeholder="-3.703790" value={longitude} onChange={e => setLongitude(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Nombre del Lugar</Label>
                <Input placeholder="Oficina Central" value={locationName} onChange={e => setLocationName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Dirección</Label>
                <Input placeholder="Calle Principal 123, Madrid" />
              </div>
            </TabsContent>

            <TabsContent value="contact" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>Nombre Completo</Label>
                <Input placeholder="Juan Pérez" value={contactName} onChange={e => setContactName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input placeholder="+34..." value={contactPhone} onChange={e => setContactPhone(e.target.value)} />
              </div>
            </TabsContent>

            <TabsContent value="sticker" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>Sticker ID o URL</Label>
                <Input placeholder="ID o URL..." />
              </div>
            </TabsContent>

            <TabsContent value="list" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>Texto del Header</Label>
                <Input placeholder="Hola..." />
              </div>
              <div className="space-y-2">
                <Label>Texto del Cuerpo</Label>
                <Textarea placeholder="Por favor selecciona una opción..." />
              </div>
              <div className="space-y-2">
                <Label>Texto del Footer</Label>
                <Input placeholder="Gracias" />
              </div>
              <div className="space-y-2">
                <Label>Texto del Botón</Label>
                <Input placeholder="Ver Opciones" />
              </div>
            </TabsContent>
            
            <TabsContent value="template" className="mt-0 space-y-4">
              <div className="space-y-2">
                <Label>Seleccionar Plantilla</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una plantilla" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hello_world">hello_world</SelectItem>
                    <SelectItem value="shipping_update">shipping_update</SelectItem>
                    <SelectItem value="otp_code">otp_code</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Idioma</Label>
                <Select defaultValue="es">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="es">Español (es)</SelectItem>
                    <SelectItem value="en_US">Inglés (en_US)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <Button onClick={handleSend} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-6">
          <Send className="mr-2 h-5 w-5" /> Enviar Mensaje
        </Button>
      </CardContent>
    </Card>
  );
}
