import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import {
  Phone, Globe, CheckCircle, AlertCircle, Plus, Search, Settings, Link as LinkIcon, MoreHorizontal
} from "lucide-react";

export default function Admin() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  // Mock data for existing numbers
  const [phoneNumbers, setPhoneNumbers] = useState([
    { id: 1, number: "+1 (415) 555-0101", region: "US - California", type: "Local", capabilities: ["Voice", "SMS"], status: "Active", crmLink: "Linked" },
    { id: 2, number: "+1 (212) 555-0199", region: "US - New York", type: "Local", capabilities: ["Voice", "SMS", "MMS"], status: "Active", crmLink: "Unlinked" },
    { id: 3, number: "+1 (512) 555-0255", region: "US - Texas", type: "Local", capabilities: ["Voice"], status: "Configuring", crmLink: "Pending" },
    { id: 4, number: "+1 (862) 277-0131", region: "US - New Jersey", type: "Main", capabilities: ["Voice", "SMS", "WhatsApp"], status: "Active", crmLink: "Linked" },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Admin: Phone Number Management</h1>
          <p className="text-muted-foreground">Manage and configure US phone numbers for your organization.</p>
        </div>
        <div className="flex items-center gap-2">
           <Button variant="outline">
             <Settings className="h-4 w-4 mr-2" /> Global Config
           </Button>
           <Button onClick={() => setIsBuyModalOpen(true)}>
             <Plus className="h-4 w-4 mr-2" /> Buy Number
           </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Numbers</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CRM Linked</CardTitle>
            <LinkIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">66% coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
            <span className="text-sm font-bold text-muted-foreground">$14.50</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12.00</div>
            <p className="text-xs text-muted-foreground">Base allocation</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
                <CardTitle>Phone Inventory</CardTitle>
                <CardDescription>View and manage your active phone lines.</CardDescription>
            </div>
            <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input 
                    placeholder="Search numbers..." 
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Number</TableHead>
                <TableHead>Region</TableHead>
                <TableHead>Capabilities</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>CRM Link</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {phoneNumbers.map((phone) => (
                <TableRow key={phone.id}>
                  <TableCell className="font-medium font-mono">{phone.number}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-muted-foreground" />
                        {phone.region}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                        {phone.capabilities.map(cap => (
                            <Badge key={cap} variant="secondary" className="text-[10px] h-5">{cap}</Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={phone.status === "Active" ? "outline" : "secondary"} className={
                        phone.status === "Active" ? "bg-green-500/10 text-green-600 border-green-500/20" : ""
                    }>
                        {phone.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm">
                        {phone.crmLink === "Linked" ? (
                            <>
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span className="text-muted-foreground">Synced</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle className="h-4 w-4 text-yellow-500" />
                                <span className="text-muted-foreground">Unlinked</span>
                            </>
                        )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Buy Number Modal */}
      <Dialog open={isBuyModalOpen} onOpenChange={setIsBuyModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
                <DialogTitle>Buy New Phone Number</DialogTitle>
                <DialogDescription>
                    Search for available US numbers to add to your account.
                </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Country</label>
                        <Select defaultValue="us">
                            <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="us">United States (+1)</SelectItem>
                                <SelectItem value="ca">Canada (+1)</SelectItem>
                                <SelectItem value="uk">United Kingdom (+44)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                         <label className="text-sm font-medium">Area Code</label>
                         <Input placeholder="e.g. 415" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium">Capabilities</label>
                    <div className="flex gap-2">
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">Voice</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">SMS</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-muted">MMS</Badge>
                    </div>
                </div>
                
                <div className="mt-4 border rounded-md divide-y">
                    <div className="p-3 flex justify-between items-center hover:bg-muted/50 cursor-pointer">
                        <div>
                            <p className="font-mono font-medium">+1 (415) 555-9001</p>
                            <p className="text-xs text-muted-foreground">San Francisco, CA</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-sm">$1.00/mo</span>
                            <Button size="sm" variant="outline">Select</Button>
                        </div>
                    </div>
                    <div className="p-3 flex justify-between items-center hover:bg-muted/50 cursor-pointer">
                        <div>
                            <p className="font-mono font-medium">+1 (415) 555-9002</p>
                            <p className="text-xs text-muted-foreground">San Francisco, CA</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-sm">$1.00/mo</span>
                            <Button size="sm" variant="outline">Select</Button>
                        </div>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <Button variant="outline" onClick={() => setIsBuyModalOpen(false)}>Cancel</Button>
                <Button onClick={() => setIsBuyModalOpen(false)}>Buy Number</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

