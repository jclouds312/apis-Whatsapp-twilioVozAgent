
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Server,
  Phone,
  Code,
  FileCode,
  CheckCircle,
  AlertCircle,
  Play,
  Save,
  Download,
  Upload
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TwilioInfrastructurePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("resources");
  const [terraformConfig, setTerraformConfig] = useState(`terraform {
  required_providers {
    twilio = {
      source = "twilio/twilio"
      version = "~> 0.18"
    }
  }
}

provider "twilio" {
  account_sid = var.twilio_account_sid
  auth_token  = var.twilio_auth_token
}

resource "twilio_phone_number" "example" {
  country_code = "US"
  type         = "local"
  area_code    = "415"
}

resource "twilio_messaging_service" "example" {
  friendly_name = "My Messaging Service"
}`);

  const handleApplyConfig = () => {
    toast({
      title: "Terraform Apply Started",
      description: "Infrastructure changes are being applied...",
    });
  };

  const handlePlanConfig = () => {
    toast({
      title: "Terraform Plan Generated",
      description: "Review the planned changes in the output.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-950 via-slate-900 to-slate-950 border border-purple-500/30 p-8 shadow-2xl">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-[-50%] right-[-10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[100px]" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30 px-3 py-1">
                Infrastructure as Code
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 px-3 py-1">
                Terraform Provider
              </Badge>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Twilio Infrastructure Manager
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl">
              Gestiona recursos de Twilio usando Terraform. Automatiza la creación de números, servicios de mensajería y configuraciones.
            </p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" className="border-slate-700 hover:bg-slate-800">
              <Download className="mr-2 h-4 w-4" /> Export Config
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Upload className="mr-2 h-4 w-4" /> Import State
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Managed Resources", value: "12", sub: "3 Pending", icon: Server, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
          { label: "Phone Numbers", value: "5", sub: "All Active", icon: Phone, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
          { label: "Last Apply", value: "2h", sub: "Successful", icon: CheckCircle, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500/20" },
          { label: "Config Files", value: "8", sub: "Version 1.2", icon: FileCode, color: "text-yellow-400", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
        ].map((stat, i) => (
          <Card key={i} className={`border ${stat.border} ${stat.bg} backdrop-blur-sm`}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                  <h3 className={`text-3xl font-bold mt-2 ${stat.color}`}>{stat.value}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{stat.sub}</p>
                </div>
                <stat.icon className={`h-6 w-6 ${stat.color} opacity-70`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-slate-900/50 border border-slate-800 p-1">
          <TabsTrigger value="resources" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
            <Server className="h-4 w-4 mr-2" /> Resources
          </TabsTrigger>
          <TabsTrigger value="config" className="data-[state=active]:bg-slate-800">
            <Code className="h-4 w-4 mr-2" /> Configuration
          </TabsTrigger>
          <TabsTrigger value="state" className="data-[state=active]:bg-slate-800">
            <FileCode className="h-4 w-4 mr-2" /> State
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle>Phone Numbers</CardTitle>
                <CardDescription>Managed Twilio phone numbers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { number: "+1 (415) 555-0123", type: "Local", status: "Active" },
                  { number: "+1 (415) 555-0124", type: "Toll-Free", status: "Active" },
                  { number: "+1 (415) 555-0125", type: "Local", status: "Pending" },
                ].map((phone, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded bg-slate-900/50 border border-slate-800">
                    <div>
                      <p className="font-medium">{phone.number}</p>
                      <p className="text-xs text-muted-foreground">{phone.type}</p>
                    </div>
                    <Badge variant={phone.status === "Active" ? "default" : "outline"}>
                      {phone.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-800 bg-slate-950/50">
              <CardHeader>
                <CardTitle>Messaging Services</CardTitle>
                <CardDescription>Configured messaging services</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: "Production Messaging", numbers: 3, status: "Active" },
                  { name: "Development Service", numbers: 1, status: "Active" },
                  { name: "Marketing Campaigns", numbers: 2, status: "Inactive" },
                ].map((service, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded bg-slate-900/50 border border-slate-800">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.numbers} numbers</p>
                    </div>
                    <Badge variant={service.status === "Active" ? "default" : "outline"}>
                      {service.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="config" className="space-y-6">
          <Card className="border-slate-800 bg-slate-950/50">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Terraform Configuration</CardTitle>
                  <CardDescription>Edit your infrastructure as code</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePlanConfig}>
                    <Code className="h-4 w-4 mr-2" /> Plan
                  </Button>
                  <Button size="sm" onClick={handleApplyConfig} className="bg-purple-600 hover:bg-purple-700">
                    <Play className="h-4 w-4 mr-2" /> Apply
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>main.tf</Label>
                  <Textarea 
                    value={terraformConfig}
                    onChange={(e) => setTerraformConfig(e.target.value)}
                    className="font-mono text-sm h-[400px] bg-slate-900/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Save className="h-4 w-4 mr-2" /> Save Configuration
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileCode className="h-4 w-4 mr-2" /> Validate Syntax
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="state" className="space-y-6">
          <Card className="border-slate-800 bg-slate-950/50">
            <CardHeader>
              <CardTitle>Terraform State</CardTitle>
              <CardDescription>Current infrastructure state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded bg-slate-900/50 border border-slate-800">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                    <h4 className="font-semibold">State Status: Healthy</h4>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Version</p>
                      <p className="font-medium">4</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Serial</p>
                      <p className="font-medium">12</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Terraform Version</p>
                      <p className="font-medium">1.6.0</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Last Modified</p>
                      <p className="font-medium">2 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
