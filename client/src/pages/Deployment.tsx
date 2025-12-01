import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, GitBranch, Check, AlertCircle, Zap, Code } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export default function DeploymentPage() {
  const [selectedPlatform, setSelectedPlatform] = useState<"aws" | "vercel" | "netlify">("vercel");
  const [awsConfig, setAwsConfig] = useState({ region: "us-east-1", instanceType: "t3.medium" });
  const [vercelConfig, setVercelConfig] = useState({ team: "", project: "" });
  const [netlifyConfig, setNetlifyConfig] = useState({ token: "", siteId: "" });

  const deployMutation = useMutation({
    mutationFn: async (platform: string) => {
      const res = await fetch("/api/deployments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          config: platform === "aws" ? awsConfig : platform === "vercel" ? vercelConfig : netlifyConfig,
        }),
      });
      return res.json();
    },
    onSuccess: (data) => {
      toast.success(`Deployment to ${selectedPlatform.toUpperCase()} initiated!`);
    },
    onError: () => toast.error("Deployment failed"),
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Cloud className="h-8 w-8 text-blue-500" />
            Deployment & Hosting
          </h2>
          <p className="text-muted-foreground">Deploy your API management platform to production.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { name: "AWS", icon: "☁️", desc: "EC2, Lambda, RDS" },
          { name: "Vercel", icon: "⚡", desc: "Serverless Platform" },
          { name: "Netlify", icon: "🚀", desc: "JAMstack Hosting" },
        ].map((platform) => (
          <Card
            key={platform.name}
            className={`cursor-pointer transition-all ${selectedPlatform === platform.name.toLowerCase() ? "border-primary bg-primary/5" : "border-border/50"}`}
            onClick={() => setSelectedPlatform(platform.name.toLowerCase() as any)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{platform.icon} {platform.name}</CardTitle>
              <CardDescription>{platform.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              <Badge variant={selectedPlatform === platform.name.toLowerCase() ? "default" : "secondary"}>
                {selectedPlatform === platform.name.toLowerCase() ? "Selected" : "Available"}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="config" className="space-y-4">
        <TabsList className="bg-card border border-border/50">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="deployments">Deployments</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          <TabsTrigger value="docs">Documentation</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>
                {selectedPlatform === "aws" ? "AWS Configuration" : selectedPlatform === "vercel" ? "Vercel Configuration" : "Netlify Configuration"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedPlatform === "aws" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>AWS Region</Label>
                    <select
                      value={awsConfig.region}
                      onChange={(e) => setAwsConfig({ ...awsConfig, region: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-input"
                    >
                      <option>us-east-1</option>
                      <option>us-west-2</option>
                      <option>eu-west-1</option>
                      <option>ap-southeast-1</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>EC2 Instance Type</Label>
                    <select
                      value={awsConfig.instanceType}
                      onChange={(e) => setAwsConfig({ ...awsConfig, instanceType: e.target.value })}
                      className="w-full px-3 py-2 rounded-md border border-input"
                    >
                      <option>t3.micro</option>
                      <option>t3.small</option>
                      <option>t3.medium</option>
                      <option>t3.large</option>
                    </select>
                  </div>
                </div>
              )}

              {selectedPlatform === "vercel" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Vercel Team</Label>
                    <Input placeholder="your-team-slug" value={vercelConfig.team} onChange={(e) => setVercelConfig({ ...vercelConfig, team: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Project Name</Label>
                    <Input placeholder="api-platform" value={vercelConfig.project} onChange={(e) => setVercelConfig({ ...vercelConfig, project: e.target.value })} />
                  </div>
                </div>
              )}

              {selectedPlatform === "netlify" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Netlify Auth Token</Label>
                    <Input type="password" placeholder="Your Netlify personal access token" value={netlifyConfig.token} onChange={(e) => setNetlifyConfig({ ...netlifyConfig, token: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Site ID</Label>
                    <Input placeholder="site-id.netlify.app" value={netlifyConfig.siteId} onChange={(e) => setNetlifyConfig({ ...netlifyConfig, siteId: e.target.value })} />
                  </div>
                </div>
              )}

              <Button className="w-full" onClick={() => deployMutation.mutate(selectedPlatform)} disabled={deployMutation.isPending}>
                {deployMutation.isPending ? "Deploying..." : `Deploy to ${selectedPlatform.toUpperCase()}`}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deployments">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Deployment History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { date: "2024-12-01", platform: "vercel", status: "success", version: "1.2.5" },
                  { date: "2024-11-28", platform: "aws", status: "success", version: "1.2.4" },
                  { date: "2024-11-25", platform: "netlify", status: "success", version: "1.2.3" },
                ].map((deploy, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border border-border/50 rounded-lg hover:bg-muted/30">
                    <div>
                      <p className="font-medium capitalize">{deploy.platform} - v{deploy.version}</p>
                      <p className="text-xs text-muted-foreground">{deploy.date}</p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-500 border-green-500/30 flex items-center gap-1">
                      <Check className="h-3 w-3" /> {deploy.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { metric: "Uptime", value: "99.98%", status: "good" },
                  { metric: "Response Time", value: "145ms", status: "good" },
                  { metric: "Error Rate", value: "0.02%", status: "good" },
                ].map((item) => (
                  <div key={item.metric} className="flex justify-between items-center p-3 bg-muted/30 rounded-lg">
                    <span className="text-sm">{item.metric}</span>
                    <span className="font-mono text-sm font-medium">{item.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-card/50 border-border/50">
              <CardHeader>
                <CardTitle>Resource Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { resource: "CPU", usage: 34 },
                  { resource: "Memory", usage: 52 },
                  { resource: "Storage", usage: 23 },
                ].map((item) => (
                  <div key={item.resource}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{item.resource}</span>
                      <span className="font-mono">{item.usage}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${item.usage}%` }} />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="docs">
          <Card className="bg-card/50 border-border/50">
            <CardHeader>
              <CardTitle>Deployment Documentation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold flex items-center gap-2"><GitBranch className="h-4 w-4" /> Pre-deployment Checklist</h3>
                <ul className="text-sm space-y-2 ml-6">
                  <li>✓ Environment variables configured</li>
                  <li>✓ Database migrations run</li>
                  <li>✓ API keys validated</li>
                  <li>✓ SSL certificates ready</li>
                  <li>✓ Load testing completed</li>
                </ul>
              </div>
              <div className="bg-muted/30 p-4 rounded-lg space-y-3">
                <h3 className="font-semibold flex items-center gap-2"><Zap className="h-4 w-4" /> Quick Start</h3>
                <p className="text-sm text-muted-foreground">
                  1. Configure your platform in the form above<br/>
                  2. Click "Deploy" to start the deployment process<br/>
                  3. Monitor the deployment in the "Deployments" tab<br/>
                  4. Check performance metrics in real-time
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
