import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Phone, User, Settings, Trash2, Edit } from "lucide-react";

export default function ExtensionsAdmin() {
  const [extensions, setExtensions] = useState([
    { id: 100, user: "Main Company Line", department: "Administración", status: "online", type: "Main", number: "862-277-0131", password: "••••••••", security: "High" },
    { id: 101, user: "Juan Pérez", department: "Ventas", status: "online", type: "SIP", number: "101" },
    { id: 102, user: "Maria García", department: "Soporte", status: "busy", type: "WebRTC" },
    { id: 103, user: "Carlos López", department: "Ventas", status: "offline", type: "SIP" },
    { id: 104, user: "Ana Martínez", department: "Administración", status: "online", type: "WebRTC" },
    { id: 105, user: "Soporte General", department: "Soporte", status: "online", type: "Queue" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Administración de Extensiones
          </h1>
          <p className="text-muted-foreground">Gestiona las extensiones telefónicas y asignaciones.</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Nueva Extensión
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Extensiones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{extensions.length}</div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">En Línea</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {extensions.filter(e => e.status === 'online' || e.status === 'busy').length}
            </div>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tipos SIP</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500">
              {extensions.filter(e => e.type === 'SIP').length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10 bg-slate-900/50 backdrop-blur">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Listado de Extensiones</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar extensión..." className="pl-8 bg-slate-950/50 border-slate-800" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="border-slate-800 hover:bg-slate-900/50">
                <TableHead>Extensión</TableHead>
                <TableHead>Número Directo</TableHead>
                <TableHead>Contraseña</TableHead>
                <TableHead>Seguridad</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {extensions.map((ext) => (
                <TableRow key={ext.id} className="border-slate-800 hover:bg-slate-900/50">
                  <TableCell className="font-mono text-blue-400 font-bold">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      {ext.id}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-slate-300">
                    {ext.number}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {ext.password || "N/A"}
                  </TableCell>
                  <TableCell>
                    {ext.security === "High" ? (
                      <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-500/10">High</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">Standard</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                        <User className="h-4 w-4 text-slate-400" />
                      </div>
                      <span className="font-medium">{ext.user}</span>
                    </div>
                  </TableCell>
                  <TableCell>{ext.department}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-700">{ext.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${
                      ext.status === 'online' ? 'bg-green-500/20 text-green-400' :
                      ext.status === 'busy' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-500/20 text-slate-400'
                    }`}>
                      {ext.status === 'online' ? 'Disponible' :
                       ext.status === 'busy' ? 'Ocupado' : 'Desconectado'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-blue-400">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-400">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-slate-400">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}