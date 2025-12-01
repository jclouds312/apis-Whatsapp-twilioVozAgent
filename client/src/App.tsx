import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OverviewPage from "@/pages/Overview";
import { AuthProvider } from "@/context/AuthContext";

import WhatsAppPage from "@/pages/WhatsApp";
import TwilioPage from "@/pages/Twilio";
import RetellPage from "@/pages/Retell";
import VerifyPage from "@/pages/Verify";
import ApiKeysPage from "@/pages/ApiKeys";
import ApiConsolePage from "@/pages/ApiConsole";
import SettingsPage from "@/pages/Settings";
import SystemLogsPage from "@/pages/SystemLogs";
import CrmPage from "@/pages/CRM";
import FunctionConnectPage from "@/pages/FunctionConnect";
import WorkflowSuggesterPage from "@/pages/WorkflowSuggester";
import AdminPage from "@/pages/Admin";
import DeploymentPage from "@/pages/Deployment";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={OverviewPage} />
        <Route path="/whatsapp" component={WhatsAppPage} />
        <Route path="/twilio" component={TwilioPage} />
        <Route path="/verify" component={VerifyPage} />
        <Route path="/retell" component={RetellPage} />
        <Route path="/crm" component={CrmPage} />
        <Route path="/function-connect" component={FunctionConnectPage} />
        <Route path="/workflow-suggester" component={WorkflowSuggesterPage} />
        <Route path="/api-keys" component={ApiKeysPage} />
        <Route path="/api-console" component={ApiConsolePage} />
        <Route path="/logs" component={SystemLogsPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/deployment" component={DeploymentPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
