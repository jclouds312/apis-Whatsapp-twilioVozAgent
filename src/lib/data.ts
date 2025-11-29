import type { ApiKey, Log, User, Workflow, ExposedApi, Conversation } from '@/lib/types';

export const userAvatar = "https://picsum.photos/seed/user1/100/100";

export const apiKeys: ApiKey[] = [
  { id: 'key_waba_1', service: 'WhatsApp Business', key: 'WA-xxxx-xxxx-xxxx-E7G8', status: 'active', createdAt: '2024-05-01' },
  { id: 'key_tw_1', service: 'Twilio', key: 'TW-xxxx-xxxx-xxxx-F9H1', status: 'active', createdAt: '2024-04-22' },
  { id: 'key_crm_1', service: 'CRM Hubspot', key: 'CRM-xxxx-xxxx-xxxx-A1B2', status: 'active', createdAt: '2024-03-15' },
  { id: 'key_waba_2', service: 'WhatsApp Business', key: 'WA-xxxx-xxxx-xxxx-C3D4', status: 'revoked', createdAt: '2023-11-10' },
];

export const logs: Log[] = [
  { id: 'log_1', timestamp: '2024-07-21T10:00:00Z', level: 'info', service: 'Function Connect', message: 'Workflow "New Lead from WA" triggered successfully.' },
  { id: 'log_2', timestamp: '2024-07-21T10:00:01Z', level: 'info', service: 'CRM Connector', message: 'Successfully created contact in CRM for +1...2345.' },
  { id: 'log_3', timestamp: '2024-07-21T10:05:14Z', level: 'warn', service: 'Twilio', message: 'Voice call to +1...5678 failed: No answer.' },
  { id: 'log_4', timestamp: '2024-07-21T10:10:22Z', level: 'error', service: 'API Exhibition', message: 'Endpoint /v1/products returned 500 Internal Server Error.' },
  { id: 'log_5', timestamp: '2024-07-21T10:12:00Z', level: 'info', service: 'WhatsApp', message: 'Sent template `order_confirmation` to +1...9012.' },
  { id: 'log_6', timestamp: '2024-07-21T09:55:30Z', level: 'info', service: 'Function Connect', message: 'Workflow "Support Ticket from Twilio" triggered.' },
  { id: 'log_7', timestamp: '2024-07-21T09:45:10Z', level: 'error', service: 'CRM Connector', message: 'Failed to update deal: Invalid ID `deal_abc`.' },
];

export const users: User[] = [
  { id: 'usr_1', name: 'Admin User', email: 'admin@omniflow.io', role: 'Admin', avatarUrl: userAvatar },
  { id: 'usr_2', name: 'John Agent', email: 'john.agent@omniflow.io', role: 'Agent', avatarUrl: 'https://picsum.photos/seed/user2/100/100' },
  { id: 'usr_3', name: 'Sarah Developer', email: 'sarah.dev@omniflow.io', role: 'Developer', avatarUrl: 'https://picsum.photos/seed/user3/100/100' },
  { id: 'usr_4', name: 'Mike Manager', email: 'mike.manager@omniflow.io', role: 'Manager', avatarUrl: 'https://picsum.photos/seed/user4/100/100' },
];

export const workflows: Workflow[] = [
    {
        id: 'wf_1',
        name: 'New Lead from WhatsApp',
        trigger: {
            service: 'WhatsApp',
            event: 'Inbound Message',
        },
        steps: [
            { name: 'Transform Data', description: 'Map WA message to CRM lead format.' },
            { name: 'Create CRM Lead', description: 'API call to POST /v1/leads.' },
            { name: 'Send Confirmation', description: 'Send `lead_received` template via WhatsApp.' },
        ],
        status: 'active',
        lastRun: '2024-07-21T10:00:00Z',
    },
    {
        id: 'wf_2',
        name: 'Support Ticket from Twilio Call',
        trigger: {
            service: 'Twilio',
            event: 'Inbound Call (Voicemail)',
        },
        steps: [
            { name: 'Transcribe Voicemail', description: 'Use Twilio transcription.' },
            { name: 'Create CRM Ticket', description: 'API call to POST /v1/tickets.' },
            { name: 'Notify Agent', description: 'Send internal notification.' },
        ],
        status: 'active',
        lastRun: '2024-07-21T09:55:30Z',
    },
    {
        id: 'wf_3',
        name: 'CRM Update to WhatsApp',
        trigger: {
            service: 'CRM',
            event: 'Deal Stage Changed',
        },
        steps: [
            { name: 'Filter for "Won"', description: 'Conditional rule: stage = Won.' },
            { name: 'Send Thank You Message', description: 'Send `deal_won` template via WhatsApp.' },
        ],
        status: 'inactive',
        lastRun: '2024-07-19T14:00:00Z',
    }
];

export const apiTrafficData = [
    { date: '2024-07-15', 'API Calls': 2400 },
    { date: '2024-07-16', 'API Calls': 1398 },
    { date: '2024-07-17', 'API Calls': 9800 },
    { date: '2024-07-18', 'API Calls': 3908 },
    { date: '2024-07-19', 'API Calls': 4800 },
    { date: '2024-07-20', 'API Calls': 3800 },
    { date: '2024-07-21', 'API Calls': 4300 },
];

export const exposedApis: ExposedApi[] = [
    { id: 'api_1', name: 'Get Products', description: 'Retrieves a list of all available products.', status: 'published', method: 'GET', endpoint: '/v1/products', version: '1.0.0' },
    { id: 'api_2', name: 'Create Order', description: 'Creates a new customer order.', status: 'published', method: 'POST', endpoint: '/v1/orders', version: '1.0.0' },
    { id: 'api_3', name: 'Get User Profile', description: 'Fetches profile for a given user ID.', status: 'draft', method: 'GET', endpoint: '/v2/users/{userId}', version: '2.0.0-beta' },
    { id: 'api_4', name: 'Update Inventory', description: 'Updates stock levels for a product.', status: 'deprecated', method: 'PUT', endpoint: '/v1/inventory', version: '1.0.0' },
];

export const conversations: Conversation[] = [
    {
        id: 'conv_1',
        contactName: 'Alice',
        contactAvatar: 'https://picsum.photos/seed/alice/100/100',
        lastMessage: 'Sure, I can do that. When do you need it by?',
        lastMessageTime: '2024-07-22T10:30:00Z',
        messages: [
            { id: 'msg_1_1', contactId: 'usr_2', content: 'Hey Alice, can you help me with the new design?', timestamp: '2024-07-22T10:29:00Z', isSender: false },
            { id: 'msg_1_2', contactId: 'usr_1', content: 'Sure, I can do that. When do you need it by?', timestamp: '2024-07-22T10:30:00Z', isSender: true },
        ],
    },
    {
        id: 'conv_2',
        contactName: 'Bob',
        contactAvatar: 'https://picsum.photos/seed/bob/100/100',
        lastMessage: 'Got it, thanks!',
        lastMessageTime: '2024-07-22T09:15:00Z',
        messages: [
            { id: 'msg_2_1', contactId: 'usr_1', content: 'Here is the report you requested.', timestamp: '2024-07-22T09:14:00Z', isSender: true },
            { id: 'msg_2_2', contactId: 'usr_3', content: 'Got it, thanks!', timestamp: '2024-07-22T09:15:00Z', isSender: false },
        ],
    },
    {
        id: 'conv_3',
        contactName: 'Charlie',
        contactAvatar: 'https://picsum.photos/seed/charlie/100/100',
        lastMessage: 'See you then!',
        lastMessageTime: '2024-07-21T18:45:00Z',
        messages: [
             { id: 'msg_3_1', contactId: 'usr_4', content: 'Meeting at 3 PM tomorrow.', timestamp: '2024-07-21T18:44:00Z', isSender: false },
             { id: 'msg_3_2', contactId: 'usr_1', content: 'See you then!', timestamp: '2024-07-21T18:45:00Z', isSender: true },
        ],
    },
];
