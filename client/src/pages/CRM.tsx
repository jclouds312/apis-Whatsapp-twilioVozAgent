import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users, Search, Filter, MoreHorizontal, Mail, Phone,
  Tag, Calendar, ArrowUpRight, Download, Plus
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const contacts = [
  { id: 1, name: "John Doe", email: "john@example.com", phone: "+1 (555) 123-4567", company: "Acme Inc", tags: ["Lead", "High Value"], status: "New", lastContact: "2 days ago" },
  { id: 2, name: "Alice Smith", email: "alice@techcorp.com", phone: "+1 (555) 987-6543", company: "TechCorp", tags: ["Customer", "Enterprise"], status: "Active", lastContact: "Yesterday" },
  { id: 3, name: "Bob Wilson", email: "bob@startup.io", phone: "+1 (555) 222-3333", company: "Startup.io", tags: ["Prospect"], status: "Negotiation", lastContact: "1 week ago" },
  { id: 4, name: "Sarah Jones", email: "sarah@design.co", phone: "+1 (555) 444-5555", company: "DesignCo", tags: ["Partner"], status: "Active", lastContact: "3 days ago" },
  { id: 5, name: "Mike Brown", email: "mike@consulting.net", phone: "+1 (555) 777-8888", company: "Consulting Net", tags: ["Lead"], status: "New", lastContact: "Just now" },
];

export default function CRM() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Contacts", value: "2,543", change: "+12%", icon: Users, color: "text-blue-500" },
          { label: "New Leads", value: "145", change: "+5%", icon: ArrowUpRight, color: "text-green-500" },
          { label: "Active Deals", value: "89", change: "+2%", icon: Tag, color: "text-purple-500" },
          { label: "Conversion Rate", value: "24.5%", change: "+1.2%", icon: Calendar, color: "text-orange-500" },
        ].map((stat, i) => (
          <Card key={i} className="bg-card/50 backdrop-blur-sm border-primary/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between space-y-0 pb-2">
                <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div className="flex items-center pt-2">
                <span className="text-2xl font-bold">{stat.value}</span>
                <span className="ml-2 text-xs text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">{stat.change}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content */}
      <Card className="bg-card/50 backdrop-blur-sm border-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contacts</CardTitle>
              <CardDescription>Manage your leads and customers</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-primary/20">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                className="pl-8 bg-background/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-primary/10">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-primary/10">
                  <TableHead className="w-[250px]">Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} className="hover:bg-muted/50 border-primary/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {contact.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{contact.name}</div>
                          <div className="text-xs text-muted-foreground">{contact.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{contact.company}</TableCell>
                    <TableCell>
                      <Badge variant={contact.status === "Active" ? "default" : "secondary"} className="font-normal">
                        {contact.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {contact.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs border-primary/20">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">{contact.lastContact}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" /> Email
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" /> Call
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
