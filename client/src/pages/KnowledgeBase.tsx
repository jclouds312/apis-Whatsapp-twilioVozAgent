import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  FileText, 
  Globe, 
  Database, 
  BrainCircuit, 
  CheckCircle2,
  AlertCircle,
  RefreshCw
} from "lucide-react";

export default function KnowledgeBase() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Knowledge Base</h2>
          <p className="text-muted-foreground">Train your AI agent with custom data, documents, and websites.</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground shadow-[0_0_15px_-3px_hsl(var(--primary)/0.5)] hover:shadow-[0_0_20px_-3px_hsl(var(--primary)/0.6)] transition-all">
          <RefreshCw className="h-4 w-4" />
          Retrain Model
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Status Card */}
        <Card className="glass-panel md:col-span-3 bg-gradient-to-r from-card to-primary/5 border-primary/20">
           <CardContent className="p-6 flex items-center justify-between">
             <div className="flex items-center gap-4">
               <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/50">
                 <BrainCircuit className="h-6 w-6 text-emerald-500" />
               </div>
               <div>
                 <h3 className="font-bold text-lg">Model Status: Healthy</h3>
                 <p className="text-sm text-muted-foreground">Last trained 2 hours ago • 1,204 vectors indexed</p>
               </div>
             </div>
             <div className="hidden sm:block w-1/3 space-y-2">
               <div className="flex justify-between text-xs text-muted-foreground">
                 <span>Vector Usage</span>
                 <span>45%</span>
               </div>
               <Progress value={45} className="h-2" />
             </div>
           </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-2 space-y-6">
          <Tabs defaultValue="documents" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/50">
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="websites">Websites</TabsTrigger>
              <TabsTrigger value="qna">Q&A Pairs</TabsTrigger>
            </TabsList>
            
            <TabsContent value="documents" className="mt-4 space-y-4">
              <Card className="border-dashed border-2 border-border bg-muted/10">
                <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                   <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                     <Upload className="h-6 w-6 text-muted-foreground" />
                   </div>
                   <div>
                     <h4 className="font-medium">Upload training documents</h4>
                     <p className="text-sm text-muted-foreground mt-1">PDF, TXT, DOCX, or CSV (max 10MB)</p>
                   </div>
                   <Button variant="outline">Select Files</Button>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Indexed Files</h4>
                <div className="space-y-2">
                  {[
                    { name: "Company_Policy_2025.pdf", size: "2.4 MB", status: "Indexed", date: "Today" },
                    { name: "Product_Catalog_v3.xlsx", size: "1.1 MB", status: "Indexed", date: "Yesterday" },
                    { name: "Sales_Script_Objections.docx", size: "845 KB", status: "Processing", date: "Just now" },
                  ].map((file, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50 hover:bg-accent/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-blue-400" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{file.size} • {file.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         {file.status === 'Indexed' ? (
                           <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/10">Indexed</Badge>
                         ) : (
                           <Badge variant="outline" className="text-yellow-500 border-yellow-500/20 bg-yellow-500/10 animate-pulse">Processing</Badge>
                         )}
                         <Button variant="ghost" size="icon" className="h-8 w-8"><AlertCircle className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

             <TabsContent value="websites" className="mt-4 space-y-4">
              <Card className="glass-panel">
                <CardHeader>
                  <CardTitle>Crawl Websites</CardTitle>
                  <CardDescription>Enter a URL to scrape content for training.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="https://example.com/docs" />
                    <Button>Crawl</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="text-sm">Knowledge Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Tokens</span>
                <span className="font-mono text-sm">1.2M</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Chunks</span>
                <span className="font-mono text-sm">8,942</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Est. Cost</span>
                <span className="font-mono text-sm">$0.42/mo</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-blue-400">
                <CheckCircle2 className="h-4 w-4" />
                Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-blue-200/80 leading-relaxed">
                Upload documents in small chunks for better retrieval accuracy. PDF files with selectable text work best.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}