export type ApiKey = {
  id: string;
  service: string;
  key: string;
  status: 'active' | 'revoked';
  createdAt: any; // Allow any for Firestore Timestamp
  userId: string;
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
  timestamp: string;
  isSender: boolean; // True if the current user sent the message
};

export type Order = {
  id: string;
  date: string;
  total: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
}

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
  messages: Message[];
  userId: string;
};
