import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquare, Plus, QrCode, Smartphone, RefreshCw, Power } from "lucide-react";

export default function WhatsAppAdmin() {
  const [instances, setInstances] = useState([
    { id: "WA-001", name: "Ventas Principal", number: "+34 600 000 001", status: "connected", messages: 1250 },
    { id: "WA-002", name: "Soporte Técnico", number: "+34 600 000 002", status: "connected", messages: 3400 },
    { id: "WA-003", name: "Marketing Promo", number: "+34 600 000 003", status: "disconnected", messages: 0 },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Administración de WhatsApp
          </h1>
          <p className="text-muted-foreground">Gestiona tus instancias de WhatsApp Business API.</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" /> Nueva Instancia
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {instances.map((instance) => (
          <Card key={instance.id} className="bg-slate-900/50 border-slate-800 backdrop-blur hover:border-green-500/30 transition-all">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{instance.name}</CardTitle>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{instance.number}</p>
                  </div>
                </div>
                <Badge variant={instance.status === 'connected' ? 'default' : 'destructive'} className={instance.status === 'connected' ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : ''}>
                  {instance.status === 'connected' ? 'Conectado' : 'Desconectado'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                  <span className="text-xs text-muted-foreground block">Mensajes Hoy</span>
                  <span className="text-lg font-bold text-slate-200">{instance.messages}</span>
                </div>
                <div className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                  <span className="text-xs text-muted-foreground block">ID Instancia</span>
                  <span className="text-xs font-mono text-slate-400 mt-1">{instance.id}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                {instance.status === 'disconnected' ? (
                  <Button className="w-full bg-slate-800 hover:bg-slate-700" variant="outline">
                    <QrCode className="mr-2 h-4 w-4" /> Escanear QR
                  </Button>
                ) : (
                  <Button className="w-full bg-slate-800 hover:bg-slate-700" variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" /> Reiniciar
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="hover:text-red-400">
                  <Power className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Add New Card Placeholder */}
        <Card className="bg-slate-900/20 border-slate-800 border-dashed backdrop-blur hover:bg-slate-900/40 transition-all flex flex-col items-center justify-center p-6 cursor-pointer group">
          <div className="h-16 w-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Plus className="h-8 w-8 text-slate-500 group-hover:text-green-500" />
          </div>
          <h3 className="font-semibold text-slate-400 group-hover:text-green-400">Añadir Instancia</h3>
          <p className="text-xs text-muted-foreground mt-1 text-center">Conectar nuevo número</p>
        </Card>
      </div>
    </div>
  );
}