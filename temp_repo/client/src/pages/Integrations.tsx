import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  MessageSquare,
  Phone,
  Server,
  Facebook,
  Bot,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Settings2,
  RefreshCw,
  Power,
  Activity
} from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    {
      id: "asterisk",
      name: "Asterisk PBX / Elastix",
      description: "Connect to your on-premise or cloud Asterisk/Elastix server via AMI/ARI.",
      icon: Server,
      status: "Connected",
      color: "bg-orange-500",
      link: "/asterisk",
      features: ["Extension Management", "Live Call Monitoring", "CDR Reports", "SIP Trunks"]
    },
    {
      id: "whatsapp",
      name: "WhatsApp Business",
      description: "Send automated notifications and chat with customers via WhatsApp Web or Cloud API.",
      icon: MessageSquare,
      status: "Connected",
      color: "bg-green-500",
      link: "/whatsapp",
      features: ["Chat Console", "Template Messages", "Auto-replies", "WHMCS Integration"]
    },
    {
      id: "twilio",
      name: "Twilio Voice & SMS",
      description: "Cloud communications platform for programmable voice and messaging.",
      icon: Phone,
      status: "Configured",
      color: "bg-red-500",
      link: "/twilio",
      features: ["Programmable Voice", "SMS Gateways", "Phone Numbers", "SIP Trunking"]
    },
    {
      id: "retell",
      name: "Retell AI",
      description: "Build voice agents that can handle complex conversations naturally.",
      icon: Bot,
      status: "Beta",
      color: "bg-purple-500",
      link: "/retell",
      features: ["Voice Agents", "LLM Integration", "Real-time Transcription"]
    },
    {
      id: "vonage",
      name: "Vonage API",
      description: "Communications APIs for Voice, SMS, Verify and Video.",
      icon: Activity,
      status: "Connected",
      color: "bg-slate-900",
      link: "/vonage",
      features: ["Voice API", "NCCO Builder", "SMS", "Numbers"]
    },
    {
      id: "facebook",
      name: "Meta / Facebook SDK",
      description: "Integrate with Facebook Messenger and Instagram Direct.",
      icon: Facebook,
      status: "Disconnected",
      color: "bg-blue-600",
      link: "/facebook-integration",
      features: ["Messenger API", "Instagram DM", "Catalog Sync"]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Integrations Hub</h1>
        <p className="text-muted-foreground mt-2">
          Manage your connections to external services, APIs, and communication platforms.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {integrations.map((integration) => (
          <Card key={integration.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: integration.status === 'Connected' ? '#22c55e' : integration.status === 'Configured' ? '#3b82f6' : '#94a3b8' }}>
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="flex gap-4">
                <div className={`p-3 rounded-xl ${integration.color} bg-opacity-10`}>
                  <integration.icon className={`h-8 w-8 ${integration.color.replace('bg-', 'text-')}`} />
                </div>
                <div>
                  <CardTitle className="text-xl">{integration.name}</CardTitle>
                  <CardDescription className="mt-1">{integration.description}</CardDescription>
                </div>
              </div>
              <Badge variant={
                integration.status === 'Connected' ? 'default' : 
                integration.status === 'Configured' ? 'secondary' : 'outline'
              }>
                {integration.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2 text-muted-foreground uppercase tracking-wider">Capabilities</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {integration.features.map((feature, i) => (
                    <Badge key={i} variant="secondary" className="bg-muted/50">
                      {feature}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center gap-3 pt-4 border-t">
                  <Button asChild className="flex-1">
                    <a href={integration.link}>
                      Manage Integration <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon">
                    <Settings2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Add New Integration Card */}
        <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center bg-muted/20 hover:bg-muted/30 transition-colors min-h-[300px]">
           <div className="p-4 rounded-full bg-background border shadow-sm mb-4">
             <Power className="h-8 w-8 text-muted-foreground" />
           </div>
           <h3 className="text-lg font-semibold">Add New Service</h3>
           <p className="text-sm text-muted-foreground max-w-xs mt-2 mb-6">
             Connect CRM, Payment Gateways, or other third-party APIs to extend functionality.
           </p>
           <Button variant="outline">Browse Marketplace</Button>
        </Card>
      </div>
    </div>
  );
}
