import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import DashboardLayout from "@/components/layout/DashboardLayout";
import OverviewPage from "@/pages/Overview";
import { AuthProvider } from "@/context/AuthContext";

import AsteriskPage from "@/pages/Asterisk";
import WhatsAppPage from "@/pages/WhatsApp";
import TwilioPage from "@/pages/Twilio";
import RetellPage from "@/pages/Retell";
import VerifyPage from "@/pages/Verify";
import ApiKeysPage from "@/pages/ApiKeys";
import ApiConsolePage from "@/pages/ApiConsole";
import ApiDocumentationPage from "@/pages/ApiDocumentation";
import TwilioVoicePage from "@/pages/TwilioVoice";
import TwilioVoIPPage from "@/pages/TwilioVoIP";
import VoiceNotifications from "@/pages/VoiceNotifications";
import CrmIntegrationPage from "@/pages/CrmIntegration";
import EmbedWidgetsPage from "@/pages/EmbedWidgets";
import ApiKeyManagerPage from "@/pages/ApiKeyManager";
import FacebookIntegrationPage from "@/pages/FacebookIntegration";
import SettingsPage from "@/pages/Settings";
import SystemLogsPage from "@/pages/SystemLogs";
import CrmPage from "@/pages/CRM";
import CRMAdminPage from "@/pages/CRMAdmin";
import ApiKeyDashboardPage from "@/pages/ApiKeyDashboard";
import FunctionConnectPage from "@/pages/FunctionConnect";
import WorkflowSuggesterPage from "@/pages/WorkflowSuggester";
import AdminPage from "@/pages/Admin";
import DeploymentPage from "@/pages/Deployment";
import ApiKeyGeneratorPage from "@/pages/ApiKeyGenerator";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={OverviewPage} />
        <Route path="/asterisk" component={AsteriskPage} />
        <Route path="/whatsapp" component={WhatsAppPage} />
        <Route path="/twilio" component={TwilioPage} />
        <Route path="/twilio-voice" component={TwilioVoicePage} />
        <Route path="/twilio-voip" component={TwilioVoIPPage} />
        <Route path="/voice-notifications" component={VoiceNotifications} />
        <Route path="/crm-integration" component={CrmIntegrationPage} />
        <Route path="/embed-widgets" component={EmbedWidgetsPage} />
        <Route path="/api-key-manager" component={ApiKeyManagerPage} />
        <Route path="/facebook-integration" component={FacebookIntegrationPage} />
        <Route path="/verify" component={VerifyPage} />
        <Route path="/retell" component={RetellPage} />
        <Route path="/crm" component={CrmPage} />
        <Route path="/function-connect" component={FunctionConnectPage} />
        <Route path="/workflow-suggester" component={WorkflowSuggesterPage} />
        <Route path="/api-keys" component={ApiKeysPage} />
        <Route path="/api-key-generator" component={ApiKeyGeneratorPage} />
        <Route path="/api-console" component={ApiConsolePage} />
        <Route path="/api-key-dashboard" component={ApiKeyDashboardPage} />
        <Route path="/logs" component={SystemLogsPage} />
        <Route path="/admin" component={AdminPage} />
        <Route path="/crm-admin" component={CRMAdminPage} />
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