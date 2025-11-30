export type ApiKey = {
  id: string;
  service: string;
  key: string;
  description: string;
  status: 'active' | 'revoked';
  createdAt: any; // Allow any for Firestore Timestamp
  userId: string;
};

export type ApiLog = {
  id: string;
  timestamp: string; // ISO 8601 format
  level: 'info' | 'warn' | 'error';
  endpoint: string;
  requestBody: string;
  responseBody: string;
  statusCode: number;
  apiKeyId: string;
};

export type DashboardUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'Admin' | 'Agent' | 'Developer' | 'Manager';
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
  lastRun: any; // Allow any for Firestore Timestamp
  userId: string;
};

export type ExposedApi = {
  id: string;
  name: string;
  description: string;
  status: 'published' | 'draft' | 'deprecated';
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  version: string;
  userId: string;
};

export type Message = {
  id: string;
  contactId: string; // The ID of the other person in the conversation
  content: string;
  timestamp: any;
  isSender: boolean; // True if the current user sent the message
};



export type TwilioCall = {
  id: string;
  callSid: string;
  to: string;
  from: string;
  status: 'queued' | 'ringing' | 'in-progress' | 'completed' | 'busy' | 'failed' | 'no-answer' | 'canceled';
  direction: 'inbound' | 'outbound';
  duration: string;
  cost: number;
  createdAt: any;
  userId: string;
};

export type TwilioRecording = {
  id: string;
  callSid: string;
  recordingSid: string;
  duration: number;
  size: number;
  url: string;
  status: string;
  createdAt: any;
  userId: string;
};

export type VoiceUser = {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  status: 'active' | 'inactive';
  totalCalls: number;
  totalDuration: number;
  createdAt: any;
  userId: string;
};

export type Order = {
  id: string;
  date: string;
  total: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
};

export type Conversation = {
  id: string;
  contactName: string;
  contactEmail: string;
  contactAvatar: string;
  contactId: string; // Phone number for WhatsApp
  tags: string[];
  agentNotes: string;
  orderHistory: Order[];
  lastMessage: string;
  lastMessageTime: any; // Allow any for Firestore Timestamp
  userId: string;
};

    