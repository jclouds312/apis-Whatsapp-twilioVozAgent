import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Search, 
  Filter, 
  UserPlus, 
  MoreVertical, 
  Mail, 
  Phone,
  Tag
} from "lucide-react";

const contacts = [
  { id: 1, name: "Alice Freeman", phone: "+1 (555) 019-2834", email: "alice.f@example.com", tags: ["Lead", "VIP"], status: "Active", lastContact: "2h ago" },
  { id: 2, name: "Bob Smith", phone: "+1 (555) 992-1122", email: "bob.smith@corp.com", tags: ["Customer"], status: "Idle", lastContact: "1d ago" },
  { id: 3, name: "Carol Danvers", phone: "+1 (555) 123-4567", email: "c.danvers@marvel.com", tags: ["Lead", "High Value"], status: "Active", lastContact: "30m ago" },
  { id: 4, name: "David Goggins", phone: "+1 (555) 444-5555", email: "hard@work.com", tags: ["Prospect"], status: "Do Not Call", lastContact: "5d ago" },
  { id: 5, name: "Eve Polastri", phone: "+1 (555) 222-3333", email: "eve@mi6.gov.uk", tags: ["Investigation"], status: "Active", lastContact: "Just now" },
];

export default function Contacts() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Contacts & CRM</h2>
          <p className="text-muted-foreground">Manage leads, customers, and audience segments.</p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      <Card className="glass-panel">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
             <div className="flex items-center gap-2 w-full sm:w-auto">
               <div className="relative w-full sm:w-64">
                 <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                 <Input placeholder="Search contacts..." className="pl-8 h-9 bg-background/50" />
               </div>
               <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                 <Filter className="h-4 w-4" />
               </Button>
             </div>
             <div className="flex gap-2">
               <Button variant="ghost" size="sm">Select All</Button>
               <Button variant="outline" size="sm">Bulk Action</Button>
             </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                <TableHead className="w-[50px]"></TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Last Interaction</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact.id} className="hover:bg-muted/30 border-border/50 group">
                  <TableCell>
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{contact.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{contact.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {contact.phone}
                      </div>
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {contact.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {contact.tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-[10px] px-1 py-0 h-5">{tag}</Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant="outline" 
                      className={
                        contact.status === 'Active' ? 'text-emerald-500 border-emerald-500/30' : 
                        contact.status === 'Do Not Call' ? 'text-red-500 border-red-500/30' : 'text-muted-foreground'
                      }
                    >
                      {contact.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">{contact.lastContact}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
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