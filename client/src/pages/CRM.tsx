import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Users, TrendingUp, Workflow as WorkflowIcon, Activity } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

// Mock Data
const mockLogs = [
  { id: 1, timestamp: "2024-12-01T10:00:00", level: "info", endpoint: "CRM", message: "Lead synced successfully" },
  { id: 2, timestamp: "2024-12-01T10:05:00", level: "warn", endpoint: "CRM", message: "Duplicate contact detected" },
  { id: 3, timestamp: "2024-12-01T10:10:00", level: "error", endpoint: "CRM", message: "API Rate limit reached" },
];

const mockWorkflows = [
  { id: 1, name: "New Lead -> WhatsApp", trigger: "CRM: New Lead", status: "active" },
  { id: 2, name: "Deal Won -> Notify Team", trigger: "CRM: Deal Update", status: "active" },
  { id: 3, name: "Stale Lead -> Email", trigger: "CRM: No Activity", status: "inactive" },
];

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";

function StatCard({ title, value, description, Icon, iconColor }: any) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

const DEMO_USER_ID = "demo-user-123";

export default function CrmPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "" });
  const isCrmConnected = true;

  const { data: contacts = [], isLoading, refetch } = useQuery({
    queryKey: ["crmContacts"],
    queryFn: async () => {
      const res = await fetch(`/api/crm/contacts?userId=${DEMO_USER_ID}`);
      return res.json();
    },
    refetchInterval: 5000,
  });

  const createContactMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await fetch("/api/crm/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: DEMO_USER_ID, ...data, status: "new", source: "manual" }),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success("Contact created!");
      setFormData({ name: "", email: "", phone: "", company: "" });
      setShowForm(false);
      refetch();
    },
    onError: () => toast.error("Failed to create contact"),
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-500" />
          CRM Integration
        </h2>
        <p className="text-muted-foreground">Manage your CRM connection and monitor data sync.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="transition-all hover:shadow-md">
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
            <CardDescription>CRM API Key status.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center space-x-2 pt-2">
            {isCrmConnected ? (
                <CheckCircle className="h-6 w-6 text-green-500" />
            ) : (
                <XCircle className="h-6 w-6 text-destructive" />
            )}
            <span className={`text-lg font-medium ${isCrmConnected ? "text-green-600" : "text-destructive"}`}>
                {isCrmConnected ? "Connected" : "Not Connected"}
            </span>
          </CardContent>
        </Card>
        <StatCard 
            title="Total Contacts"
            value={contacts.length}
            description="In your CRM"
            Icon={Users}
            iconColor="text-blue-500"
        />
        <StatCard 
            title="New Contacts"
            value={contacts.filter((c: any) => c.status === "new").length}
            description="Unqualified leads"
            Icon={TrendingUp}
            iconColor="text-purple-500"
        />
        <StatCard 
            title="Active CRM Workflows"
            value="2"
            description="Automations involving CRM"
            Icon={WorkflowIcon}
            iconColor="text-orange-500"
        />
      </div>

      {showForm && (
        <Card className="bg-card/50 border-border/50 border-primary/50">
          <CardHeader>
            <CardTitle>Add Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name *</label>
                <Input placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input placeholder="+1234567890" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Company</label>
                <Input placeholder="Acme Corp" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => createContactMutation.mutate(formData)} disabled={!formData.name || createContactMutation.isPending}>
                {createContactMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                Save Contact
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Close" : "Add Contact"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Recent Contacts</CardTitle>
            <CardDescription>Latest contacts added to your CRM.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={3} className="text-center py-8"><Loader2 className="h-4 w-4 animate-spin inline" /></TableCell></TableRow>
                ) : contacts.slice(-5).map((contact: any) => (
                  <TableRow key={contact.id}>
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell className="text-muted-foreground text-xs">{contact.email || contact.phone}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${
                        contact.status === 'new' ? 'bg-blue-500/10 text-blue-500' :
                        contact.status === 'contacted' ? 'bg-yellow-500/10 text-yellow-500' :
                        'bg-green-500/10 text-green-500'
                      }`}>
                        {contact.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="transition-all hover:shadow-lg">
          <CardHeader>
            <CardTitle>Related Workflows</CardTitle>
            <CardDescription>Automations that interact with your CRM.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workflow Name</TableHead>
                  <TableHead>Trigger</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockWorkflows.map(wf => (
                  <TableRow key={wf.id}>
                    <TableCell className="font-medium">{wf.name}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{wf.trigger}</TableCell>
                    <TableCell>
                      <Badge variant={wf.status === 'active' ? 'default' : 'secondary'} 
                          className={wf.status === 'active' 
                              ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                              : ''
                          }>
                          {wf.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
