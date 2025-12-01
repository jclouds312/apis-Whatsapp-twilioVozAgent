'use client';
// Trigger rebuild
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from "@/components/ui/toast"
import { Badge } from '@/components/ui/badge';
import { Loader2, Power, QrCode, Trash2 } from 'lucide-react';

// Define types for the instance data
type Instance = {
    instance: {
        instanceName: string;
        status: string;
        owner: string;
    }
};

async function fetchFromEvolutionAPI(endpoint: string, apiKey: string, options: RequestInit = {}) {
    const url = `/api/evolution/${endpoint}`;
    const response = await fetch(url, {
        ...options,
        headers: {
            ...options.headers,
            'Authorization': `Bearer ${apiKey}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An API error occurred');
    }
    return response.json();
}

export function EvolutionInstanceManager() {
    const [apiKey, setApiKey] = useState('');
    const [instanceName, setInstanceName] = useState('');
    const [instances, setInstances] = useState<Instance[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [isInstanceLoading, setIsInstanceLoading] = useState<Record<string, boolean>>({});
    const { toast } = useToast();

    const fetchInstances = async () => {
        if (!apiKey) return;
        setIsLoading(true);
        try {
            const data = await fetchFromEvolutionAPI('instance/fetchInstances', apiKey);
            setInstances(data || []);
        } catch (error: any) {
            toast({ title: "Error fetching instances", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateInstance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!apiKey || !instanceName) {
            toast({ title: "Missing fields", description: "API Key and Instance Name are required.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        try {
            await fetchFromEvolutionAPI('instance/create', apiKey, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ instanceName, qrcode: true }),
            });
            toast({ title: "Instance Created", description: `Instance ${instanceName} is being set up.` });
            setInstanceName('');
            await fetchInstances();
        } catch (error: any) {
            toast({ title: "Error creating instance", description: error.message, variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleConnect = async (name: string) => {
        if (!apiKey) return;
        setIsInstanceLoading(prev => ({ ...prev, [name]: true }));
        setQrCode('');
        try {
            const data = await fetchFromEvolutionAPI(`instance/connect/${name}`, apiKey);
            if (data.base64) {
                setQrCode(data.base64);
                toast({ title: "Scan QR Code", description: `Scan the code to connect ${name}.` });
            }
        } catch (error: any) {
            toast({ title: "Error connecting instance", description: error.message, variant: "destructive" });
        } finally {
            setIsInstanceLoading(prev => ({ ...prev, [name]: false }));
        }
    };
    
    const handleLogout = async (name: string) => {
        if (!apiKey) return;
        setIsInstanceLoading(prev => ({ ...prev, [name]: true }));
        try {
            await fetchFromEvolutionAPI(`instance/logout/${name}`, apiKey, { method: 'DELETE' });
            toast({ title: "Instance Logged Out", description: `Successfully disconnected ${name}.` });
            await fetchInstances();
        } catch (error: any) {
            toast({ title: "Error logging out", description: error.message, variant: "destructive" });
        } finally {
            setIsInstanceLoading(prev => ({ ...prev, [name]: false }));
        }
    };

    useEffect(() => {
        if (apiKey) {
            fetchInstances();
        }
    }, [apiKey]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Evolution API Instance Manager</CardTitle>
                <CardDescription>Manage your WhatsApp instances. Enter your API key to begin.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="apiKey">API Key</Label>
                    <Input id="apiKey" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Enter your API Key" />
                </div>

                {apiKey && (
                    <>
                        <form onSubmit={handleCreateInstance} className="flex items-end gap-2">
                            <div className="flex-1">
                                <Label htmlFor="instanceName">New Instance Name</Label>
                                <Input id="instanceName" value={instanceName} onChange={(e) => setInstanceName(e.target.value)} placeholder="e.g., my-business-whatsapp" />
                            </div>
                            <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Create'}</Button>
                        </form>

                        <div className="space-y-4">
                            <h3 className="text-md font-medium">Available Instances</h3>
                             {isLoading && <div className="flex items-center gap-2"><Loader2 className="h-4 w-4 animate-spin"/> Loading instances...</div>}
                            <div className="space-y-2">
                                {instances.map(({ instance }) => (
                                    <div key={instance.instanceName} className="flex items-center justify-between rounded-md border p-3">
                                        <div>
                                            <span className="font-medium">{instance.instanceName}</span>
                                            <Badge variant={instance.status === 'open' ? 'default' : 'secondary'} className={`ml-2 ${instance.status === 'open' ? 'bg-green-100 text-green-800' : ''}`}>
                                                {instance.status}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {instance.status !== 'open' && (
                                                <Button size="sm" variant="outline" onClick={() => handleConnect(instance.instanceName)} disabled={isInstanceLoading[instance.instanceName]}>
                                                    {isInstanceLoading[instance.instanceName] ? <Loader2 className="h-4 w-4 animate-spin" /> : <QrCode className="h-4 w-4"/>}
                                                </Button>
                                            )}
                                            {instance.status === 'open' && (
                                                 <Button size="sm" variant="destructive" onClick={() => handleLogout(instance.instanceName)} disabled={isInstanceLoading[instance.instanceName]}>
                                                     {isInstanceLoading[instance.instanceName] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Power className="h-4 w-4"/>}
                                                 </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {qrCode && (
                            <div className="text-center space-y-2">
                                <h4 className="font-medium">Scan to Connect</h4>
                                <img src={`data:image/png;base64,${qrCode}`} alt="QR Code" className="mx-auto border p-2" />
                                <Button variant="link" onClick={() => setQrCode('')}>Close QR</Button>
                            </div>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
}
