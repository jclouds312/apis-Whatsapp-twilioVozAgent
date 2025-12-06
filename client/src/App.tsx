import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import AgentControl from "@/pages/AgentControl";
import Logs from "@/pages/Logs";
import Settings from "@/pages/Settings";
import Workflows from "@/pages/Workflows";
import Contacts from "@/pages/Contacts";
import KnowledgeBase from "@/pages/KnowledgeBase";

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/agent" component={AgentControl} />
        <Route path="/workflows" component={Workflows} />
        <Route path="/contacts" component={Contacts} />
        <Route path="/knowledge" component={KnowledgeBase} />
        <Route path="/logs" component={Logs} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;