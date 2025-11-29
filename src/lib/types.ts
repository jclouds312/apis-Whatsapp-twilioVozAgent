export type ApiKey = {
  id: string;
  service: string;
  key: string;
  status: 'active' | 'revoked';
  createdAt: string;
};

export type Log = {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  service: string;
  message: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Agent' | 'Developer' | 'Manager';
  avatarUrl: string;
};

export type Workflow = {
    id: string;
    name: string;
    trigger: {
        service: 'WhatsApp' | 'Twilio' | 'CRM';
        event: string;
    };
    steps: {
        name: string;
        description: string;
    }[];
    status: 'active' | 'inactive';
    lastRun: string;
}
