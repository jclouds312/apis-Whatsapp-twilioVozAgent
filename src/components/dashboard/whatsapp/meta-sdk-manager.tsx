
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, Download, MapPin, User, Package, BarChart3, 
  Settings, Shield, Globe, Send, FileText, Image as ImageIcon,
  Video, File, Trash2, Plus
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  sendWhatsAppLocation,
  sendWhatsAppContact,
  getWhatsAppCatalogs,
  getWhatsAppProducts,
  sendWhatsAppProduct,
  getWhatsAppAnalytics,
  getWhatsAppQualityInfo,
  updateWhatsAppBusinessProfile,
  createWhatsAppTemplate,
  deleteWhatsAppTemplate,
  subscribeToWebhookEvents
} from '@/app/dashboard/whatsapp/actions';

export function MetaSDKManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [catalogs, setCatalogs] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [qualityInfo, setQualityInfo] = useState<any>(null);

  // Location Message State
  const [locationTo, setLocationTo] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationName, setLocationName] = useState('');

  // Contact Message State
  const [contactTo, setContactTo] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');

  // Product Message State
  const [productTo, setProductTo] = useState('');
  const [selectedCatalog, setSelectedCatalog] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  // Template State
  const [templateName, setTemplateName] = useState('');
  const [templateCategory, setTemplateCategory] = useState('MARKETING');
  const [templateLanguage, setTemplateLanguage] = useState('es');
  const [templateBody, setTemplateBody] = useState('');

  // Business Profile State
  const [profileAbout, setProfileAbout] = useState('');
  const [profileDescription, setProfileDescription] = useState('');
  const [profileEmail, setProfileEmail] = useState('');

  const handleSendLocation = async () => {
    setLoading(true);
    try {
      const result = await sendWhatsAppLocation(
        locationTo,
        parseFloat(latitude),
        parseFloat(longitude),
        locationName
      );
      
      if (result.success) {
        toast({
          title: 'Ubicación enviada',
          description: `Mensaje ID: ${result.messageId}`,
        });
        setLocationTo('');
        setLatitude('');
        setLongitude('');
        setLocationName('');
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendContact = async () => {
    setLoading(true);
    try {
      const result = await sendWhatsAppContact(contactTo, [
        {
          name: { formatted_name: contactName },
          phones: [{ phone: contactPhone }],
          emails: contactEmail ? [{ email: contactEmail }] : [],
        },
      ]);
      
      if (result.success) {
        toast({
          title: 'Contacto enviado',
          description: `Mensaje ID: ${result.messageId}`,
        });
        setContactTo('');
        setContactName('');
        setContactPhone('');
        setContactEmail('');
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCatalogs = async () => {
    setLoading(true);
    try {
      const result = await getWhatsAppCatalogs();
      if (result.success && result.catalogs) {
        setCatalogs(result.catalogs);
        toast({
          title: 'Catálogos cargados',
          description: `${result.catalogs.length} catálogos encontrados`,
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'No se pudieron cargar los catálogos',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadProducts = async (catalogId: string) => {
    setLoading(true);
    try {
      const result = await getWhatsAppProducts(catalogId);
      if (result.success && result.products) {
        setProducts(result.products);
        setSelectedCatalog(catalogId);
        toast({
          title: 'Productos cargados',
          description: `${result.products.length} productos encontrados`,
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'No se pudieron cargar los productos',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendProduct = async () => {
    setLoading(true);
    try {
      const result = await sendWhatsAppProduct(
        productTo,
        selectedCatalog,
        selectedProduct,
        '¡Mira este producto!'
      );
      
      if (result.success) {
        toast({
          title: 'Producto enviado',
          description: `Mensaje ID: ${result.messageId}`,
        });
        setProductTo('');
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadAnalytics = async () => {
    setLoading(true);
    try {
      const endDate = Math.floor(Date.now() / 1000);
      const startDate = endDate - 30 * 24 * 60 * 60; // 30 days ago
      
      const result = await getWhatsAppAnalytics(startDate, endDate);
      if (result.success) {
        setAnalytics(result.analytics);
        toast({
          title: 'Analytics cargados',
          description: 'Datos de los últimos 30 días',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error || 'No se pudieron cargar los analytics',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLoadQualityInfo = async () => {
    setLoading(true);
    try {
      const result = await getWhatsAppQualityInfo();
      if (result.success) {
        setQualityInfo(result);
        toast({
          title: 'Información de calidad cargada',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const result = await updateWhatsAppBusinessProfile({
        about: profileAbout,
        description: profileDescription,
        email: profileEmail,
      });
      
      if (result.success) {
        toast({
          title: 'Perfil actualizado',
          description: 'Los cambios se han guardado correctamente',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    setLoading(true);
    try {
      const components = [
        {
          type: 'BODY',
          text: templateBody,
        },
      ];
      
      const result = await createWhatsAppTemplate(
        templateName,
        templateCategory,
        templateLanguage,
        components
      );
      
      if (result.success) {
        toast({
          title: 'Template creado',
          description: `ID: ${result.templateId}`,
        });
        setTemplateName('');
        setTemplateBody('');
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribeWebhook = async () => {
    setLoading(true);
    try {
      const result = await subscribeToWebhookEvents();
      if (result.success) {
        toast({
          title: 'Webhook configurado',
          description: 'Suscrito a eventos de mensajes',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Tabs defaultValue="messages" className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-muted/50">
        <TabsTrigger value="messages" className="data-[state=active]:bg-green-500 data-[state=active]:text-white">
          <MapPin className="h-4 w-4 mr-2" />
          Mensajes
        </TabsTrigger>
        <TabsTrigger value="commerce" className="data-[state=active]:bg-blue-500 data-[state=active]:text-white">
          <Package className="h-4 w-4 mr-2" />
          Comercio
        </TabsTrigger>
        <TabsTrigger value="templates" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
          <FileText className="h-4 w-4 mr-2" />
          Templates
        </TabsTrigger>
        <TabsTrigger value="analytics" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
          <BarChart3 className="h-4 w-4 mr-2" />
          Analytics
        </TabsTrigger>
        <TabsTrigger value="settings" className="data-[state=active]:bg-slate-500 data-[state=active]:text-white">
          <Settings className="h-4 w-4 mr-2" />
          Config
        </TabsTrigger>
      </TabsList>

      <TabsContent value="messages" className="space-y-4">
        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/20">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-500 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              Enviar Ubicación
            </CardTitle>
            <CardDescription>Comparte una ubicación con coordenadas GPS</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Número de teléfono</Label>
                <Input
                  value={locationTo}
                  onChange={(e) => setLocationTo(e.target.value)}
                  placeholder="573205434546"
                />
              </div>
              <div>
                <Label>Nombre del lugar</Label>
                <Input
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="Mi Tienda"
                />
              </div>
              <div>
                <Label>Latitud</Label>
                <Input
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                  placeholder="4.6097"
                  type="number"
                  step="any"
                />
              </div>
              <div>
                <Label>Longitud</Label>
                <Input
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  placeholder="-74.0817"
                  type="number"
                  step="any"
                />
              </div>
            </div>
            <Button onClick={handleSendLocation} disabled={loading} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Enviar Ubicación
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              Enviar Contacto
            </CardTitle>
            <CardDescription>Comparte una tarjeta de contacto</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Número destinatario</Label>
                <Input
                  value={contactTo}
                  onChange={(e) => setContactTo(e.target.value)}
                  placeholder="573205434546"
                />
              </div>
              <div>
                <Label>Nombre del contacto</Label>
                <Input
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Juan Pérez"
                />
              </div>
              <div>
                <Label>Teléfono del contacto</Label>
                <Input
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+573001234567"
                />
              </div>
              <div>
                <Label>Email del contacto</Label>
                <Input
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="juan@example.com"
                />
              </div>
            </div>
            <Button onClick={handleSendContact} disabled={loading} className="w-full">
              <Send className="mr-2 h-4 w-4" />
              Enviar Contacto
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="commerce" className="space-y-4">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              Gestión de Productos
            </CardTitle>
            <CardDescription>Administra tu catálogo y envía productos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={handleLoadCatalogs} disabled={loading}>
              <Download className="mr-2 h-4 w-4" />
              Cargar Catálogos
            </Button>
            
            {catalogs.length > 0 && (
              <div className="space-y-2">
                <Label>Catálogos disponibles:</Label>
                <div className="grid gap-2">
                  {catalogs.map((catalog: any) => (
                    <Button
                      key={catalog.id}
                      variant="outline"
                      onClick={() => handleLoadProducts(catalog.id)}
                      className="justify-start"
                    >
                      {catalog.name || catalog.id}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {products.length > 0 && (
              <div className="space-y-4">
                <Label>Productos disponibles: {products.length}</Label>
                <div className="grid gap-4">
                  <div>
                    <Label>Número destinatario</Label>
                    <Input
                      value={productTo}
                      onChange={(e) => setProductTo(e.target.value)}
                      placeholder="573205434546"
                    />
                  </div>
                  <div>
                    <Label>Seleccionar producto</Label>
                    <select
                      className="w-full p-2 border rounded-md"
                      value={selectedProduct}
                      onChange={(e) => setSelectedProduct(e.target.value)}
                    >
                      <option value="">Selecciona un producto</option>
                      {products.map((product: any) => (
                        <option key={product.id} value={product.retailer_id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Button onClick={handleSendProduct} disabled={loading || !selectedProduct}>
                    <Send className="mr-2 h-4 w-4" />
                    Enviar Producto
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="templates" className="space-y-4">
        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-950/20">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-purple-500 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              Crear Template
            </CardTitle>
            <CardDescription>Crea templates de mensaje reutilizables y aprobados por Meta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nombre del template</Label>
                <Input
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="mi_template"
                />
              </div>
              <div>
                <Label>Categoría</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={templateCategory}
                  onChange={(e) => setTemplateCategory(e.target.value)}
                >
                  <option value="MARKETING">Marketing</option>
                  <option value="UTILITY">Utilidad</option>
                  <option value="AUTHENTICATION">Autenticación</option>
                </select>
              </div>
              <div>
                <Label>Idioma</Label>
                <Input
                  value={templateLanguage}
                  onChange={(e) => setTemplateLanguage(e.target.value)}
                  placeholder="es"
                />
              </div>
            </div>
            <div>
              <Label>Contenido del mensaje</Label>
              <Textarea
                value={templateBody}
                onChange={(e) => setTemplateBody(e.target.value)}
                placeholder="Hola, este es mi mensaje..."
                rows={4}
              />
            </div>
            <Button onClick={handleCreateTemplate} disabled={loading}>
              <Plus className="mr-2 h-4 w-4" />
              Crear Template
            </Button>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analytics" className="space-y-4">
        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-orange-50/50 to-transparent dark:from-orange-950/20">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-orange-500 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              Analytics y Métricas
            </CardTitle>
            <CardDescription>Estadísticas de uso y rendimiento de WhatsApp Business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={handleLoadAnalytics} disabled={loading}>
                <Download className="mr-2 h-4 w-4" />
                Cargar Analytics
              </Button>
              <Button onClick={handleLoadQualityInfo} disabled={loading}>
                <Shield className="mr-2 h-4 w-4" />
                Info de Calidad
              </Button>
            </div>
            
            {qualityInfo && (
              <div className="space-y-2 p-4 border rounded-lg">
                <h4 className="font-semibold">Información de Calidad</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Quality Rating:</span>
                    <Badge className="ml-2">{qualityInfo.quality?.quality_rating}</Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Platform:</span>
                    <Badge variant="outline" className="ml-2">{qualityInfo.quality?.platform_type}</Badge>
                  </div>
                </div>
                {qualityInfo.limit && (
                  <div className="mt-2">
                    <span className="text-sm text-muted-foreground">Límite de mensajes: </span>
                    <code className="text-sm">{JSON.stringify(qualityInfo.limit)}</code>
                  </div>
                )}
              </div>
            )}
            
            {analytics && (
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Datos de Analytics</h4>
                <pre className="text-xs overflow-auto max-h-64">
                  {JSON.stringify(analytics, null, 2)}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="settings" className="space-y-4">
        <Card className="border-l-4 border-l-slate-500 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-slate-50/50 to-transparent dark:from-slate-950/20">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-slate-500 flex items-center justify-center">
                <Settings className="h-5 w-5 text-white" />
              </div>
              Perfil de Negocio
            </CardTitle>
            <CardDescription>Actualiza la información pública de tu negocio</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>About</Label>
              <Input
                value={profileAbout}
                onChange={(e) => setProfileAbout(e.target.value)}
                placeholder="Breve descripción"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={profileDescription}
                onChange={(e) => setProfileDescription(e.target.value)}
                placeholder="Descripción completa"
                rows={3}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                placeholder="contacto@empresa.com"
                type="email"
              />
            </div>
            <Button onClick={handleUpdateProfile} disabled={loading}>
              <Settings className="mr-2 h-4 w-4" />
              Actualizar Perfil
            </Button>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-500 hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-950/20">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              Webhooks
            </CardTitle>
            <CardDescription>Configurar suscripciones de eventos en tiempo real</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleSubscribeWebhook} disabled={loading}>
              <Globe className="mr-2 h-4 w-4" />
              Suscribir a Webhooks
            </Button>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
