
'use client';

import { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, addDoc, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ApiKey } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function ApiKeysTable() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const apiKeysQuery = useMemo(() => {
    if (!user) return null;
    return collection(firestore, 'apiKeys');
  }, [user, firestore]);

  const { data: apiKeys, isLoading, error } = useCollection<ApiKey>(apiKeysQuery);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [apiKeyName, setApiKeyName] = useState('');
  const [apiKeyService, setApiKeyService] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  // State for Twilio credentials
  const [twilioAccountSid, setTwilioAccountSid] = useState('');
  const [twilioAuthToken, setTwilioAuthToken] = useState('');

  const generateApiKey = () => {
    const key = `SAAS-${uuidv4()}`;
    setNewApiKey(key);
    setShowKey(true);
    // Automatically copy to clipboard
    navigator.clipboard.writeText(key);
    toast({ title: "API Key Generated & Copied!", description: "The new key has been copied to your clipboard." });
  };

  const handleCreateKey = async () => {
    if (!user || !newApiKey || !apiKeyName || !apiKeyService) return;

    const keyData: any = {
      name: apiKeyName,
      key: newApiKey,
      service: apiKeyService,
      status: 'active',
      createdAt: serverTimestamp(),
      lastUsed: null,
      usageCount: 0,
      createdBy: user.uid,
    };

    if (apiKeyService === 'Twilio') {
      if (!twilioAccountSid || !twilioAuthToken) {
        toast({ title: "Missing Twilio Credentials", description: "Account SID and Auth Token are required for Twilio keys.", variant: "destructive" });
        return;
      }
      keyData.twilioAccountSid = twilioAccountSid;
      keyData.twilioAuthToken = twilioAuthToken;
    }

    await addDoc(collection(firestore, 'apiKeys'), keyData);
    
    // Reset form
    setNewApiKey('');
    setApiKeyName('');
    setApiKeyService('');
    setTwilioAccountSid('');
    setTwilioAuthToken('');
    setDialogOpen(false);
    toast({ title: "API Key Created Successfully!" });
  };

  const handleDeleteKey = async (id: string) => {
    if (!user) return;
    if (confirm('Are you sure you want to delete this API key?')) {
      await deleteDoc(doc(firestore, 'apiKeys', id));
      toast({ title: "API Key Deleted", variant: "destructive" });
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API Keys</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create New Key</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>Configure and generate a new API key for your services.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="apiKeyName">Key Name</Label>
                <Input id="apiKeyName" value={apiKeyName} onChange={(e) => setApiKeyName(e.target.value)} placeholder="e.g., My Production Key" />
              </div>
              <div>
                <Label htmlFor="apiKeyService">Service</Label>
                <Select onValueChange={setApiKeyService} value={apiKeyService}>
                  <SelectTrigger><SelectValue placeholder="Select a service" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Evolution">Evolution API (WhatsApp)</SelectItem>
                    <SelectItem value="Twilio">Twilio API</SelectItem>
                    <SelectItem value="Call API">Call API</SelectItem>
                    <SelectItem value="General">General Use</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {apiKeyService === 'Twilio' && (
                <div className="space-y-2 border p-4 rounded-md">
                  <h4 className="font-medium">Twilio Credentials</h4>
                  <div>
                     <Label htmlFor="twilioSid">Account SID</Label>
                     <Input id="twilioSid" value={twilioAccountSid} onChange={e => setTwilioAccountSid(e.target.value)} placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" />
                  </div>
                  <div>
                     <Label htmlFor="twilioToken">Auth Token</Label>
                     <Input id="twilioToken" type="password" value={twilioAuthToken} onChange={e => setTwilioAuthToken(e.target.value)} placeholder="Your Twilio Auth Token" />
                  </div>
                </div>
              )}

              <div className="flex items-end gap-2">
                <div className="flex-1">
                    <Label htmlFor="newApiKey">Generated Key</Label>
                    <Input id="newApiKey" type={showKey ? 'text' : 'password'} value={newApiKey} readOnly placeholder="Click Generate to create a key" />
                </div>
                <Button variant="outline" size="icon" onClick={() => setShowKey(!showKey)} disabled={!newApiKey}>
                    {showKey ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                </Button>
                <Button onClick={generateApiKey} variant="secondary">Generate</Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateKey} disabled={!newApiKey || !apiKeyName || !apiKeyService}>Save Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && <TableRow><TableCell colSpan={6} className="text-center">Loading keys...</TableCell></TableRow>}
            {error && <TableRow><TableCell colSpan={6} className="text-center text-red-500">Error loading keys.</TableCell></TableRow>}
            {apiKeys?.map((apiKey) => (
              <TableRow key={apiKey.id}>
                <TableCell>{apiKey.name}</TableCell>
                <TableCell><Badge variant="outline">{apiKey.service}</Badge></TableCell>
                <TableCell className="font-mono flex items-center gap-2">
                  <span>{visibleKeys[apiKey.id] ? apiKey.key : `SAAS-*****************` }</span>
                   <Button variant="ghost" size="icon" onClick={() => toggleKeyVisibility(apiKey.id)}>
                       {visibleKeys[apiKey.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </Button>
                  <Button variant="ghost" size="icon" onClick={() => {navigator.clipboard.writeText(apiKey.key); toast({title: 'Copied!'})}}>
                      <Copy className="h-4 w-4" />
                  </Button>
                </TableCell>
                <TableCell><Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>{apiKey.status}</Badge></TableCell>
                <TableCell>{apiKey.createdAt?.toDate().toLocaleDateString()}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteKey(.id!)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
