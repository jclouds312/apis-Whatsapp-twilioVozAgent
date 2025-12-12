import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, UserPlus, Mail, Shield, Briefcase, Users, Phone } from "lucide-react";

export default function Accounts() {
  const [users, setUsers] = useState([
    { id: 1, name: "Ana Silva", role: "Ventas", email: "ana.silva@nexus.com", status: "active", avatar: "AS" },
    { id: 2, name: "Empresa ABC S.A.", role: "Cliente", email: "contacto@abc.com", status: "active", avatar: "EA" },
    { id: 3, name: "Carlos Ruiz", role: "Asesor", email: "carlos.ruiz@nexus.com", status: "busy", avatar: "CR" },
    { id: 4, name: "Tech Solutions SL", role: "Cliente", email: "info@techsolutions.com", status: "inactive", avatar: "TS" },
    { id: 5, name: "Laura Mendez", role: "Ventas", email: "laura.mendez@nexus.com", status: "active", avatar: "LM" },
  ]);

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'Ventas': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'Cliente': return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Asesor': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            Gestión de Cuentas
          </h1>
          <p className="text-muted-foreground">Administra usuarios, clientes y equipos de ventas.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-700">Exportar CSV</Button>
          <Button className="bg-purple-600 hover:bg-purple-700">
            <UserPlus className="mr-2 h-4 w-4" /> Nuevo Usuario
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <TabsList className="bg-slate-900/50 border border-slate-800">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="sales">Ventas</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="advisors">Asesores</TabsTrigger>
          </TabsList>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar por nombre o email..." className="pl-8 bg-slate-950/50 border-slate-800" />
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <Card key={user.id} className="bg-slate-900/50 border-slate-800 backdrop-blur hover:border-purple-500/30 transition-all group">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <Avatar className="h-12 w-12 border-2 border-slate-800 group-hover:border-purple-500/50 transition-colors">
                    <AvatarFallback className="bg-slate-800 text-slate-200">{user.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 overflow-hidden">
                    <CardTitle className="text-base truncate">{user.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className={`text-xs ${getRoleColor(user.role)}`}>
                        {user.role}
                      </Badge>
                      <span className={`h-2 w-2 rounded-full ${user.status === 'active' ? 'bg-green-500' : user.status === 'busy' ? 'bg-red-500' : 'bg-slate-500'}`} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{user.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      <span>Permisos: {user.role === 'Admin' ? 'Total' : 'Estándar'}</span>
                    </div>
                    {user.role === 'Ventas' && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Ventas del mes: $12,450</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="w-full border-slate-700 hover:bg-slate-800">Perfil</Button>
                    <Button size="sm" variant="outline" className="w-full border-slate-700 hover:bg-slate-800">Asignar</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        {/* Placeholder contents for other tabs could be similar logic filtered */}
      </Tabs>
    </div>
  );
}